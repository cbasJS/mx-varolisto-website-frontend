'use client'

import { useEffect, useRef } from 'react'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { capturarDispositivo, capturarRed } from './captureDevice'
import type { DispositivoSnapshot, RedSnapshot } from './captureDevice'
import { calcularFingerprint } from './captureFingerprint'
import { capturarGeolocalizacion } from './captureGeo'
import type { GeolocalizacionSnapshot } from './captureGeo'
import { buildTelemetriaPayload } from './buildTelemetriaPayload'
import type { NumeroPasoTelemetria } from '@/lib/solicitud/domain/solicitud/types'
import type { TelemetriaSolicitud } from '@varolisto/shared-schemas/form'

/**
 * Hook orquestador de la captura de telemetría (Bloque 1.B).
 *
 * Decisiones de diseño:
 * - **Resiliencia**: cada captura está en try/catch. Si algo falla, el
 *   campo queda en su default y el flujo de envío sigue. La telemetría es
 *   opcional por contrato; no debe romper el submit.
 * - **No bloquear el render**: la captura síncrona (dispositivo + red)
 *   ocurre al montar. El fingerprint y la geo son async; se setean en
 *   refs cuando resuelven. Si el usuario envía antes de que terminen,
 *   simplemente quedan en undefined.
 * - **No persistir en sessionStorage**: device, fingerprint y geo viven
 *   en refs locales del hook (memoria). El TTL de 2h de PII no aplica
 *   porque estos datos sólo viajan en el payload del POST.
 * - **Tracking de pasos**: hooked al cambio de `pasoActual` del store.
 *   `marcarEntradaPaso` se encarga de acumular el delta del paso previo.
 *
 * El return expone `getTelemetriaPayload()` — una función que el caller
 * llama al momento del submit para obtener el bloque ensamblado. Devuelve
 * `null` si faltan los mínimos (iniciadoEn, dispositivo).
 */
export function useTelemetriaCapture() {
  const inicializarSession = useSolicitudStore((s) => s.inicializarSession)
  const marcarEntradaPaso = useSolicitudStore((s) => s.marcarEntradaPaso)
  const pasoActual = useSolicitudStore((s) => s.pasoActual)
  const hasHydrated = useSolicitudStore((s) => s._hasHydrated)

  const dispositivoRef = useRef<DispositivoSnapshot | null>(null)
  const redRef = useRef<RedSnapshot>({})
  const fingerprintRef = useRef<string | undefined>(undefined)
  const geoRef = useRef<GeolocalizacionSnapshot | null>(null)

  // Captura síncrona al primer mount (cliente).
  useEffect(() => {
    try {
      inicializarSession()
    } catch {
      // never throw out of an effect
    }
    try {
      dispositivoRef.current = capturarDispositivo()
    } catch {
      dispositivoRef.current = null
    }
    try {
      redRef.current = capturarRed()
    } catch {
      redRef.current = {}
    }
    // Async: fingerprint y geo. Se setean cuando resuelvan; si el submit
    // ocurre antes, el payload sale con esos campos en undefined.
    void (async () => {
      try {
        fingerprintRef.current = await calcularFingerprint()
      } catch {
        fingerprintRef.current = undefined
      }
    })()
    void (async () => {
      try {
        geoRef.current = await capturarGeolocalizacion()
      } catch {
        geoRef.current = null
      }
    })()
    // Sólo correr una vez por montaje del orquestador del formulario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Marcar entrada al paso actual cada vez que cambia. Esperamos a la
  // hidratación del store para no contaminar la captura con un "entró al
  // paso 1" sintético antes de saber el paso real.
  useEffect(() => {
    if (!hasHydrated) return
    if (pasoActual < 1 || pasoActual > 7) return
    try {
      marcarEntradaPaso(pasoActual as NumeroPasoTelemetria)
    } catch {
      // nunca rompemos el flujo por telemetría
    }
  }, [pasoActual, hasHydrated, marcarEntradaPaso])

  /**
   * Llamar desde handleSubmit. Devuelve el bloque listo o null.
   */
  const getTelemetriaPayload = (): TelemetriaSolicitud | null => {
    try {
      const { iniciadoEn, tiemposPaso, edicionesPorCampo, pasoActualEntrada } =
        useSolicitudStore.getState()

      const enviadoEn = new Date().toISOString()
      const pasoCorriente = useSolicitudStore.getState().pasoActual
      const msPasoActualEnVuelo =
        pasoActualEntrada !== null && pasoCorriente >= 1 && pasoCorriente <= 7
          ? {
              paso: pasoCorriente as NumeroPasoTelemetria,
              ms: Math.max(0, Date.now() - pasoActualEntrada),
            }
          : null

      return buildTelemetriaPayload({
        iniciadoEn,
        enviadoEn,
        tiemposPaso,
        edicionesPorCampo,
        dispositivo: dispositivoRef.current,
        red: redRef.current,
        fingerprint: fingerprintRef.current,
        geolocalizacion: geoRef.current,
        msPasoActualEnVuelo,
      })
    } catch {
      return null
    }
  }

  return { getTelemetriaPayload }
}
