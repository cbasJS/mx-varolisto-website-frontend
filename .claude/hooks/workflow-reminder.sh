#!/usr/bin/env bash
# UserPromptSubmit: recordatorio compacto del workflow por cada mensaje.
set -u

branch="$(git branch --show-current 2>/dev/null || echo 'desconocida')"

reminder="[frontend | rama: $branch] Checklist: (1) ¿En feature branch? (no main/sandbox) (2) ¿Test fallando primero? → /test-driven-development (3) ¿Nueva fase? → espera confirmacion. PR va contra sandbox."

printf '%s' "$reminder" | jq -Rs '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":.}}'
