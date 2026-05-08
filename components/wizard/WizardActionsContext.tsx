'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * Estado del CTA primario del paso activo. Cada paso registra su configuración
 * vía `useRegisterWizardActions` y el StickyMobileCTA lee desde aquí.
 *
 * Mantenemos esta forma única para los 3 escenarios (paso 1, pasos 2-6, paso 7),
 * de modo que el sticky funcione exactamente igual a los CTAs inline.
 */
export interface WizardActionsState {
  /** id del `<form>` al que el botón submit del sticky se vincula. */
  formId: string
  submitLabel: string
  /** Bloquea el submit (validación pendiente, paso 7 sin checkboxes, etc.). */
  disabled: boolean
  /** Estado de envío en vuelo (paso 7). Bloquea ambos botones. */
  loading: boolean
  /** Texto a mostrar mientras `loading` es true. */
  loadingLabel?: string
  /** Si está definido, el sticky muestra el botón Atrás y dispara este handler. */
  onBack?: () => void
  /** Icono a la derecha del botón submit (default: ArrowRight). */
  submitIcon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
}

const DEFAULT_STATE: WizardActionsState = {
  formId: 'paso-form-activo',
  submitLabel: 'Continuar',
  disabled: false,
  loading: false,
  submitIcon: ArrowRight,
}

interface ContextValue {
  state: WizardActionsState
  setState: (next: WizardActionsState) => void
  resetState: () => void
}

const WizardActionsContext = createContext<ContextValue | null>(null)

export function WizardActionsProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<WizardActionsState>(DEFAULT_STATE)

  const setState = useCallback((next: WizardActionsState) => {
    setStateRaw(next)
  }, [])

  const resetState = useCallback(() => {
    setStateRaw(DEFAULT_STATE)
  }, [])

  const value = useMemo(() => ({ state, setState, resetState }), [state, setState, resetState])

  return <WizardActionsContext.Provider value={value}>{children}</WizardActionsContext.Provider>
}

/**
 * Lee el estado actual del CTA del paso activo. El sticky lo consume.
 * Devuelve los defaults si no hay provider (para componentes fuera del wizard).
 */
export function useWizardActionsState(): WizardActionsState {
  const ctx = useContext(WizardActionsContext)
  return ctx?.state ?? DEFAULT_STATE
}

/**
 * Hook para que cada paso registre su configuración de CTA. Los cambios en
 * `state` se reflejan automáticamente en el sticky.
 *
 * Pasa `null` para no registrar (paso fuera del flujo del sticky).
 */
export function useRegisterWizardActions(state: Partial<WizardActionsState> | null): void {
  const ctx = useContext(WizardActionsContext)

  // Serializa los handlers para detectar cambios sin re-render infinito.
  const onBack = state?.onBack
  const formId = state?.formId
  const submitLabel = state?.submitLabel
  const disabled = state?.disabled
  const loading = state?.loading
  const loadingLabel = state?.loadingLabel
  const submitIcon = state?.submitIcon

  useEffect(() => {
    if (!ctx || !state) return
    ctx.setState({
      ...DEFAULT_STATE,
      ...(formId !== undefined && { formId }),
      ...(submitLabel !== undefined && { submitLabel }),
      ...(disabled !== undefined && { disabled }),
      ...(loading !== undefined && { loading }),
      ...(loadingLabel !== undefined && { loadingLabel }),
      ...(onBack !== undefined && { onBack }),
      ...(submitIcon !== undefined && { submitIcon }),
    })
    return () => {
      ctx.resetState()
    }
    // ctx.setState/resetState son estables (useCallback). state.onBack se serializa
    // como referencia — los pasos lo memoizan o lo pasan estable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, submitLabel, disabled, loading, loadingLabel, onBack, submitIcon])
}
