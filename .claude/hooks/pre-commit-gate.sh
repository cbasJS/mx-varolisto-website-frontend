#!/usr/bin/env bash
# Antes de `git commit`: tsc --noEmit + next lint. Bloquea si fallan.
# Tests Vitest y E2E Playwright NO se incluyen acá (decisión del autor).

set -u

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null || true)"

if [ -z "$cmd" ]; then
  exit 0
fi

if ! printf '%s' "$cmd" | grep -Eq '(^|[[:space:]]|;|&&|\|\|)git[[:space:]]+commit([[:space:]]|$)'; then
  exit 0
fi

if printf '%s' "$cmd" | grep -Eq '(^|[[:space:]])--no-verify([[:space:]]|$)'; then
  exit 0
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
cd "$repo_root" || exit 0

echo "[pre-commit] tsc --noEmit..." >&2
if ! pnpm exec tsc --noEmit >&2; then
  echo "BLOQUEADO: typecheck fallo. Arregla los errores de TS antes de commitear." >&2
  exit 2
fi

echo "[pre-commit] pnpm lint (next lint)..." >&2
if ! pnpm -s lint >&2; then
  echo "BLOQUEADO: lint (Next/ESLint) fallo. Corre `pnpm lint --fix` o revisa los errores." >&2
  exit 2
fi

echo "[pre-commit] OK." >&2
exit 0
