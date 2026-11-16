//! Persistence of the progress in the data folder.
//!
//! - `state.json` holds `{ "rev": n, "data": {...} }`, written atomically (temp file, fsync, rename).
//! - `backups/` receives a snapshot at most once a minute while saving, and always before a save that shrinks the
//!   progress a lot. The newest 60 snapshots are kept, plus the last one of each day.
//! - A corrupt `state.json` is moved aside (never deleted) and the newest valid snapshot is loaded instead.

use crate::merge::{merge, weight};
use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const KEEP_RECENT: usize = 60;
const SNAPSHOT_EVERY: Duration = Duration::from_secs(60);

pub struct Store {
    dir: PathBuf,
    pub rev: u64,
    pub data: Value,
    last_snapshot: Option<SystemTime>,
}

pub fn write_atomic(path: &Path, bytes: &[u8]) -> std::io::Result<()> {
    let tmp = path.with_extension(format!("tmp-{}", std::process::id()));
    {
        let mut f = fs::File::create(&tmp)?;
        f.write_all(bytes)?;
        f.sync_all()?;
    }
    fs::rename(&tmp, path)?;
    if let Some(parent) = path.parent() {
        if let Ok(d) = fs::File::open(parent) {
            let _ = d.sync_all();
        }
    }
    Ok(())
}

fn now_ms() -> u128 {
    SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis()).unwrap_or(0)
}

fn parse_state(bytes: &[u8]) -> Option<(u64, Value)> {
    let v: Value = serde_json::from_slice(bytes).ok()?;
    let rev = v.get("rev")?.as_u64()?;
    let data = v.get("data")?.clone();
    if !data.is_object() {
        return None;
    }
    Some((rev, data))
}

