#!/usr/bin/env bash
# Smoke test of the built image. Usage: scripts/container-smoke.sh <image>
# Proves: it starts, serves the app and the content, saves progress and a PDF to the mounted folder,
# and keeps them across restart AND recreate.
set -euo pipefail
IMG="${1:?image name}"
NAME="gatita-smoke-$$"
DATA="$(mktemp -d)"
chmod 777 "$DATA"
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; rm -rf "$DATA" 2>/dev/null || sudo rm -rf "$DATA" || true; }
trap cleanup EXIT
fail() { echo "FAIL: $*"; docker logs "$NAME" 2>&1 | tail -20 || true; exit 1; }
run() { docker run -d --name "$NAME" -p 18089:8080 -v "$DATA:/data" "$IMG" >/dev/null; }
wait_up() { for _ in $(seq 1 40); do curl -fs http://127.0.0.1:18089/healthz >/dev/null 2>&1 && return 0; sleep 0.5; done; fail "server did not come up"; }
H='X-Gatita-Client: 1'

echo "== start"
run; wait_up
curl -fs http://127.0.0.1:18089/ | grep -q '<div id="root">' || fail "app page not served"
curl -fs http://127.0.0.1:18089/api/content | grep -q 'si/cours1/course.md' || fail "content not served"
docker logs "$NAME" 2>&1 | grep -q "version ci-smoke" || fail "version not reported in the log"

echo "== save progress and a PDF"
curl -fsS -X PUT -H "$H" -H 'Content-Type: application/json' -d '{"data":{"attempts":{"smoke":{"ok":1,"ko":0,"last":"ok","at":"x"}}}}' http://127.0.0.1:18089/api/state >/dev/null
printf '%%PDF-1.4 smoke' | curl -fsS -X PUT -H "$H" --data-binary @- http://127.0.0.1:18089/api/courses/si-c1/pdf >/dev/null
[ -f "$DATA/state.json" ] || fail "state.json not written to the mounted folder"
[ -f "$DATA/pdf/si-c1.pdf" ] || fail "pdf not written to the mounted folder"

echo "== restart"
docker restart "$NAME" >/dev/null; wait_up
curl -fs http://127.0.0.1:18089/api/state | grep -q '"smoke"' || fail "progress lost after restart"

echo "== recreate"
docker rm -f "$NAME" >/dev/null; run; wait_up
curl -fs http://127.0.0.1:18089/api/state | grep -q '"smoke"' || fail "progress lost after recreate"
curl -fs http://127.0.0.1:18089/api/courses | grep -q 'si-c1' || fail "pdf lost after recreate"
[ "$(docker inspect -f '{{.State.Health.Status}}' "$NAME" 2>/dev/null || echo none)" != "unhealthy" ] || fail "unhealthy"
echo "OK"
