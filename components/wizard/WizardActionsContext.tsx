'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import { ArrowRight } from 'lucide-react'

export type SubmitVariant = 'primary' | 'success'

/**
 * Estado del CTA primario del paso activo. Cada paso registra su configuración
 * vía `useRegisterWizardActions` y el StickyMobileCTA + los botones inline
 * leen desde aquí.
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
  /**
   * Estilo del botón submit. `primary` = navy (default), `success` = verde
   * varolisto (`#2ECC71`) — usado en paso 7 para el envío final.
   */
  submitVariant: SubmitVariant
  /** Aplica la animación cta-shimmer al botón submit (haz de luz). */
  submitShimmer: boolean
  /**
   * Si `true`, el sticky se muestra siempre en mobile (ignora scroll y
   * `inlineRevealed`). Usado en paso 1 — el sticky es el CTA principal de la
   * calculadora desde el inicio.
   */
  alwaysVisible: boolean
}

const DEFAULT_STATE: WizardActionsState = {
  formId: 'paso-form-activo',
  submitLabel: 'Continuar',
  disabled: false,
  loading: false,
  submitIcon: ArrowRight,
  submitVariant: 'primary',
  submitShimmer: false,
  alwaysVisible: false,
}

interface ContextValue {
  state: WizardActionsState
  setState: (next: WizardActionsState) => void
  resetState: () => void
  /**
   * Indica que los CTAs inline al fondo del form son visibles en el viewport.
   * Cuando `true`, el sticky se oculta (excepto si `alwaysVisible`) y los
   * botones inline se hacen visibles en mobile.
   */
  inlineRevealed: boolean
  setInlineRevealed: (v: boolean) => void
}

const WizardActionsContext = createContext<ContextValue | null>(null)

export function WizardActionsProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<WizardActionsState>(DEFAULT_STATE)
  const [inlineRevealed, setInlineRevealedRaw] = useState(false)

  const setState = useCallback((next: WizardActionsState) => {
    setStateRaw(next)
  }, [])

  const resetState = useCallback(() => {
    setStateRaw(DEFAULT_STATE)
  }, [])

  const setInlineRevealed = useCallback((v: boolean) => {
    setInlineRevealedRaw(v)
  }, [])

  const value = useMemo(
    () => ({ state, setState, resetState, inlineRevealed, setInlineRevealed }),
    [state, setState, resetState, inlineRevealed, setInlineRevealed],
  )

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

/** Lee el flag `inlineRevealed` (y su setter) del contexto. */
export function useInlineRevealed(): {
  inlineRevealed: boolean
  setInlineRevealed: (v: boolean) => void
} {
  const ctx = useContext(WizardActionsContext)
  return {
    inlineRevealed: ctx?.inlineRevealed ?? false,
    setInlineRevealed: ctx?.setInlineRevealed ?? (() => {}),
  }
}

/**
 * Hook para que cada paso registre su configuración de CTA. Los cambios en
 * `state` se reflejan automáticamente en el sticky y en los botones inline.
 *
 * Pasa `null` para no registrar (paso fuera del flujo del sticky).
 *
 * IMPORTANTE: el effect depende sólo de valores primitivos. `onBack` se
 * mantiene en un ref para evitar re-runs cuando los pasos pasan una nueva
 * referencia cada render (handlers no memoizados como `useSolicitudNavigation.handleBack`).
 * El sticky invoca `onBackRef.current()`, así siempre llama la versión actual.
 */
export function useRegisterWizardActions(state: Partial<WizardActionsState> | null): void {
  const ctx = useContext(WizardActionsContext)

  const onBackRef = useRef<(() => void) | undefined>(state?.onBack)
  // Mantener el ref siempre con la última versión sin disparar el effect.
  onBackRef.current = state?.onBack

  // Serializa los demás campos como primitivos para deps del effect.
  const hasOnBack = state?.onBack !== undefined
  const formId = state?.formId
  const submitLabel = state?.submitLabel
  const disabled = state?.disabled
  const loading = state?.loading
  const loadingLabel = state?.loadingLabel
  const submitIcon = state?.submitIcon
  const submitVariant = state?.submitVariant
  const submitShimmer = state?.submitShimmer
  const alwaysVisible = state?.alwaysVisible

  useEffect(() => {
    if (!ctx || !state) return
    ctx.setState({
      ...DEFAULT_STATE,
      ...(formId !== undefined && { formId }),
      ...(submitLabel !== undefined && { submitLabel }),
      ...(disabled !== undefined && { disabled }),
      ...(loading !== undefined && { loading }),
      ...(loadingLabel !== undefined && { loadingLabel }),
      ...(submitIcon !== undefined && { submitIcon }),
      ...(submitVariant !== undefined && { submitVariant }),
      ...(submitShimmer !== undefined && { submitShimmer }),
      ...(alwaysVisible !== undefined && { alwaysVisible }),
      // onBack: wrapper estable que delega al ref actual. Solo se setea si el
      // paso actualmente expone onBack (`hasOnBack`).
      ...(hasOnBack && { onBack: () => onBackRef.current?.() }),
    })
    return () => {
      ctx.resetState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formId,
    submitLabel,
    disabled,
    loading,
    loadingLabel,
    hasOnBack,
    submitIcon,
    submitVariant,
    submitShimmer,
    alwaysVisible,
  ])
}
