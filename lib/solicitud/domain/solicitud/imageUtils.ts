import imageCompression from 'browser-image-compression'

export type TipoArchivoReal = 'jpg' | 'png' | 'webp' | 'pdf' | 'heic' | 'heif' | 'unknown'

export async function detectFileType(file: File): Promise<TipoArchivoReal> {
  if (file.size < 4) return 'unknown'
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())

  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpg'
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return 'png'
  if (head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46) return 'pdf'

  if (head.length >= 12) {
    const sig = Array.from(head.slice(4, 12))
      .map((b) => String.fromCharCode(b))
      .join('')
    if (sig.startsWith('ftypheic') || sig.startsWith('ftyphei')) return 'heic'
    if (sig.startsWith('ftypmif1') || sig.startsWith('ftypheix')) return 'heif'

    if (
      head[0] === 0x52 &&
      head[1] === 0x49 &&
      head[2] === 0x46 &&
      head[3] === 0x46 &&
      head[8] === 0x57 &&
      head[9] === 0x45 &&
      head[10] === 0x42 &&
      head[11] === 0x50
    ) {
      return 'webp'
    }
  }

  return 'unknown'
}

export function mimeToKind(mime: string): TipoArchivoReal {
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'application/pdf':
      return 'pdf'
    case 'image/heic':
      return 'heic'
    case 'image/heif':
      return 'heif'
    default:
      return 'unknown'
  }
}

export async function compressImage(file: File): Promise<File> {
  // browser-image-compression aplica la orientación EXIF del archivo por
  // default, así que el bitmap dibujado al canvas ya queda derecho sin
  // necesidad de un paso autoRotate separado.
  return imageCompression(file, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.82,
  })
}

export function getBlurScore(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      try {
        const score = computeLaplacianVariance(img)
        URL.revokeObjectURL(url)
        resolve(score)
      } catch (err) {
        URL.revokeObjectURL(url)
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen para blur detection'))
    }
    img.src = url
  })
}

function computeLaplacianVariance(img: HTMLImageElement): number {
  const scale = Math.min(1, 400 / Math.max(img.width, img.height))
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  ctx.drawImage(img, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)

  const gray = new Float32Array(w * h)
  for (let i = 0; i < gray.length; i++) {
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
  }

  let sumSquared = 0
  let count = 0
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const lap =
        -gray[(y - 1) * w + x] -
        gray[(y + 1) * w + x] -
        gray[y * w + (x - 1)] -
        gray[y * w + (x + 1)] +
        4 * gray[y * w + x]
      sumSquared += lap * lap
      count++
    }
  }
  if (count === 0) return 0
  return Math.sqrt(sumSquared / count)
}
