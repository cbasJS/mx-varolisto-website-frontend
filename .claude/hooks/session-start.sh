#!/usr/bin/env bash
# SessionStart: inyecta CLAUDE.md completo en el contexto de la sesión.
set -u

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -z "$repo_root" ] && exit 0

claude_md="$repo_root/CLAUDE.md"
[ ! -f "$claude_md" ] && exit 0

content="$(cat "$claude_md")"

prefix="=== REGLAS OBLIGATORIAS — LEER ANTES DE CUALQUIER ACCION ===
REPO: mx-varolisto-website-frontend | RAMA BASE: sandbox | PUERTO: 3000

1. NUNCA edites en main/master/sandbox → crea rama de feature primero
     git checkout sandbox && git pull origin sandbox
     git checkout -b feat/<descripcion>
2. TDD obligatorio: usa el skill /test-driven-development antes de implementar
3. Una fase = una rama = un PR (el PR va contra sandbox, no main)
4. ESPERA confirmacion del usuario antes de iniciar la siguiente fase
5. playwright test --ui requiere --ui-port=5174 (puerto >= 5000)
===

$content"

printf '%s' "$prefix" | jq -Rs '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":.}}'
