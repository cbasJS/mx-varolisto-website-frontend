'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const SubmittingContext = createContext(false)
const SetSubmittingContext = createContext<(v: boolean) => void>(() => {})

export function SubmittingProvider({ children }: { children: React.ReactNode }) {
  const [submitting, setSubmitting] = useState(false)
  const set = useCallback((v: boolean) => setSubmitting(v), [])

  return (
    <SubmittingContext.Provider value={submitting}>
      <SetSubmittingContext.Provider value={set}>{children}</SetSubmittingContext.Provider>
    </SubmittingContext.Provider>
  )
}

export function useSubmittingContext(): boolean {
  return useContext(SubmittingContext)
}

export function useSetSubmitting(): (v: boolean) => void {
  return useContext(SetSubmittingContext)
}
