'use client'

import { useEffect } from 'react'
import { Check, Sparkles, User, Home, Wallet, Users } from 'lucide-react'
import { toast } from 'sonner'
import { usePaso7 } from '@/hooks/solicitar/usePaso7'
import { useSolicitudStore } from '@/lib/solicitud/store'
import type { Paso7Data } from '@/lib/solicitud/schemas/index'
import type { ErrorSubmit } from '@/hooks/solicitar/useSolicitudNavigation'
import { calcularCuota } from '@/lib/solicitud/domain/loan/calcularCuota'
import { DESTINO_LABELS } from '@/lib/solicitud/utils/lookup-labels'
import { StepTitle } from '@/components/wizard/StepTitle'
import { FormCard } from '@/components/wizard/FormCard'
import { SeccionCard } from './SeccionCard'
import { Fila } from './FilaDatos'
import { ModalConflicto } from './ModalConflicto'
import { ModalPlazoInvalido } from './ModalPlazoInvalido'
import { ConsentimientosSection } from './ConsentimientosSection'
import { DevMockPanel } from './DevMockPanel'
import { isDevMockEnabled } from '@/lib/solicitud/dev/mockSubmit'
import { cn } from '@/lib/utils'
import { ACTIVE_PASO_FORM_ID } from '@/components/wizard/PasoFormShell'
import {
  useInlineRevealed,
  useRegisterWizardActions,
} from '@/components/wizard/WizardActionsContext'

interface Props {
  onSubmit: (datos: Paso7Data) => void
  onBack: () => void
  onEditarPaso: (paso: number) => void
  enviando: boolean
  errorSubmit: ErrorSubmit | null
  onLimpiarError: () => void
  onConflictoConfirmado: () => void
}

