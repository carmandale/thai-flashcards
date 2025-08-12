#!/usr/bin/env bash
set -euo pipefail

# Development Startup Script for Thai Night Market Learning App
# Agent OS configured to use Yarn + port 3000 for development
# For production preview, use: ./start.sh
# For development: yarn dev

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODE="${MODE:-preview}"
PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
OPEN_BROWSER="${OPEN_BROWSER:-1}"

cd "$ROOT_DIR"

# Check for required tools
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is required." >&2
  exit 1
fi

if ! command -v yarn >/dev/null 2>&1; then
  echo "⚠️  Yarn not found. Install with: npm install -g yarn" >&2
  echo "   Falling back to npm..." >&2
  USE_NPM=true
else
  USE_NPM=false
fi

# Install dependencies with preferred package manager
echo "🛠️ Installing dependencies..."
if [ "$USE_NPM" = true ]; then
  if ! npm ci --silent; then
    npm install --legacy-peer-deps --silent
  fi
else
  yarn install --silent
fi

# Development vs Preview mode
if [ "$MODE" = "dev" ]; then
  echo "🚀 Starting development server on port $PORT..."
  if [ "$USE_NPM" = true ]; then
    PORT=$PORT npm run dev
  else
    PORT=$PORT yarn dev
  fi
  exit 0
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


