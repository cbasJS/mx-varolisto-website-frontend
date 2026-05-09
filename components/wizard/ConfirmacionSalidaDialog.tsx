'use client'

import { TriangleAlert } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export interface ConfirmacionSalidaCopy {
  titulo: string
  descripcion: string
  botonQuedarme: string
  botonSalir: string
}

interface Props {
  open: boolean
  copy: ConfirmacionSalidaCopy
  onQuedarme: () => void
  onSalir: () => void
}

export default function ConfirmacionSalidaDialog({ open, copy, onQuedarme, onSalir }: Props) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          onQuedarme()
        }}
      >
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-[#fef3c7] text-[#b45309] dark:bg-[#fef3c7]/10 dark:text-[#fcd34d]">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>{copy.titulo}</AlertDialogTitle>
          <AlertDialogDescription>{copy.descripcion}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="outline-destructive" onClick={onSalir}>
            {copy.botonSalir}
          </AlertDialogAction>
          <AlertDialogCancel variant="primary" onClick={onQuedarme}>
            {copy.botonQuedarme}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
