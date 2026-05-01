import { baseUrls, apiRoutes } from "@/lib/solicitud/infrastructure/config/apiConfig"

export interface BeaconCleanupInput {
  sessionUuid: string
  storagePath: string
}

export function enviarBeaconCleanup({ sessionUuid, storagePath }: BeaconCleanupInput): void {
  const blob = new Blob(
    [JSON.stringify({ sessionUuid, storagePath, motivo: "beforeunload" })],
    { type: "text/plain" },
  )
  navigator.sendBeacon(`${baseUrls.varolisto}${apiRoutes.beaconCleanup}`, blob)
}
