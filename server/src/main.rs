//! Gatita server: serves the web app, keeps the learner's progress in the data folder and serves the course PDFs.
//!
//! Environment:
//!   DATA_DIR    folder holding everything the user creates (default ./data)
//!   PUBLIC_DIR  built web app (default ./web/dist)
//!   PORT        port to listen on (default 8080)
//!   CONTENT_DIR course content bundled with the app (default ./content); files in DATA_DIR/content are added on top
//!               (same path = replaces the bundled file), so courses can be added on the NAS without rebuilding
//!   AUTH_USER / AUTH_PASSWORD  optional password for the whole app (HTTP basic auth)
//!
//! `gatita healthcheck` exits 0 when the server answers on /healthz (used by the Docker HEALTHCHECK).

mod merge;
mod store;

use axum::{
    body::{Body, Bytes},
    extract::{DefaultBodyLimit, Path as UrlPath, Request, State},
    http::{header, HeaderMap, HeaderValue, Method, StatusCode},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use serde_json::{json, Value};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use store::Store;
use tokio::sync::Mutex;
use tower::ServiceExt;
use tower_http::services::{ServeDir, ServeFile};

const CLIENT_HEADER: &str = "x-gatita-client";
const MAX_PDF: usize = 300 * 1024 * 1024;

#[derive(Clone)]
struct App {
    store: Arc<Mutex<Store>>,
    data_dir: PathBuf,
    content_dir: PathBuf,
    version: String,
    auth: Option<String>,
}

fn env_or(key: &str, default: &str) -> String {
    std::env::var(key).ok().filter(|s| !s.is_empty()).unwrap_or_else(|| default.to_string())
}

fn main() {
    let port: u16 = env_or("PORT", "8080").parse().unwrap_or(8080);
    if std::env::args().nth(1).as_deref() == Some("healthcheck") {
        std::process::exit(if healthcheck(port) { 0 } else { 1 });
    }
    let data_dir = PathBuf::from(env_or("DATA_DIR", "./data"));
    let public_dir = PathBuf::from(env_or("PUBLIC_DIR", "./web/dist"));
    let version = env_or("APP_VERSION", "dev");
    let content_dir = PathBuf::from(env_or("CONTENT_DIR", "./content"));
    // SAFETY: plain libc call without arguments.
    let uid = unsafe { libc::geteuid() };
    println!("[gatita] starting version {version} as uid {uid}, data folder {}", data_dir.display());

    if let Err(e) = std::fs::create_dir_all(&data_dir) {
        eprintln!("[gatita] cannot create the data folder {}: {e}", data_dir.display());
        std::process::exit(1);
    }
    match drop_privileges(&data_dir) {
        Ok(Some((u, g))) => println!("[gatita] running as uid {u}, gid {g} (owner of the data folder)"),
        Ok(None) => {}
        Err(e) => {
            eprintln!("[gatita] {e}");
            std::process::exit(1);
        }
    }
    if let Err(e) = check_writable(&data_dir) {
        eprintln!("[gatita] {e}");
        std::process::exit(1);
    }
    let _ = std::fs::create_dir_all(data_dir.join("pdf"));
    let _ = std::fs::create_dir_all(data_dir.join("content"));
    let store = match Store::open(&data_dir) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("[gatita] {e}");
            std::process::exit(1);
        }
    };
    let auth = match (std::env::var("AUTH_USER"), std::env::var("AUTH_PASSWORD")) {
        (Ok(u), Ok(p)) if !u.is_empty() && !p.is_empty() => Some(format!("Basic {}", base64(format!("{u}:{p}").as_bytes()))),
        _ => None,
    };
    let app = App { store: Arc::new(Mutex::new(store)), data_dir, content_dir, version, auth };

    let rt = tokio::runtime::Builder::new_multi_thread().enable_all().build().expect("tokio runtime");
    rt.block_on(async move {
        let router = router(app, &public_dir);
        let listener = match tokio::net::TcpListener::bind(("0.0.0.0", port)).await {
            Ok(l) => l,
            Err(e) => {
                eprintln!("[gatita] cannot listen on port {port}: {e}");
                std::process::exit(1);
            }
        };
        println!("[gatita] listening on http://0.0.0.0:{port}");
        axum::serve(listener, router).with_graceful_shutdown(shutdown()).await.expect("server");
    });
}

