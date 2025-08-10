#!/usr/bin/env bash
set -euo pipefail

# Start the Thai Flashcards UI (Vite preview)
# - Installs deps if needed
# - Builds the app
# - Runs vite preview on an available port
# Env:
#   PORT (default 4173), HOST (default 127.0.0.1), OPEN_BROWSER (1 default)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-4173}"
HOST="${HOST:-127.0.0.1}"
OPEN_BROWSER="${OPEN_BROWSER:-1}"

cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "❌ Node.js and npm are required." >&2
  exit 1
fi

echo "🛠️ Installing dependencies (with peer fallback)..."
if ! npm ci --silent; then
  npm install --legacy-peer-deps --silent
fi

echo "🛠️ Building app..."
npm run build --silent

is_port_free() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    ! lsof -iTCP -sTCP:LISTEN -n -P | grep -q ":${port} "
  elif command -v nc >/dev/null 2>&1; then
    ! nc -z "$HOST" "$port" >/dev/null 2>&1
  else
    return 0
  fi
}

START_PORT="$PORT"; FOUND=0
for try_port in $(seq "$START_PORT" $((START_PORT+20))); do
  if is_port_free "$try_port"; then PORT="$try_port"; FOUND=1; break; fi
done
[ "$FOUND" -eq 1 ] || { echo "❌ No free port near $START_PORT" >&2; exit 1; }

URL="http://$HOST:$PORT/"
echo "🟢 Preview: $URL"

npm run preview --silent -- --host "$HOST" --port "$PORT" &
SERVER_PID=$!
cleanup(){ echo; echo "🔴 Stopping preview (PID $SERVER_PID) ..."; kill "$SERVER_PID" >/dev/null 2>&1 || true; }
trap cleanup INT TERM EXIT

for i in {1..30}; do if curl -sSf "$URL" >/dev/null 2>&1; then break; fi; sleep 0.3; done

if [ "$OPEN_BROWSER" = "1" ]; then
  if command -v open >/dev/null 2>&1; then open "$URL" || true
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1 || true
  fi
fi

wait "$SERVER_PID"


