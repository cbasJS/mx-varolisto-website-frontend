'use client'

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
  icono: string
  done: boolean
}

type DropzoneCardComprobanteProps = DropzoneCardSharedProps & {
  variant: 'comprobante'
}

type DropzoneCardProps = DropzoneCardIdProps | DropzoneCardComprobanteProps

export function DropzoneCard(props: DropzoneCardProps) {
  const { getRootProps, getInputProps, isDragActive, disabled } = props
  const inputProps = getInputProps() as React.InputHTMLAttributes<HTMLInputElement>

  if (props.variant === 'id') {
    const { label, icono, done } = props
    return (
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          done && 'border-secondary/50 bg-secondary/5',
          !disabled && !done && isDragActive && 'border-secondary bg-secondary/5 scale-[1.01]',
          !disabled &&
            !done &&
            !isDragActive &&
            'border-outline-variant bg-surface-bright hover:border-primary/40 hover:bg-primary/3',
        )}
      >
        <input {...inputProps} />
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full transition-colors',
              done ? 'bg-secondary/20' : isDragActive ? 'bg-secondary/20' : 'bg-surface-container',
            )}
          >
            <span
              className={cn(
                'material-symbols-outlined text-xl',
                done ? 'text-secondary' : isDragActive ? 'text-secondary' : 'text-outline',
              )}
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              {done ? 'check_circle' : icono}
            </span>
          </div>
          <p className="text-sm font-semibold text-on-surface">{done ? 'Subida exitosa' : label}</p>
          {!done && <p className="text-xs text-outline">JPG, PNG o PDF · Máx. 10 MB</p>}
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
        disabled
          ? 'cursor-not-allowed border-surface-container-high bg-surface-bright opacity-50'
          : 'cursor-pointer',
        !disabled && isDragActive
          ? 'border-secondary bg-secondary/5 scale-[1.01]'
          : !disabled
            ? 'border-outline-variant bg-surface-bright hover:border-primary/40 hover:bg-primary/3'
            : '',
      )}
    >
      <input {...inputProps} />
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-12 items-center justify-center rounded-full bg-surface-container">
          <span
            className="material-symbols-outlined text-2xl text-outline"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            {isDragActive ? 'file_download' : 'upload_file'}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">
            {isDragActive ? 'Suelta aquí los archivos' : 'Arrastra o toca para subir'}
          </p>
          <p className="mt-0.5 text-xs text-outline">JPG, PNG o PDF · Máx. 10 MB c/u</p>
        </div>
      </div>
    </div>
  )
}