async fn shutdown() {
    let ctrl_c = async {
        let _ = tokio::signal::ctrl_c().await;
    };
    #[cfg(unix)]
    let term = async {
        if let Ok(mut s) = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate()) {
            s.recv().await;
        }
    };
    #[cfg(not(unix))]
    let term = std::future::pending::<()>();
    tokio::select! { _ = ctrl_c => {}, _ = term => {} }
    println!("[gatita] stopping");
}

fn router(app: App, public_dir: &Path) -> Router {
    let index = public_dir.join("index.html");
    let statics = ServeDir::new(public_dir).append_index_html_on_directories(true).fallback(ServeFile::new(index));
    Router::new()
        .route("/healthz", get(|| async { "ok" }))
        .route("/api/version", get(version))
        .route("/api/state", get(get_state).put(put_state))
        .route("/api/state/import", axum::routing::post(import_state))
        .route("/api/backups", get(list_backups))
        .route("/api/content", get(get_content))
        .route("/api/courses", get(list_pdfs))
        .route("/api/courses/{id}/pdf", get(get_pdf).put(put_pdf))
        .fallback_service(statics)
        .layer(DefaultBodyLimit::max(MAX_PDF))
        .layer(middleware::from_fn_with_state(app.clone(), guard))
        .with_state(app)
}

/// Optional password, CSRF guard on writes and security headers on every answer.
async fn guard(State(app): State<App>, req: Request, next: Next) -> Response {
    let path = req.uri().path().to_string();
    if let Some(expected) = &app.auth {
        if path != "/healthz" {
            let ok = req.headers().get(header::AUTHORIZATION).and_then(|v| v.to_str().ok()) == Some(expected.as_str());
            if !ok {
                return Response::builder()
                    .status(StatusCode::UNAUTHORIZED)
                    .header(header::WWW_AUTHENTICATE, "Basic realm=\"Gatita\", charset=\"UTF-8\"")
                    .body(Body::from("Mot de passe requis"))
                    .unwrap();
            }
        }
    }
    let write = !matches!(*req.method(), Method::GET | Method::HEAD | Method::OPTIONS);
    if write && path.starts_with("/api/") && req.headers().get(CLIENT_HEADER).is_none() {
        return (StatusCode::FORBIDDEN, "missing client header").into_response();
    }
    let mut res = next.run(req).await;
    let h = res.headers_mut();
    h.insert(header::X_CONTENT_TYPE_OPTIONS, HeaderValue::from_static("nosniff"));
    h.insert(header::REFERRER_POLICY, HeaderValue::from_static("same-origin"));
    h.insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static(
            "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; \
             img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
        ),
    );
    if path.starts_with("/api/") || path == "/" || path.ends_with(".html") || path.ends_with("sw.js") || path.ends_with(".webmanifest") {
        h.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-cache"));
    } else if path.contains("/assets/") {
        h.insert(header::CACHE_CONTROL, HeaderValue::from_static("public, max-age=31536000, immutable"));
    }
    res
}

async fn version(State(app): State<App>) -> Json<Value> {
    Json(json!({"version": app.version}))
}

async fn get_state(State(app): State<App>) -> Json<Value> {
    let s = app.store.lock().await;
    Json(json!({"rev": s.rev, "data": s.data}))
}

async fn put_state(State(app): State<App>, Json(body): Json<Value>) -> Response {
    let Some(data) = body.get("data").filter(|d| d.is_object()) else {
        return (StatusCode::BAD_REQUEST, "expected {\"data\": {...}}").into_response();
    };
    let mut s = app.store.lock().await;
    match s.save(data) {
        Ok(()) => Json(json!({"rev": s.rev, "data": s.data})).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, format!("save failed: {e}")).into_response(),
    }
}

/// Replaces the whole progress with an exported file (a snapshot of the current progress is taken first).
async fn import_state(State(app): State<App>, Json(body): Json<Value>) -> Response {
    let data = body.get("data").cloned().unwrap_or(body);
    if !data.is_object() {
        return (StatusCode::BAD_REQUEST, "not a progress export").into_response();
    }
    let mut s = app.store.lock().await;
    match s.replace(data) {
        Ok(()) => Json(json!({"rev": s.rev, "data": s.data})).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, format!("import failed: {e}")).into_response(),
    }
}

async fn list_backups(State(app): State<App>) -> Json<Value> {
    let s = app.store.lock().await;
    Json(json!({"backups": s.backups()}))
}

