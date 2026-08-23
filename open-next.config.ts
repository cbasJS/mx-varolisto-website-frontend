import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'

// R2, no KV: la doc de OpenNext desaconseja KV por ser eventually consistent.
// El Data Cache lo necesita `app/api/colonias/route.ts`, que hace fetch a COPOMEX
// con `next: { revalidate: 86400 }`. Sin caché incremental cada consulta de CP
// quema una llamada del paquete prepagado.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
})
