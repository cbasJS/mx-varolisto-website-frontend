'use client'

import { useEffect } from 'react'
import type { FieldValues, UseFormWatch } from 'react-hook-form'
import { useSolicitudStore } from '@/lib/solicitud/store'

/**
 * Cuenta cada edición sobre los campos de un `useForm`.
 *
 * Aprovecha la subscripción de `watch()` de react-hook-form: cada vez que un
 * valor del form cambia, el callback recibe `{ name, type }`. `type` es
 * `'change'` en blur/input/change y `undefined` en setValue programático.
 * Sólo contamos los cambios provenientes del usuario (`type === 'change'`)
 * para no inflar el contador con writes internos (defaults, autoSave inverso,
 * etc.).
 *
 * `incrementarEdicion` ya respeta los límites del schema (max 200 keys,
 * regex de nombre válido, clamp a 10_000). Si el campo recibe un nombre
 * fuera de spec — improbable porque vienen del schema Zod — se ignora.
 */
export function useEdicionesTracking<T extends FieldValues>(watch: UseFormWatch<T>): void {
  useEffect(() => {
    const subscription = watch((_value, info) => {
      // `info.type === 'change'` indica un cambio originado por el usuario
      // (vs. setValue programático que llega con `type === undefined`).
      if (!info?.name) return
      if (info.type !== 'change') return
      useSolicitudStore.getState().incrementarEdicion(info.name)
    })
    return () => subscription.unsubscribe()
  }, [watch])
}