const MAX_CONTENT: u64 = 50 * 1024 * 1024;

/// Collects the .md and .sql files under `root` as { "relative/path": "text" }.
fn collect(root: &Path, out: &mut serde_json::Map<String, Value>, total: &mut u64) {
    fn walk(root: &Path, dir: &Path, out: &mut serde_json::Map<String, Value>, total: &mut u64, depth: usize) {
        if depth > 8 {
            return;
        }
        let Ok(rd) = std::fs::read_dir(dir) else { return };
        for e in rd.flatten() {
            let p = e.path();
            let name = e.file_name().to_string_lossy().to_string();
            if name.starts_with('.') {
                continue;
            }
            let Ok(ft) = e.file_type() else { continue };
            if ft.is_dir() {
                walk(root, &p, out, total, depth + 1);
            } else if ft.is_file() && (name.ends_with(".md") || name.ends_with(".sql")) {
                let size = e.metadata().map(|m| m.len()).unwrap_or(0);
                if *total + size > MAX_CONTENT {
                    continue;
                }
                if let (Ok(text), Ok(rel)) = (std::fs::read_to_string(&p), p.strip_prefix(root)) {
                    *total += size;
                    let key = rel.components().map(|c| c.as_os_str().to_string_lossy().to_string()).collect::<Vec<_>>().join("/");
                    out.insert(key, Value::String(text));
                }
            }
        }
    }
    walk(root, root, out, total, 0);
}

async fn get_content(State(app): State<App>) -> Json<Value> {
    let (bundled, extra) = (app.content_dir.clone(), app.data_dir.join("content"));
    let files = tokio::task::spawn_blocking(move || {
        let mut out = serde_json::Map::new();
        let mut total = 0;
        collect(&bundled, &mut out, &mut total);
        collect(&extra, &mut out, &mut total);
        out
    })
    .await
    .unwrap_or_default();
    Json(json!({"files": files}))
}

fn valid_id(id: &str) -> bool {
    !id.is_empty() && id.len() <= 64 && id.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-')
}

fn pdf_path(app: &App, id: &str) -> PathBuf {
    app.data_dir.join("pdf").join(format!("{id}.pdf"))
}

async fn list_pdfs(State(app): State<App>) -> Json<Value> {
    let mut out = serde_json::Map::new();
    if let Ok(rd) = std::fs::read_dir(app.data_dir.join("pdf")) {
        for e in rd.flatten() {
            let name = e.file_name().to_string_lossy().to_string();
            if let Some(id) = name.strip_suffix(".pdf").filter(|id| valid_id(id)) {
                let size = e.metadata().map(|m| m.len()).unwrap_or(0);
                out.insert(id.to_string(), json!({"size": size}));
            }
        }
    }
    Json(json!({"pdf": out}))
}

