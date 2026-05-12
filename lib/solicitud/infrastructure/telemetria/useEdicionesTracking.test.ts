// @vitest-environment happy-dom
import React from 'react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { useEdicionesTracking } from './useEdicionesTracking'

interface FormShape {
  nombre: string
  curp: string
}

function FormHarness() {
  const { register, watch, setValue } = useForm<FormShape>({
    defaultValues: { nombre: '', curp: '' },
  })
  useEdicionesTracking(watch)
  return React.createElement(
    'form',
    null,
    React.createElement('input', { 'data-testid': 'nombre', ...register('nombre') }),
    React.createElement('input', { 'data-testid': 'curp', ...register('curp') }),
    React.createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'programmatic',
        onClick: () => setValue('nombre', 'X', { shouldDirty: true, shouldTouch: true }),
      },
      'prog',
    ),
  )
}

describe('useEdicionesTracking', () => {
  beforeEach(() => {
    useSolicitudStore.setState({ edicionesPorCampo: {} } as never)
  })
  afterEach(() => {
    cleanup()
  })

  it('incrementa el contador del campo cuando el usuario teclea', () => {
    const { getByTestId } = render(React.createElement(FormHarness))

    fireEvent.change(getByTestId('nombre'), { target: { value: 'J' } })
    fireEvent.change(getByTestId('nombre'), { target: { value: 'Ju' } })
    fireEvent.change(getByTestId('nombre'), { target: { value: 'Juan' } })

    expect(useSolicitudStore.getState().edicionesPorCampo.nombre).toBe(3)
  })

  it('campos distintos llevan contadores independientes', () => {
    const { getByTestId } = render(React.createElement(FormHarness))

    fireEvent.change(getByTestId('nombre'), { target: { value: 'M' } })
    fireEvent.change(getByTestId('curp'), { target: { value: 'a' } })
    fireEvent.change(getByTestId('curp'), { target: { value: 'ab' } })

    const ediciones = useSolicitudStore.getState().edicionesPorCampo
    expect(ediciones.nombre).toBe(1)
    expect(ediciones.curp).toBe(2)
  })

  it('NO cuenta setValue programático (type !== "change")', () => {
    // setValue se usa en useAutoSave inverso y en hidratación; no debe inflar
    // el contador. Sólo cuentan cambios provenientes del DOM.
    const { getByTestId } = render(React.createElement(FormHarness))

    fireEvent.click(getByTestId('programmatic'))
    fireEvent.click(getByTestId('programmatic'))

    expect(useSolicitudStore.getState().edicionesPorCampo.nombre).toBeUndefined()
  })

  it('se desuscribe al desmontar — no sigue contando después', () => {
    const { getByTestId, unmount } = render(React.createElement(FormHarness))
    fireEvent.change(getByTestId('nombre'), { target: { value: 'X' } })
    expect(useSolicitudStore.getState().edicionesPorCampo.nombre).toBe(1)

    unmount()
    // Después de unmount, el contador no se incrementa por side-effects
    // colgados (la subscription se limpió en el cleanup del useEffect).
    expect(useSolicitudStore.getState().edicionesPorCampo.nombre).toBe(1)
  })
})
