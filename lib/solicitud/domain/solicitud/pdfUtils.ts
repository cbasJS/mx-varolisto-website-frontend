import type { RazonRechazo } from './fileProcessor'

type PdfjsLib = typeof import('pdfjs-dist')

let pdfjsModulePromise: Promise<PdfjsLib> | null = null

async function loadPdfjs(): Promise<PdfjsLib> {
  if (pdfjsModulePromise) return pdfjsModulePromise
  pdfjsModulePromise = import('pdfjs-dist').then((mod) => {
    // pdfjs v5 expone el worker como ESM. Turbopack/Next 16 resuelve el
    // new URL contra import.meta.url y lo emite como asset estático.
    mod.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString()
    return mod
  })
  return pdfjsModulePromise
}

export type ValidatePDFResult = { ok: true } | { ok: false; reason: RazonRechazo }

export async function validatePDF(file: File, maxPages: number): Promise<ValidatePDFResult> {
  let pdfjsLib: PdfjsLib
  try {
    pdfjsLib = await loadPdfjs()
  } catch {
    return {
      ok: false,
      reason: {
        code: 'pdf-danado',
        mensaje:
          'No pudimos leer este PDF. Puede estar dañado — expórtalo de nuevo desde tu banco o aplicación.',
      },
    }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    if (pdf.numPages > maxPages) {
      const tail =
        maxPages === 1
          ? 'Sube sólo la hoja necesaria.'
          : `Comparte sólo las páginas relevantes (máximo ${maxPages}).`
      return {
        ok: false,
        reason: {
          code: 'pdf-paginas-excedidas',
          mensaje: `Este PDF tiene ${pdf.numPages} páginas — máximo ${maxPages}. ${tail}`,
        },
      }
    }
    return { ok: true }
  } catch (err) {
    const name = (err as { name?: string } | null)?.name
    if (name === 'PasswordException') {
      return {
        ok: false,
        reason: {
          code: 'pdf-password',
          mensaje:
            'Este PDF está protegido con contraseña. Expórtalo sin protección desde tu banco o aplicación.',
        },
      }
    }
    return {
      ok: false,
      reason: {
        code: 'pdf-danado',
        mensaje:
          'No pudimos leer este PDF. Puede estar dañado — expórtalo de nuevo desde tu banco o aplicación.',
      },
    }
  }
}
