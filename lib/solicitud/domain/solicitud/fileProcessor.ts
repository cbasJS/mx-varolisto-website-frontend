import {
  MAX_SIZE_IMAGEN_BYTES,
  MAX_SIZE_PDF_BYTES,
  RESOLUCION_MIN_DOMICILIO_PX,
  RESOLUCION_MIN_IDENTIDAD_PX,
} from './documentosConfig'
import {
  detectFileType,
  mimeToKind,
  autoRotateImage,
  compressImage,
  getImageDimensions,
  getBlurScore,
} from './imageUtils'

export type ContextoProcesamiento =
  | 'identidad-ine'
  | 'identidad-pasaporte'
  | 'ingresos'
  | 'domicilio'

export type WarningProcesamiento =
  | { code: 'blur-moderado'; mensaje: string }
  | { code: 'frame-cortado'; mensaje: string }
  | { code: 'doble-cara-sospecha'; mensaje: string }
  | { code: 'recorte-raro'; mensaje: string }

export type RazonRechazo =
  | { code: 'tamano-imagen'; mensaje: string }
  | { code: 'tamano-pdf'; mensaje: string }
  | { code: 'heic-no-soportado'; mensaje: string }
  | { code: 'mime-spoof'; mensaje: string }
  | { code: 'resolucion-baja'; mensaje: string }
  | { code: 'blur-grave'; mensaje: string }
  | { code: 'pdf-paginas-excedidas'; mensaje: string }
  | { code: 'pdf-password'; mensaje: string }
  | { code: 'pdf-danado'; mensaje: string }

export type ResultadoProcesamiento =
  | { ok: true; file: File; warnings: WarningProcesamiento[] }
  | { ok: false; reason: RazonRechazo }

const BLUR_RECHAZO_LIMIT = 30
const BLUR_WARNING_LIMIT = 80

export async function procesarArchivo(
  file: File,
  contexto: ContextoProcesamiento,
): Promise<ResultadoProcesamiento> {
  const warnings: WarningProcesamiento[] = []

  const realType = await detectFileType(file)

  if (realType === 'heic' || realType === 'heif') {
    return {
      ok: false,
      reason: {
        code: 'heic-no-soportado',
        mensaje:
          'Tu iPhone guardó la foto en formato HEIC. Conviértela a JPG desde la app Fotos (Compartir → Opciones → Más compatible) e inténtalo otra vez.',
      },
    }
  }

  const declaredKind = mimeToKind(file.type)
  if (realType === 'unknown' || realType !== declaredKind) {
    return {
      ok: false,
      reason: {
        code: 'mime-spoof',
        mensaje: 'No reconocimos el formato del archivo. Usa una foto JPG, PNG o un PDF original.',
      },
    }
  }

  const esPDF = realType === 'pdf'
  const maxRaw = esPDF ? MAX_SIZE_PDF_BYTES : MAX_SIZE_IMAGEN_BYTES
  if (file.size > maxRaw) {
    return esPDF
      ? {
          ok: false,
          reason: {
            code: 'tamano-pdf',
            mensaje: `El PDF supera ${Math.round(MAX_SIZE_PDF_BYTES / (1024 * 1024))} MB. Compártelo con menor calidad o sólo las páginas necesarias.`,
          },
        }
      : {
          ok: false,
          reason: {
            code: 'tamano-imagen',
            mensaje: `La foto es muy pesada (supera ${Math.round(MAX_SIZE_IMAGEN_BYTES / (1024 * 1024))} MB). Tómala con menor resolución o compártela como JPG desde tu galería.`,
          },
        }
  }

  if (esPDF) {
    // Fase B: PDF pasa sin validación adicional.
    // Fase C añade validatePDF (páginas, password, daño) y checkPDFFirstPageAspect.
    return { ok: true, file, warnings }
  }

  const rotated = await autoRotateImage(file)
  const compressed = await compressImage(rotated)

  const dims = await getImageDimensions(compressed)
  const minDim =
    contexto === 'domicilio' ? RESOLUCION_MIN_DOMICILIO_PX : RESOLUCION_MIN_IDENTIDAD_PX
  if (Math.min(dims.width, dims.height) < minDim) {
    return {
      ok: false,
      reason: {
        code: 'resolucion-baja',
        mensaje: 'La imagen está muy pixelada. Acércate más al documento o limpia el lente.',
      },
    }
  }

  const blur = await getBlurScore(compressed)
  if (blur < BLUR_RECHAZO_LIMIT) {
    return {
      ok: false,
      reason: {
        code: 'blur-grave',
        mensaje:
          'La foto está muy borrosa. Asegúrate de que el documento esté quieto y bien iluminado.',
      },
    }
  }
  if (blur < BLUR_WARNING_LIMIT) {
    warnings.push({
      code: 'blur-moderado',
      mensaje: 'La foto está un poco borrosa — puede dificultar la revisión.',
    })
  }

  return { ok: true, file: compressed, warnings }
}
