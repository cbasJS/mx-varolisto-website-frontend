import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { baseUrls } from '@/lib/solicitud/infrastructure/config/apiConfig'
import { dentroDelLimite, type RateLimiter } from '@/lib/solicitud/infrastructure/rateLimit'
import type { CopomexResponse } from '@/lib/solicitud/types'

export type { CopomexResponse }

const CP_REGEX = /^\d{5}$/

/** El binding solo existe sobre workerd; con `next dev` viene undefined y se falla abierto. */
function obtenerLimiter(): RateLimiter | undefined {
  try {
    const { env: bindings } = getCloudflareContext() as {
      env: { RATE_LIMITER_COLONIAS?: RateLimiter }
    }
    return bindings.RATE_LIMITER_COLONIAS
  } catch {
    return undefined
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cp = request.nextUrl.searchParams.get('cp') ?? ''

  if (!CP_REGEX.test(cp)) {
    return NextResponse.json(
      { error: 'El parámetro cp debe ser un número de 5 dígitos.' },
      { status: 400 },
    )
  }

  // Despues de validar el CP: rechazar un CP malformado no cuesta una llamada a
  // COPOMEX, asi que no tiene por que gastar cuota del limiter.
  if (!(await dentroDelLimite(obtenerLimiter(), request))) {
    return NextResponse.json(
      { error: 'Demasiadas consultas. Espera un momento e intenta de nuevo.' },
      { status: 429 },
    )
  }

  let upstream: Response
  try {
    upstream = await fetch(`${baseUrls.copomex}/info_cp/${cp}?token=${env.copomex.token}`, {
      next: { revalidate: 86400 },
    })
  } catch {
    return NextResponse.json(
      { error: 'No pudimos consultar tu código postal. Intenta de nuevo en un momento.' },
      { status: 503 },
    )
  }

  if (upstream.status === 404) {
    return NextResponse.json({ error: 'CP no encontrado' }, { status: 404 })
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: 'No pudimos consultar tu código postal. Intenta de nuevo en un momento.' },
      { status: 503 },
    )
  }

  const data: unknown = await upstream.json()

  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ error: 'CP no encontrado' }, { status: 404 })
  }

  return NextResponse.json(data as CopomexResponse[])
}
