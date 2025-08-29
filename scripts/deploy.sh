#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
BRANCH_EXPECTED="main"
BUILD_DIR="docs"

# --- Comprobaciones previas ---
current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$current_branch" != "$BRANCH_EXPECTED" ]]; then
  echo "⚠️  Estás en '$current_branch'. Cámbiate a '$BRANCH_EXPECTED' para publicar."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js no está instalado."
  exit 1
fi

node -e "process.exit(Number(process.versions.node.split('.')[0] < 18))" || {
  echo "❌ Requiere Node 18+."
  exit 1
}

# --- Dependencias ---
echo "📦 Instalando dependencias (npm ci si existe lock, si no npm i)…"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm i
fi

# --- Salvaguarda index.html (asegurar ruta relativa al main.js) ---
# Sustituye src="/main.js" por "./main.js" si aún existe
if grep -q 'src="/main.js"' index.html; then
  sed -i.bak 's|src="/main.js"|src="./main.js"|g' index.html
  echo "🔧 Arreglada ruta de main.js en index.html (usa ./main.js)."
fi

# --- Build ---
echo "🏗  Construyendo para producción…"
npm run build

# --- Verificaciones de salida ---
if [[ ! -d "$BUILD_DIR" ]]; then
  echo "❌ No existe $BUILD_DIR después del build."
  exit 1
fi

# Comprobación básica de index
if ! grep -qi "<!doctype html" "$BUILD_DIR/index.html"; then
  echo "❌ $BUILD_DIR/index.html no parece válido."
  exit 1
fi

# --- Commit + push ---
echo "📝 Preparando commit…"
git add -A
git commit -m "build: publish to GitHub Pages ($(date -u +'%Y-%m-%d %H:%M:%S UTC'))" || {
  echo "ℹ️  No hay cambios para commitear."
}

echo "🚀 Subiendo a remoto…"
git push

echo "✅ Listo. Revisa GitHub Pages (Settings → Pages) y la URL pública."