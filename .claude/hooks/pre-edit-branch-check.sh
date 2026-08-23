#!/usr/bin/env bash
# PreToolUse(Edit|Write|MultiEdit): bloquea ediciones en ramas protegidas.
set -u

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -z "$repo_root" ] && exit 0

current_branch="$(git -C "$repo_root" branch --show-current 2>/dev/null || true)"
[ -z "$current_branch" ] && exit 0

case "$current_branch" in
  main|master|sandbox)
    cat >&2 <<EOF
BLOQUEADO: estás en la rama '$current_branch' (rama protegida).

Pasos obligatorios antes de editar cualquier archivo:
  1. Asegúrate de que sandbox está actualizada:
       git checkout sandbox && git pull origin sandbox
  2. Crea una rama de feature:
       git checkout -b feat/<descripcion>   # o fix/, refactor/, docs/, chore/
  3. El PR va contra sandbox (no contra main).

TDD obligatorio: usa el skill /test-driven-development antes de implementar.
EOF
    exit 2
    ;;
esac

exit 0
