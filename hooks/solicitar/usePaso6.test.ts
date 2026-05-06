// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePaso6 } from './usePaso6'
import { useSolicitudStore } from '@/lib/solicitud/store'

// Archivos representativos ya subidos a staging (hidratados desde sessionStorage)
// CP 06600 = Col. Juárez, Cuauhtémoc, Ciudad de México
const ARCHIVO_INE_FRENTE = {
  clienteId: 'cliente-uuid-ine-frente-001',
  tipoArchivo: 'ine_frente' as const,
  nombreOriginal: 'ine_frente.jpg',
  mimeType: 'image/jpeg',
  tamanoBytes: 248_320,
  storagePath: 'staging/session-06600/ine_frente.jpg',
  archivoId: 'arch-uuid-ine-001',
}

const ARCHIVO_COMPROBANTE = {
  clienteId: 'cliente-uuid-comp-001',
  tipoArchivo: 'comprobante_ingreso' as const,
  nombreOriginal: 'recibo_nomina_enero.jpg',
  mimeType: 'image/jpeg',
  tamanoBytes: 183_040,
  storagePath: 'staging/session-06600/recibo_nomina_enero.jpg',
  archivoId: 'arch-uuid-comp-001',
}

vi.mock('@/lib/solicitud/application/useCases/hidratarArchivos', () => ({
  hidratarArchivos: vi.fn().mockResolvedValue({ archivos: [] }),
}))

vi.mock('@/lib/solicitud/application/useCases/uploadFile', () => ({
  solicitarUploadUrl: vi.fn(),
  eliminarArchivoStaging: vi.fn().mockResolvedValue(undefined),
}))

const ARCHIVO_INE_REVERSO = {
  clienteId: 'cliente-uuid-ine-reverso-001',
  tipoArchivo: 'ine_reverso' as const,
  nombreOriginal: 'ine_reverso.jpg',
  mimeType: 'image/jpeg',
  tamanoBytes: 231_200,
  storagePath: 'staging/session-06600/ine_reverso.jpg',
  archivoId: 'arch-uuid-ine-002',
}

const ARCHIVO_COMPROBANTE_2 = {
  clienteId: 'cliente-uuid-comp-002',
  tipoArchivo: 'comprobante_ingreso' as const,
  nombreOriginal: 'recibo_nomina_febrero.jpg',
  mimeType: 'image/jpeg',
  tamanoBytes: 175_000,
  storagePath: 'staging/session-06600/recibo_nomina_febrero.jpg',
  archivoId: 'arch-uuid-comp-002',
}

describe('usePaso6 — minComprobantes y puedeAvanzar', () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      archivosSubidos: [],
      sessionUuid: 'session-06600-abc',
      tipoIdentificacion: 'ine',
      datos: { tipoActividad: 'empleado_formal' },
    })
  })

  it('minComprobantes es 2 para empleado_formal', async () => {
    const { result } = renderHook(() => usePaso6(vi.fn()))
    expect(result.current.minComprobantes).toBe(2)
  })

  it('minComprobantes es 2 para negocio_propio', async () => {
    useSolicitudStore.setState({ datos: { tipoActividad: 'negocio_propio' } })
    const { result } = renderHook(() => usePaso6(vi.fn()))
    expect(result.current.minComprobantes).toBe(2)
  })

  it('puedeAvanzar es false con 1 comprobante aunque INE esté completa', async () => {
    useSolicitudStore.setState({
      archivosSubidos: [ARCHIVO_INE_FRENTE, ARCHIVO_INE_REVERSO, ARCHIVO_COMPROBANTE],
    })
    const { result } = renderHook(() => usePaso6(vi.fn()))
    await waitFor(() => expect(result.current.entradas.length).toBeGreaterThan(0))
    expect(result.current.puedeAvanzar).toBe(false)
  })

  it('puedeAvanzar es true con INE completa y 2 comprobantes', async () => {
    useSolicitudStore.setState({
      archivosSubidos: [
        ARCHIVO_INE_FRENTE,
        ARCHIVO_INE_REVERSO,
        ARCHIVO_COMPROBANTE,
        ARCHIVO_COMPROBANTE_2,
      ],
    })
    const { result } = renderHook(() => usePaso6(vi.fn()))
    await waitFor(() => expect(result.current.entradas.length).toBeGreaterThan(0))
    expect(result.current.puedeAvanzar).toBe(true)
  })
})

describe('usePaso6 — MIME types aceptados por dropzones', () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      archivosSubidos: [],
      sessionUuid: 'session-06600-abc',
      tipoIdentificacion: 'ine',
      datos: { tipoActividad: 'empleado_formal' },
    })
  })

  // Los 4 dropzones (comprobante, INE frente, INE reverso, pasaporte) deben aceptar
  // los tres MIME types declarados como permitidos en shared-schemas: JPG, PNG y PDF.
  // El listado es la fuente de verdad — react-dropzone serializa el accept como string
  // separado por comas en el atributo HTML del input.
  const dropzonesEsperados = [
    'dropzoneComprobante',
    'dropzoneIneFrente',
    'dropzoneIneReverso',
    'dropzonePasaporte',
  ] as const

  for (const nombre of dropzonesEsperados) {
    it(`${nombre} acepta image/jpeg, image/png y application/pdf`, () => {
      const { result } = renderHook(() => usePaso6(vi.fn()))
      const inputProps = result.current[nombre].getInputProps() as { accept?: string }
      const accept = inputProps.accept ?? ''
      expect(accept).toContain('image/jpeg')
      expect(accept).toContain('image/png')
      expect(accept).toContain('application/pdf')
    })
  }
})

describe('usePaso6 — hidratación desde sessionStorage', () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      archivosSubidos: [],
      sessionUuid: 'session-06600-abc',
      tipoIdentificacion: 'ine',
      datos: { tipoActividad: 'empleado_formal' },
    })
  })

  it('cuando el store ya tiene archivos al montar (rehydrated desde sessionStorage), las entradas se sincronizan al mapa', async () => {
    // Simula el caso donde sessionStorage ya hidró el store antes del montaje del hook
    useSolicitudStore.setState({
      archivosSubidos: [ARCHIVO_INE_FRENTE, ARCHIVO_COMPROBANTE],
    })

    const { result } = renderHook(() => usePaso6(vi.fn()))

    // Las entradas deben reflejar los archivos del store (sincronización desde sessionStorage)
    await waitFor(() => {
      expect(result.current.entradas.length).toBe(2)
    })

    const clienteIds = result.current.entradas.map((e) => e.clienteId)
    expect(clienteIds).toContain(ARCHIVO_INE_FRENTE.clienteId)
    expect(clienteIds).toContain(ARCHIVO_COMPROBANTE.clienteId)
  })

  it('cuando el store empieza vacío, las entradas también arrancan vacías', () => {
    const { result } = renderHook(() => usePaso6(vi.fn()))

    expect(result.current.entradas).toHaveLength(0)
  })
})
