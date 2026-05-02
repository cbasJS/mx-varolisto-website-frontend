/**
 * Configuración centralizada de APIs externas y endpoints.
 *
 * Ambiente seleccionado por NEXT_PUBLIC_ENV:
 *   local      → servidor local (desarrollo)
 *   sandbox    → staging de VaroListo + Copomex en modo pruebas
 *   production → producción
 *
 * Si NEXT_PUBLIC_ENV no está definido, se infiere desde NODE_ENV:
 *   development → "local"
 *   test        → "sandbox"
 *   production  → "production"
 */

export type Ambiente = "local" | "sandbox" | "production"

function resolverAmbiente(): Ambiente {
  const explicit = process.env.NEXT_PUBLIC_ENV
  if (explicit === "local" || explicit === "sandbox" || explicit === "production") {
    return explicit
  }
  if (process.env.NODE_ENV === "production") return "production"
  if (process.env.NODE_ENV === "test") return "sandbox"
  return "local"
}

export const ambiente: Ambiente = resolverAmbiente()

// ---------------------------------------------------------------------------
// URLs base por API y ambiente
// ---------------------------------------------------------------------------

const BASE_URLS = {
  varolisto: {
    local:      "http://localhost:4000",
    sandbox:    "https://api-sandbox.varolisto.mx",
    production: "https://api.varolisto.mx",
  },
  copomex: {
    local:      "https://api.copomex.com/query",
    sandbox:    "https://api.copomex.com/query",
    production: "https://api.copomex.com/query",
  },
} as const satisfies Record<string, Record<Ambiente, string>>

export const baseUrls = {
  varolisto: BASE_URLS.varolisto[ambiente],
  copomex:   BASE_URLS.copomex[ambiente],
} as const

// ---------------------------------------------------------------------------
// Endpoints nombrados — nunca usar strings mágicos fuera de este archivo
// ---------------------------------------------------------------------------

export const apiRoutes = {
  solicitudes:    "/api/solicitudes",
  archivoUpload:  "/api/archivos/upload-url",
  archivoStaging: (sessionUuid: string) => `/api/archivos/staging/${sessionUuid}`,
  archivoDelete:  "/api/archivos/staging",
  beaconCleanup:  "/api/archivos/staging/beacon-cleanup",
} as const
