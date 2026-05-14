'use client'

import { CheckCircle2, FileText, UploadCloud } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type DropzoneCardSharedProps = {
  getRootProps: () => object
  getInputProps: () => object
  isDragActive: boolean
  disabled: boolean
}

type DropzoneCardIdProps = DropzoneCardSharedProps & {
  variant: 'id'
  label: string
  done: boolean
  icon?: LucideIcon
}

type DropzoneCardComprobanteIngresoProps = DropzoneCardSharedProps & {
  variant: 'comprobante-ingreso'
}

type DropzoneCardComprobanteDomicilioProps = DropzoneCardSharedProps & {
  variant: 'comprobante-domicilio'
  label: string
  done: boolean
  icon?: LucideIcon
}

type DropzoneCardProps =
  | DropzoneCardIdProps
  | DropzoneCardComprobanteIngresoProps
  | DropzoneCardComprobanteDomicilioProps

const COPY_ID = 'Foto o PDF · Máx. 15 MB · Sube cada lado por separado'
const COPY_INGRESO = 'JPG, PNG o PDF · Imagen 15 MB · PDF 8 MB · Al menos 2 · Hasta 3 archivos'
const COPY_DOMICILIO =
  'Foto o PDF · Imagen 15 MB · PDF 8 MB · Recibo de servicio o predial · Vigencia ≤ 3 meses'

export function DropzoneCard(props: DropzoneCardProps) {
  const { getRootProps, getInputProps, isDragActive, disabled } = props
  const inputProps = getInputProps() as React.InputHTMLAttributes<HTMLInputElement>

  if (props.variant === 'id') {
    const { label, done, icon: Icon = FileText } = props
    return (
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-gray-50/50 p-8 text-center transition-colors',
          disabled && 'cursor-not-allowed opacity-50',
          done && 'border-green-500',
          !disabled && !done && isDragActive && 'border-secondary bg-secondary/5',
          !disabled && !done && !isDragActive && 'border-gray-300 hover:bg-gray-50',
        )}
      >
        <input {...inputProps} />
        {done ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="mb-3 size-8 text-green-600" aria-hidden />
            <p className="text-sm font-bold text-green-900">¡Listo!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
              <Icon className="size-5 text-gray-500" aria-hidden />
            </div>
            <p className="mb-1 text-sm font-bold text-on-surface">{label}</p>
            <p className="text-xs text-gray-500">{COPY_ID}</p>
          </div>
        )}
      </div>
    )
  }

  if (props.variant === 'comprobante-domicilio') {
    const { label, done, icon: Icon = FileText } = props
    return (
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-gray-50/50 p-8 text-center transition-colors',
          disabled && 'cursor-not-allowed opacity-50',
          done && 'border-green-500',
          !disabled && !done && isDragActive && 'border-secondary bg-secondary/5',
          !disabled && !done && !isDragActive && 'border-gray-300 hover:bg-gray-50',
        )}
      >
        <input {...inputProps} />
        {done ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="mb-3 size-8 text-green-600" aria-hidden />
            <p className="text-sm font-bold text-green-900">¡Listo!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
              <Icon className="size-5 text-gray-500" aria-hidden />
            </div>
            <p className="mb-1 text-sm font-bold text-on-surface">{label}</p>
            <p className="text-xs text-gray-500">{COPY_DOMICILIO}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-gray-50/50 p-10 text-center transition-colors',
        disabled ? 'cursor-not-allowed border-gray-200 opacity-50' : 'cursor-pointer',
        !disabled && isDragActive && 'border-secondary bg-secondary/5',
        !disabled && !isDragActive && 'border-gray-300 hover:bg-gray-50',
      )}
    >
      <input {...inputProps} />
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
        <UploadCloud className="size-5 text-gray-500" aria-hidden />
      </div>
      <p className="mb-1 text-sm font-bold text-on-surface">
        {isDragActive ? 'Suelta el archivo' : 'Toca para subir o arrastra aquí'}
      </p>
      <p className="text-xs text-gray-500">{COPY_INGRESO}</p>
    </div>
  )
}
