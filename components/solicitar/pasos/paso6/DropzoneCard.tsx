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

type DropzoneCardComprobanteProps = DropzoneCardSharedProps & {
  variant: 'comprobante'
}

type DropzoneCardProps = DropzoneCardIdProps | DropzoneCardComprobanteProps

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
            <p className="text-sm font-bold text-green-900">Subida exitosa</p>
            <p className="mt-1 text-xs text-green-700">Toca para cambiar</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
              <Icon className="size-5 text-gray-500" aria-hidden />
            </div>
            <p className="mb-1 text-sm font-bold text-on-surface">{label}</p>
            <p className="text-xs text-gray-500">JPG, PNG o PDF · Máx. 10 MB</p>
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
        {isDragActive ? 'Suelta aquí los archivos' : 'Arrastra o toca para subir'}
      </p>
      <p className="text-xs text-gray-500">JPG, PNG o PDF · Máx. 10 MB c/u</p>
    </div>
  )
}