impl Store {
    pub fn open(dir: &Path) -> Result<Store, String> {
        fs::create_dir_all(dir.join("backups")).map_err(|e| format!("cannot create {}: {e}", dir.display()))?;
        let path = dir.join("state.json");
        let mut store = Store { dir: dir.to_path_buf(), rev: 0, data: json!({}), last_snapshot: None };
        match fs::read(&path) {
            Ok(bytes) => match parse_state(&bytes) {
                Some((rev, data)) => {
                    store.rev = rev;
                    store.data = data;
                }
                None => {
                    let aside = dir.join(format!("state.corrupt-{}.json", now_ms()));
                    fs::rename(&path, &aside).map_err(|e| format!("cannot move the corrupt state aside: {e}"))?;
                    eprintln!("[gatita] state.json was unreadable, moved to {}", aside.display());
                    match store.newest_backup() {
                        Some((rev, data, name)) => {
                            eprintln!("[gatita] restored the progress from backups/{name}");
                            store.rev = rev;
                            store.data = data;
                            store.persist().map_err(|e| e.to_string())?;
                        }
                        None => {
                            return Err("state.json is corrupt and no valid backup exists: refusing to start with an empty progress. \
                                        The unreadable file was kept next to it."
                                .into())
                        }
                    }
                }
            },
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                store.persist().map_err(|e| format!("cannot write {}: {e}", path.display()))?;
            }
            Err(e) => return Err(format!("cannot read {}: {e}", path.display())),
        }
        Ok(store)
    }

    fn newest_backup(&self) -> Option<(u64, Value, String)> {
        let mut names: Vec<String> = fs::read_dir(self.dir.join("backups"))
            .ok()?
            .filter_map(|e| e.ok()?.file_name().into_string().ok())
            .filter(|n| n.starts_with("state-") && n.ends_with(".json"))
            .collect();
        names.sort();
        names.into_iter().rev().find_map(|n| {
            let bytes = fs::read(self.dir.join("backups").join(&n)).ok()?;
            parse_state(&bytes).map(|(r, d)| (r, d, n))
        })
    }

    fn persist(&self) -> std::io::Result<()> {
        let body = serde_json::to_vec_pretty(&json!({"rev": self.rev, "data": self.data}))?;
        write_atomic(&self.dir.join("state.json"), &body)
    }

    pub fn snapshot(&mut self) -> std::io::Result<()> {
        let body = serde_json::to_vec(&json!({"rev": self.rev, "data": self.data}))?;
        let name = format!("state-{:015}-r{}.json", now_ms(), self.rev);
        write_atomic(&self.dir.join("backups").join(name), &body)?;
        self.last_snapshot = Some(SystemTime::now());
        self.prune();
        Ok(())
    }

    /// Keeps the newest snapshots and the last snapshot of every day.
    fn prune(&self) {
        let dir = self.dir.join("backups");
        let Ok(rd) = fs::read_dir(&dir) else { return };
        let mut names: Vec<String> = rd
            .filter_map(|e| e.ok()?.file_name().into_string().ok())
            .filter(|n| n.starts_with("state-") && n.ends_with(".json"))
            .collect();
        names.sort();
        let mut keep: std::collections::HashSet<String> = names.iter().rev().take(KEEP_RECENT).cloned().collect();
        let mut per_day: BTreeMap<u128, String> = BTreeMap::new();
        for n in &names {
            if let Some(ms) = n.get(6..21).and_then(|s| s.parse::<u128>().ok()) {
                per_day.insert(ms / 86_400_000, n.clone());
            }
        }
        keep.extend(per_day.into_values());
        for n in names {
            if !keep.contains(&n) {
                let _ = fs::remove_file(dir.join(n));
            }
        }
    }

    /// Merges `incoming` into the stored progress (nothing is ever lost, see merge.rs) and saves it.
    pub fn save(&mut self, incoming: &Value) -> std::io::Result<()> {
        let merged = merge(&self.data, incoming);
        if merged == self.data {
            return Ok(());
        }
        let due = self.last_snapshot.map(|t| t.elapsed().unwrap_or_default() >= SNAPSHOT_EVERY).unwrap_or(true);
        if due && weight(&self.data) > 1 {
            self.snapshot()?;
        }
        self.data = merged;
        self.rev += 1;
        self.persist()
    }

    /// Replaces the whole progress (used by "import"/"restore"): a snapshot of the current progress is always taken first.
    pub fn replace(&mut self, data: Value) -> std::io::Result<()> {
        self.snapshot()?;
        self.data = data;
        self.rev += 1;
        self.persist()
    }

    pub fn backups(&self) -> Vec<String> {
        let mut names: Vec<String> = fs::read_dir(self.dir.join("backups"))
            .map(|rd| rd.filter_map(|e| e.ok()?.file_name().into_string().ok()).filter(|n| n.starts_with("state-")).collect())
            .unwrap_or_default();
        names.sort();
        names.reverse();
        names
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn starts_empty_then_keeps_data_across_reopen() {
        let dir = tempfile::tempdir().unwrap();
        let mut s = Store::open(dir.path()).unwrap();
        assert_eq!(s.rev, 0);
        s.save(&json!({"attempts": {"a": {"ok": 1}}})).unwrap();
        assert_eq!(s.rev, 1);
        let s2 = Store::open(dir.path()).unwrap();
        assert_eq!(s2.rev, 1);
        assert_eq!(s2.data, json!({"attempts": {"a": {"ok": 1}}}));
    }

    #[test]
    fn identical_save_does_not_bump_revision() {
        let dir = tempfile::tempdir().unwrap();
        let mut s = Store::open(dir.path()).unwrap();
        s.save(&json!({"x": 1})).unwrap();
        s.save(&json!({"x": 1})).unwrap();
        assert_eq!(s.rev, 1);
    }

    #[test]
    fn corrupt_state_is_moved_aside_and_restored_from_backup() {
        let dir = tempfile::tempdir().unwrap();
        let mut s = Store::open(dir.path()).unwrap();
        s.save(&json!({"x": 1})).unwrap();
        s.save(&json!({"y": 2})).unwrap();
        s.snapshot().unwrap();
        fs::write(dir.path().join("state.json"), b"{not json").unwrap();
        let s2 = Store::open(dir.path()).unwrap();
        assert_eq!(s2.data, json!({"x": 1, "y": 2}));
        let aside = fs::read_dir(dir.path()).unwrap().filter_map(|e| e.ok()).any(|e| e.file_name().to_string_lossy().starts_with("state.corrupt-"));
        assert!(aside, "the unreadable file must be kept");
    }

    #[test]
    fn corrupt_state_without_backup_refuses_to_start() {
        let dir = tempfile::tempdir().unwrap();
        fs::create_dir_all(dir.path().join("backups")).unwrap();
        fs::write(dir.path().join("state.json"), b"garbage").unwrap();
        assert!(Store::open(dir.path()).is_err());
    }

    #[test]
    fn replace_takes_a_snapshot_first() {
        let dir = tempfile::tempdir().unwrap();
        let mut s = Store::open(dir.path()).unwrap();
        s.save(&json!({"x": 1})).unwrap();
        let before = s.backups().len();
        s.replace(json!({"z": 3})).unwrap();
        assert_eq!(s.backups().len(), before + 1);
        assert_eq!(s.data, json!({"z": 3}));
    }
}