export default function Paso7Revision({
  onSubmit,
  onBack,
  onEditarPaso,
  enviando,
  errorSubmit,
  onLimpiarError,
  onConflictoConfirmado,
}: Props) {
  const datos = useSolicitudStore((s) => s.datos)

  const { handleSubmit, setValue, errors, privacidad, terminos } = usePaso7(onSubmit)

  useEffect(() => {
    if (errorSubmit?.tipo === 'red') {
      toast.error('No pudimos enviar tu solicitud. Revisa tu conexión y vuelve a intentar.', {
        onDismiss: onLimpiarError,
        onAutoClose: onLimpiarError,
      })
    } else if (errorSubmit?.tipo === 'desconocido') {
      toast.error(
        errorSubmit.mensaje ?? 'Algo no salió como esperábamos. Vuelve a intentar en un momento.',
        {
          onDismiss: onLimpiarError,
          onAutoClose: onLimpiarError,
        },
      )
    }
  }, [errorSubmit]) // eslint-disable-line react-hooks/exhaustive-deps

  const ambosAceptados = privacidad === true && terminos === true
  const { inlineRevealed } = useInlineRevealed()

  // Registra el CTA en el WizardActionsContext para que el StickyMobileCTA
  // funcione idéntico al botón inline: deshabilitado sin checkboxes, loading
  // mientras el POST está en vuelo, copy "Enviar solicitud" con icono Check.
  // `submitVariant: 'success'` → verde varolisto (#2ECC71). `submitShimmer`
  // → animación premium tipo BottomNav. `alwaysVisible: true` → el sticky
  // aparece desde el inicio sin esperar scroll, pero igual hace crossfade
  // hacia el inline al llegar al fondo.
  useRegisterWizardActions({
    formId: ACTIVE_PASO_FORM_ID,
    submitLabel: 'Enviar solicitud',
    disabled: !ambosAceptados,
    loading: enviando,
    loadingLabel: 'Enviando tu solicitud…',
    onBack,
    submitIcon: Check,
    submitVariant: 'success',
    submitShimmer: true,
    alwaysVisible: true,
  })

  const cuotaMensual =
    datos.montoSolicitado && datos.plazoMeses
      ? calcularCuota(datos.montoSolicitado, Number(datos.plazoMeses))
      : 0

  const referencias = datos.referencias ?? []

  return (
    <>
      {errorSubmit?.tipo === 'conflicto' && <ModalConflicto onConfirmado={onConflictoConfirmado} />}
      {errorSubmit?.tipo === 'plazo_invalido_para_monto' && (
        <ModalPlazoInvalido onConfirmado={onConflictoConfirmado} />
      )}

      <form id={ACTIVE_PASO_FORM_ID} onSubmit={handleSubmit} noValidate>
        <FormCard>
          <StepTitle
            titulo="Casi listo. Revisa todo"
            subtitulo="Antes de enviar, dale una última checada. Puedes editar cualquier sección."
          />

          {isDevMockEnabled() && (
            <DevMockPanel
              enviando={enviando}
              onSimular={() => onSubmit({ aceptaPrivacidad: true, aceptaTerminos: true })}
            />
          )}

          <div className="mb-8 space-y-4">
            {/* Detalles del préstamo (gradient navy) */}
            <SeccionCard
              titulo="Tu préstamo"
              paso={1}
              onEditar={onEditarPaso}
              icono={Sparkles}
              variant="prestamo"
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <Fila
                  label="Monto solicitado"
                  invertido
                  value={
                    datos.montoSolicitado
                      ? `$${datos.montoSolicitado.toLocaleString('es-MX')}`
                      : undefined
                  }
                />
                <Fila
                  label="Plazo a pagar"
                  invertido
                  value={datos.plazoMeses ? `${datos.plazoMeses} meses` : undefined}
                />
                <Fila
                  label="Pago mensual aproximado"
                  destacado
                  value={cuotaMensual ? `$${cuotaMensual.toLocaleString('es-MX')}` : undefined}
                />
                <Fila
                  label="Para qué"
                  invertido
                  value={datos.destinoPrestamo ? DESTINO_LABELS[datos.destinoPrestamo] : undefined}
                />
              </div>
            </SeccionCard>

            {/* Datos personales */}
            <SeccionCard titulo="Tus datos" paso={2} onEditar={onEditarPaso} icono={User}>
              <div className="grid grid-cols-1 gap-x-2 gap-y-4 text-sm sm:grid-cols-2">
                <Fila
                  label="Nombre"
                  value={
                    `${datos.nombre ?? ''} ${datos.apellidoPaterno ?? ''} ${datos.apellidoMaterno ?? ''}`.trim() ||
                    undefined
                  }
                />
                <Fila label="CURP" value={datos.curp} />
                <Fila label="Celular" value={datos.telefono} />
                <Fila label="Correo" value={datos.email} breakAll />
              </div>
            </SeccionCard>

            {/* Domicilio */}
            <SeccionCard titulo="Dónde vives" paso={3} onEditar={onEditarPaso} icono={Home}>
              <Fila
                label="Dirección"
                value={
                  datos.calle
                    ? `${datos.calle} ${datos.numeroExterior ?? ''}${datos.numeroInterior ? ' Int. ' + datos.numeroInterior : ''}, ${datos.colonia ?? ''}, ${datos.municipio ?? ''}, ${datos.estado ?? ''}, C.P. ${datos.codigoPostal ?? ''}`
                    : undefined
                }
              />
            </SeccionCard>

            {/* Economía */}
            <SeccionCard
              titulo="Trabajo y finanzas"
              paso={4}
              onEditar={onEditarPaso}
              icono={Wallet}
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Fila
                  label="Ingreso mensual"
                  value={
                    datos.ingresoMensual
                      ? `$${datos.ingresoMensual.toLocaleString('es-MX')} MN`
                      : undefined
                  }
                />
                <Fila
                  label="Gasto mensual"
                  value={
                    typeof datos.gastoMensual === 'number'
                      ? `$${datos.gastoMensual.toLocaleString('es-MX')} MN`
                      : undefined
                  }
                />
              </div>
            </SeccionCard>

            {/* Referencias — array dinámico */}
            <SeccionCard titulo="Tus contactos" paso={5} onEditar={onEditarPaso} icono={Users}>
              {referencias.length === 0 ? (
                <p className="text-sm text-outline">No has agregado contactos todavía.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  {referencias.map((ref, i) => (
                    <div key={i} className="min-w-0">
                      <span className="mb-1 block text-xs text-gray-500">Contacto {i + 1}</span>
                      <span className="block truncate font-medium text-gray-900">
                        {ref.nombre || 'No especificado'}
                      </span>
                      {ref.telefono && (
                        <span className="block text-xs text-gray-500">{ref.telefono}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SeccionCard>
          </div>

          <ConsentimientosSection
            privacidad={privacidad}
            terminos={terminos}
            onPrivacidadChange={(checked) =>
              setValue(
                'aceptaPrivacidad',
                checked === true ? true : (undefined as unknown as true),
                {
                  shouldValidate: true,
                },
              )
            }
            onTerminosChange={(checked) =>
              setValue('aceptaTerminos', checked === true ? true : (undefined as unknown as true), {
                shouldValidate: true,
              })
            }
            errorPrivacidad={errors.aceptaPrivacidad?.message}
            errorTerminos={errors.aceptaTerminos?.message}
          />
        </FormCard>

        {/* Botones inline — pill shape (rounded-full) match BottomNav. En
            mobile aparecen cuando el usuario llega al fondo (`inlineRevealed`)
            haciendo crossfade con el sticky verde + shimmer. En desktop son
            visibles siempre. Reservan espacio siempre (opacity) para evitar
            layout shifts que causarían loops del IntersectionObserver. */}
        <div
          className={cn(
            'mt-8 flex items-stretch gap-3 transition-opacity duration-200',
            inlineRevealed
              ? 'opacity-100'
              : 'pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100',
          )}
        >
          <button
            type="button"
            onClick={onBack}
            disabled={enviando}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Atrás
          </button>
          <button
            type="submit"
            disabled={!ambosAceptados || enviando}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-secondary px-5 py-3 text-base font-medium text-white shadow-md shadow-secondary/30 transition-all',
              !ambosAceptados || enviando
                ? 'cursor-not-allowed opacity-60'
                : 'cta-shimmer hover:bg-secondary/95 active:scale-[0.98]',
            )}
          >
            {enviando ? (
              <>
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Enviando tu solicitud…</span>
              </>
            ) : (
              <>
                <span>Enviar solicitud</span>
                <Check className="size-4 shrink-0" aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
