# Changesets

Este repo usa [Changesets](https://github.com/changesets/changesets) para versionado automático y generación de `CHANGELOG.md`. El paquete es privado (`"private": true` en `package.json`), así que **no se publica a ningún registry** — solo se crean tags git `vX.Y.Z` para trazar qué versión está desplegada en cada ambiente.

## Cómo agregar un changeset a tu PR

1. Después de hacer tus cambios y antes de abrir el PR:

   ```bash
   pnpm changeset
   ```

2. Selecciona el tipo de bump:
   - **patch** — bug fix, refactor sin cambios visibles, ajustes de copy.
   - **minor** — feature nueva (paso del formulario, sección de landing, página) compatible.
   - **major** — breaking change visible al usuario (rediseño mayor, cambio de URL pública, etc.).

3. Describe el cambio en una línea (en pasado, con verbo: "Agrega sección de beneficios en la landing", "Corrige validación del paso 3 cuando el CP no existe").

4. Commitea el archivo `.changeset/<hash>.md` generado junto al resto del PR.

## Qué pasa al mergear a `main`

El workflow `release.yml` se dispara automáticamente:

- Si hay changesets sin consumir → abre una PR titulada `chore: release packages` que bumpea `package.json`, regenera `CHANGELOG.md` y elimina los changesets consumidos.
- Cuando se mergea esa PR → crea el tag git `vX.Y.Z`.

No hay que hacer nada manual.

## ¿Cuándo NO necesito un changeset?

- Cambios que no afectan el comportamiento del frontend (ej. ajustes de tooling, fix de typos en comentarios, edits a CLAUDE.md o README).
- Trabajo en branches que aún no van a `main` (sandbox-only). En ese caso podés agregar el changeset igual y queda dormido hasta el primer merge a `main`.

Si tu PR no requiere changeset, comentalo en la descripción para que el reviewer no espere uno.
