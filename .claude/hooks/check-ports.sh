#!/usr/bin/env bash
# Bloquea procesos auxiliares que vinculan los puertos reservados 3000 / 4000.
# Excepciones del repo dueño (frontend):
#   - `pnpm dev` / `next dev` "limpio" (sin -p) puede usar 3000.
#   - Playwright UI requiere `--ui-port=` explicito y >= 5000.

set -u

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null || true)"

if [ -z "$cmd" ]; then
  exit 0
fi

# Excepción: pnpm dev / next dev sin flag explícito de puerto.
if printf '%s' "$cmd" | grep -Eq '(^|[[:space:]])(pnpm[[:space:]]+dev|next[[:space:]]+dev)([[:space:]]|$)'; then
  if ! printf '%s' "$cmd" | grep -Eq '(--port|-p)[[:space:]=]?(3000|4000)|:3000|:4000'; then
    exit 0
  fi
fi

# Playwright UI sin --ui-port explicito: bloqueo aparte (mejor mensaje).
if printf '%s' "$cmd" | grep -Eq 'playwright[[:space:]]+test([^|;&]*)--ui(\b|[[:space:]]|$)'; then
  if ! printf '%s' "$cmd" | grep -Eq -- '--ui-port[[:space:]=]?[0-9]+'; then
    cat >&2 <<'EOF'
BLOQUEADO: `playwright test --ui` sin --ui-port explicito.
La regla VaroListo es: puerto >= 5000 y declarado.
Sugerencia: agrega `--ui-port=5174` (o cualquier puerto >= 5000 libre).
EOF
    exit 2
  fi
  if printf '%s' "$cmd" | grep -Eq -- '--ui-port[[:space:]=](3000|4000)\b'; then
    echo "BLOQUEADO: --ui-port apunta a un puerto reservado." >&2
    exit 2
  fi
fi

# Detección general de puertos reservados.
if printf '%s' "$cmd" | grep -Eq '(--port|--ui-port|-p|--api\.port)[[:space:]=]?(3000|4000)\b|(\b|@)(localhost|127\.0\.0\.1|0\.0\.0\.0)?:(3000|4000)\b|--listen[[:space:]=]?(3000|4000)\b|http\.server[[:space:]]+(3000|4000)\b|-l[[:space:]]+(3000|4000)\b'; then
  echo "BLOQUEADO: el comando intenta vincular un puerto reservado (3000/4000)." >&2
  echo "Regla VaroListo: 3000 = frontend Next.js, 4000 = backend Fastify." >&2
  echo "Procesos auxiliares deben usar puertos >= 5000 (sugeridos: 5173, 5174, 5555, 6006, 8080, 9222)." >&2
  echo "Comando recibido: $cmd" >&2
  exit 2
fi

exit 0
