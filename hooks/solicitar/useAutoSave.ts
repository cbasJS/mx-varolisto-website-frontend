'use client'

import { useEffect, useRef } from 'react'
import type { FieldValues, UseFormWatch } from 'react-hook-form'
import { useSolicitudStore } from '@/lib/solicitud/store'

export function useAutoSave<T extends FieldValues>(
  watch: UseFormWatch<T>,
  paso: number,
  delayMs = 300,
): void {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const subscription = watch((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        useSolicitudStore.getState().guardarPaso(paso, value as Partial<T>)
      }, delayMs)
    })
    return () => {
      subscription.unsubscribe()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [watch, paso, delayMs])
}