async fn get_pdf(State(app): State<App>, UrlPath(id): UrlPath<String>, req: Request) -> Response {
    if !valid_id(&id) {
        return StatusCode::NOT_FOUND.into_response();
    }
    let path = pdf_path(&app, &id);
    if !path.is_file() {
        return (StatusCode::NOT_FOUND, "PDF not uploaded yet").into_response();
    }
    match ServeFile::new(path).oneshot(req).await {
        Ok(mut res) => {
            res.headers_mut().insert(header::CONTENT_TYPE, HeaderValue::from_static("application/pdf"));
            res.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

async fn put_pdf(State(app): State<App>, UrlPath(id): UrlPath<String>, _h: HeaderMap, body: Bytes) -> Response {
    if !valid_id(&id) {
        return StatusCode::NOT_FOUND.into_response();
    }
    if !body.starts_with(b"%PDF-") {
        return (StatusCode::BAD_REQUEST, "this is not a PDF file").into_response();
    }
    let path = pdf_path(&app, &id);
    let res = tokio::task::spawn_blocking(move || store::write_atomic(&path, &body)).await;
    match res {
        Ok(Ok(())) => Json(json!({"ok": true})).into_response(),
        Ok(Err(e)) => (StatusCode::INTERNAL_SERVER_ERROR, format!("write failed: {e}")).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

fn base64(input: &[u8]) -> String {
    const T: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::new();
    for chunk in input.chunks(3) {
        let b = [chunk[0], *chunk.get(1).unwrap_or(&0), *chunk.get(2).unwrap_or(&0)];
        let n = ((b[0] as u32) << 16) | ((b[1] as u32) << 8) | b[2] as u32;
        for i in 0..4 {
            if i <= chunk.len() {
                out.push(T[((n >> (18 - 6 * i)) & 63) as usize] as char);
            } else {
                out.push('=');
            }
        }
    }
    out
}

fn healthcheck(port: u16) -> bool {
    use std::io::{Read, Write};
    let Ok(mut s) = std::net::TcpStream::connect(("127.0.0.1", port)) else { return false };
    let _ = s.set_read_timeout(Some(std::time::Duration::from_secs(4)));
    if s.write_all(b"GET /healthz HTTP/1.0\r\nHost: localhost\r\n\r\n").is_err() {
        return false;
    }
    let mut buf = String::new();
    let _ = s.read_to_string(&mut buf);
    buf.starts_with("HTTP/1.0 200") || buf.starts_with("HTTP/1.1 200")
}

fn check_writable(dir: &Path) -> Result<(), String> {
    let probe = dir.join(".write-test");
    std::fs::write(&probe, b"ok").and_then(|_| std::fs::remove_file(&probe)).map_err(|e| {
        format!(
            "{} is not writable by this user (uid {}): {e}. Fix the folder permissions or set `user: \"UID:GID\"` of the folder owner in docker-compose.yml.",
            dir.display(),
            // SAFETY: plain libc call without arguments.
            unsafe { libc::geteuid() }
        )
    })
}

/// When started as root (the Docker default), run as the owner of the data folder, or as uid 1000 when Docker created the
/// folder as root, and hand the folder to that user. Done before listening on the network.
#[cfg(unix)]
fn drop_privileges(dir: &Path) -> Result<Option<(u32, u32)>, String> {
    use std::os::unix::fs::MetadataExt;
    // SAFETY: plain libc calls; their return values are checked.
    unsafe {
        if libc::geteuid() != 0 {
            return Ok(None);
        }
        let meta = std::fs::metadata(dir).map_err(|e| format!("cannot read {}: {e}", dir.display()))?;
        let (mut uid, mut gid) = (meta.uid(), meta.gid());
        if uid == 0 {
            uid = 1000;
            gid = 1000;
        }
        fn chown_tree(p: &Path, uid: u32, gid: u32) {
            if let Ok(m) = std::fs::symlink_metadata(p) {
                if m.uid() != uid || m.gid() != gid {
                    let _ = std::os::unix::fs::lchown(p, Some(uid), Some(gid));
                }
                if m.is_dir() {
                    if let Ok(rd) = std::fs::read_dir(p) {
                        for e in rd.flatten() {
                            chown_tree(&e.path(), uid, gid);
                        }
                    }
                }
            }
        }
        chown_tree(dir, uid, gid);
        if libc::setgroups(0, std::ptr::null()) != 0 || libc::setgid(gid) != 0 || libc::setuid(uid) != 0 {
            return Err(format!("could not switch to uid {uid}, gid {gid}"));
        }
        Ok(Some((uid, gid)))
    }
}

#[cfg(not(unix))]
fn drop_privileges(_dir: &Path) -> Result<Option<(u32, u32)>, String> {
    Ok(None)
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::Request as HttpRequest;

    fn test_app(dir: &Path) -> Router {
        std::fs::create_dir_all(dir.join("pdf")).unwrap();
        let public = dir.join("public");
        std::fs::create_dir_all(&public).unwrap();
        std::fs::write(public.join("index.html"), "<div id=\"root\"></div>").unwrap();
        let content = dir.join("bundled");
        std::fs::create_dir_all(content.join("m/c")).unwrap();
        std::fs::write(content.join("m/subject.md"), "bundled").unwrap();
        std::fs::write(content.join("m/c/course.md"), "bundled").unwrap();
        std::fs::write(content.join("m/c/image.png"), "x").unwrap();
        std::fs::create_dir_all(dir.join("content/m")).unwrap();
        std::fs::write(dir.join("content/m/subject.md"), "from the NAS").unwrap();
        let app = App {
            store: Arc::new(Mutex::new(Store::open(dir).unwrap())),
            data_dir: dir.to_path_buf(),
            content_dir: content,
            version: "test".into(),
            auth: None,
        };
        router(app, &public)
    }

    async fn body_json(res: Response) -> Value {
        let bytes = axum::body::to_bytes(res.into_body(), usize::MAX).await.unwrap();
        serde_json::from_slice(&bytes).unwrap()
    }

    #[tokio::test]
    async fn state_roundtrip_and_merge() {
        let dir = tempfile::tempdir().unwrap();
        let app = test_app(dir.path());
        let put = |body: &str| {
            HttpRequest::put("/api/state").header("content-type", "application/json").header(CLIENT_HEADER, "1").body(Body::from(body.to_string())).unwrap()
        };
        let r = app.clone().oneshot(put(r#"{"data":{"attempts":{"a":{"ok":2}}}}"#)).await.unwrap();
        assert_eq!(r.status(), 200);
        let r = app.clone().oneshot(put(r#"{"data":{"attempts":{"b":{"ok":1},"a":{"ok":1}}}}"#)).await.unwrap();
        let v = body_json(r).await;
        assert_eq!(v["data"]["attempts"]["a"]["ok"], 2);
        assert_eq!(v["data"]["attempts"]["b"]["ok"], 1);
        let r = app.clone().oneshot(HttpRequest::get("/api/state").body(Body::empty()).unwrap()).await.unwrap();
        assert_eq!(body_json(r).await["rev"], 2);
    }

    #[tokio::test]
    async fn writes_need_the_client_header() {
        let dir = tempfile::tempdir().unwrap();
        let app = test_app(dir.path());
        let r = app
            .oneshot(HttpRequest::put("/api/state").header("content-type", "application/json").body(Body::from(r#"{"data":{}}"#)).unwrap())
            .await
            .unwrap();
        assert_eq!(r.status(), 403);
    }

    #[tokio::test]
    async fn pdf_upload_and_download() {
        let dir = tempfile::tempdir().unwrap();
        let app = test_app(dir.path());
        let r = app.clone().oneshot(HttpRequest::get("/api/courses/si-c1/pdf").body(Body::empty()).unwrap()).await.unwrap();
        assert_eq!(r.status(), 404);
        let bad = app.clone().oneshot(HttpRequest::put("/api/courses/si-c1/pdf").header(CLIENT_HEADER, "1").body(Body::from("hello")).unwrap()).await.unwrap();
        assert_eq!(bad.status(), 400);
        let ok = app.clone().oneshot(HttpRequest::put("/api/courses/si-c1/pdf").header(CLIENT_HEADER, "1").body(Body::from("%PDF-1.7 test")).unwrap()).await.unwrap();
        assert_eq!(ok.status(), 200);
        let r = app.clone().oneshot(HttpRequest::get("/api/courses/si-c1/pdf").body(Body::empty()).unwrap()).await.unwrap();
        assert_eq!(r.status(), 200);
        assert_eq!(r.headers()[header::CONTENT_TYPE], "application/pdf");
        let r = app.clone().oneshot(HttpRequest::get("/api/courses").body(Body::empty()).unwrap()).await.unwrap();
        assert_eq!(body_json(r).await["pdf"]["si-c1"]["size"], 13);
        let r = app.oneshot(HttpRequest::get("/api/courses/..%2Fstate/pdf").body(Body::empty()).unwrap()).await.unwrap();
        assert_eq!(r.status(), 404);
    }

    #[tokio::test]
    async fn unknown_paths_serve_the_app() {
        let dir = tempfile::tempdir().unwrap();
        let app = test_app(dir.path());
        let r = app.oneshot(HttpRequest::get("/some/route").body(Body::empty()).unwrap()).await.unwrap();
        assert_eq!(r.status(), 200);
    }

    #[tokio::test]
    async fn content_merges_bundled_and_nas_files() {
        let dir = tempfile::tempdir().unwrap();
        let app = test_app(dir.path());
        let r = app.oneshot(HttpRequest::get("/api/content").body(Body::empty()).unwrap()).await.unwrap();
        let v = body_json(r).await;
        assert_eq!(v["files"]["m/subject.md"], "from the NAS");
        assert_eq!(v["files"]["m/c/course.md"], "bundled");
        assert!(v["files"].get("m/c/image.png").is_none());
    }

    #[test]
    fn base64_matches_reference() {
        assert_eq!(base64(b"user:pass"), "dXNlcjpwYXNz");
        assert_eq!(base64(b"a"), "YQ==");
        assert_eq!(base64(b"ab"), "YWI=");
    }
}
