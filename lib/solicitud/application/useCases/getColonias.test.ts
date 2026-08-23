import { describe, it, expect, vi, beforeEach } from 'vitest'

// El módulo aún no existe — estos imports deben fallar en rojo
import { fetchColonias, ColoniaServiceError, ColoniaNotFoundError } from './getColonias'

// Respuesta real de Copomex para CP 06600 (Col. Juárez, Cuauhtémoc, CDMX)
// El campo ciudad puede venir vacío — el hook lo rellena con municipio como fallback
const COLONIAS_06600 = [
  {
    response: {
      municipio: 'Cuauhtémoc',
      estado: 'Ciudad de México',
      ciudad: 'Ciudad de México',
      asentamiento: 'Juárez',
    },
  },
  {
    response: {
      municipio: 'Cuauhtémoc',
      estado: 'Ciudad de México',
      ciudad: 'Ciudad de México',
      asentamiento: 'Tabacalera',
    },
  },
]

// CP inexistente en México — Copomex devuelve 404
const CP_INEXISTENTE = '99999'

// CP válido con formato de 5 dígitos
const CP_VALIDO = '06600'

describe('getColonias (application use case)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('exports del contrato de aplicación', () => {
    it('exporta fetchColonias como función', () => {
      expect(typeof fetchColonias).toBe('function')
    })

    it('exporta ColoniaServiceError como clase de Error', () => {
      const err = new ColoniaServiceError(
        'El servicio de colonias no está disponible. Intenta más tarde.',
      )
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toBe('El servicio de colonias no está disponible. Intenta más tarde.')
    })

    it('exporta ColoniaNotFoundError como clase de Error', () => {
      const err = new ColoniaNotFoundError('CP no encontrado')
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toBe('CP no encontrado')
    })

    it('ColoniaServiceError y ColoniaNotFoundError son clases distintas', () => {
      const service = new ColoniaServiceError('servicio caído')
      const notFound = new ColoniaNotFoundError('CP no encontrado')
      expect(service).not.toBeInstanceOf(ColoniaNotFoundError)
      expect(notFound).not.toBeInstanceOf(ColoniaServiceError)
    })
  })

  describe('fetchColonias — delegación al repositorio de infraestructura', () => {
    it('resuelve con las colonias del CP cuando Copomex responde OK', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => COLONIAS_06600,
        }),
      )

      const resultado = await fetchColonias(CP_VALIDO)

      expect(resultado).toEqual(COLONIAS_06600)
      expect(resultado[0].response.municipio).toBe('Cuauhtémoc')
      expect(resultado[0].response.estado).toBe('Ciudad de México')
    })

    it('lanza ColoniaNotFoundError cuando el CP no existe en México (404 de Copomex)', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => [],
        }),
      )

      await expect(fetchColonias(CP_INEXISTENTE)).rejects.toBeInstanceOf(ColoniaNotFoundError)
    })

    it('lanza ColoniaServiceError cuando Copomex falla (500)', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({}),
        }),
      )

      await expect(fetchColonias(CP_VALIDO)).rejects.toBeInstanceOf(ColoniaServiceError)
    })

    it('lanza ColoniaServiceError cuando no hay conexión (fetch lanza TypeError)', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

      await expect(fetchColonias(CP_VALIDO)).rejects.toBeInstanceOf(ColoniaServiceError)
    })
  })
})
