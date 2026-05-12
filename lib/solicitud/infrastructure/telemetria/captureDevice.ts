import {
  TELEMETRIA_LOCALE_MAX_LENGTH,
  TELEMETRIA_PLATAFORMA_MAX_LENGTH,
  TELEMETRIA_REFERRER_MAX_LENGTH,
  TELEMETRIA_TIMEZONE_MAX_LENGTH,
  TELEMETRIA_USER_AGENT_MAX_LENGTH,
} from '@varolisto/shared-schemas'

/**
 * Snapshot síncrono del dispositivo y red al momento de capturarlo.
 *
 * No lanza nunca: cada lectura está en try/catch porque la telemetría es
 * complementaria y no debe romper el flujo de envío. Lo único que puede
 * pasar es que algún campo quede en su valor default (string vacío,
 * viewport 0×0) y el contrato lo acepta.
 *
 * Se clampean longitudes a los `*_MAX_LENGTH` del schema antes de devolver
 * para que el payload nunca sea rechazado por longitud en el backend.
 */

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn()
  } catch {
    return fallback
  }
}

function clamp(value: string, max: number): string {
  if (value.length <= max) return value
  return value.slice(0, max)
}

export interface DispositivoSnapshot {
  userAgent: string
  viewport: { width: number; height: number }
  idioma: string
  zonaHoraria: string
  plataforma?: string
}

export interface RedSnapshot {
  referrer?: string
}

interface NavigatorConUserAgentData extends Navigator {
  userAgentData?: { platform?: string }
}

export function capturarDispositivo(): DispositivoSnapshot {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    // SSR / runtime sin DOM: devolvemos defaults vacíos. El llamador no
    // debería invocar esto fuera del cliente, pero defensivo.
    return {
      userAgent: '',
      viewport: { width: 0, height: 0 },
      idioma: '',
      zonaHoraria: '',
    }
  }

  const userAgent = clamp(
    safe(() => navigator.userAgent ?? '', ''),
    TELEMETRIA_USER_AGENT_MAX_LENGTH,
  )

  const width = safe(() => Math.max(0, Math.floor(window.innerWidth ?? 0)), 0)
  const height = safe(() => Math.max(0, Math.floor(window.innerHeight ?? 0)), 0)

  const idioma = clamp(
    safe(() => navigator.language ?? '', ''),
    TELEMETRIA_LOCALE_MAX_LENGTH,
  )

  const zonaHoraria = clamp(
    safe(() => Intl.DateTimeFormat().resolvedOptions().timeZone ?? '', ''),
    TELEMETRIA_TIMEZONE_MAX_LENGTH,
  )

  // navigator.platform está deprecado pero sigue presente en todos los
  // browsers. userAgentData.platform es lo nuevo y más limpio cuando existe.
  const plataformaRaw = safe(() => {
    const nav = navigator as NavigatorConUserAgentData
    return nav.userAgentData?.platform ?? navigator.platform ?? ''
  }, '')
  const plataforma = plataformaRaw
    ? clamp(plataformaRaw, TELEMETRIA_PLATAFORMA_MAX_LENGTH)
    : undefined

  return {
    userAgent,
    viewport: { width, height },
    idioma,
    zonaHoraria,
    ...(plataforma ? { plataforma } : {}),
  }
}

export function capturarRed(): RedSnapshot {
  if (typeof document === 'undefined') return {}
  const referrer = safe(() => document.referrer ?? '', '')
  if (!referrer) return {}
  return { referrer: clamp(referrer, TELEMETRIA_REFERRER_MAX_LENGTH) }
}
