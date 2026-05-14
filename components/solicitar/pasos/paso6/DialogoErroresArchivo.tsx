'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export interface DialogoErroresArchivoItem {
  filename: string
  reason: string
}

interface DialogoErroresArchivoProps {
  open: boolean
  onClose: () => void
  items: DialogoErroresArchivoItem[]
}

export function DialogoErroresArchivo({ open, onClose, items }: DialogoErroresArchivoProps) {
  const titulo =
    items.length === 1
      ? 'No pudimos agregar este archivo'
      : 'Algunos archivos no se pudieron agregar'

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent size="default" aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogMedia tone="destructive">
            <span className="material-symbols-outlined" aria-hidden>
              error
            </span>
          </AlertDialogMedia>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          {items.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {items.map((item, i) => (
                <li
                  key={`${item.filename}-${i}`}
                  className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.filename}
                  </span>
                  {' — '}
                  {item.reason}
                </li>
              ))}
            </ul>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="destructive" onClick={onClose}>
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
