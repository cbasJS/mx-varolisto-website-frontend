'use client'

import { useEffect, useRef } from 'react'
import { Check, Sparkles, User, Home, Wallet, Users, FileText, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { usePaso7 } from '@/hooks/solicitar/usePaso7'
import { useSolicitudStore } from '@/lib/solicitud/store'
import type { Paso7Data } from '@/lib/solicitud/schemas/index'
import type { ErrorSubmit } from '@/hooks/solicitar/useSolicitudNavigation'
import { calcularCuota } from '@/lib/solicitud/domain/loan/calcularCuota'
import { DESTINO_LABELS, TIPO_IDENTIFICACION_LABELS } from '@/lib/solicitud/utils/lookup-labels'
import { StepTitle } from '@/components/wizard/StepTitle'
import { FormCard } from '@/components/wizard/FormCard'
import { SeccionCard } from './SeccionCard'
import { Fila } from './FilaDatos'
import { ModalConflicto } from './ModalConflicto'
import { ModalPlazoInvalido } from './ModalPlazoInvalido'
import { ConsentimientosSection } from './ConsentimientosSection'
import { DevMockPanel } from './DevMockPanel'
import { isDevMockEnabled } from '@/lib/solicitud/dev/mockSubmit'
import { pasos } from '@/content/solicitar'
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

interface DocStatusProps {
  label: string
  cargado: boolean
  detalle: string
  icono: typeof Camera
  fullWidth?: boolean
}

function DocStatus({ label, cargado, detalle, icono: Icono, fullWidth }: DocStatusProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3',
        cargado ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50',
        fullWidth && 'md:col-span-2',
      )}
    >
      <div
        className={cn(
          'rounded-lg p-2',
          cargado ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500',
        )}
      >
        <Icono className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-gray-900">{label}</p>
        <p className={cn('text-[10px] font-medium', cargado ? 'text-green-600' : 'text-gray-500')}>
          {detalle}
        </p>
      </div>
    </div>
  )
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
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const tipoIdentificacion = useSolicitudStore((s) => s.tipoIdentificacion)
  const setPaso = useSolicitudStore((s) => s.setPaso)

  // Si el usuario llega al paso 7 sin archivos en memoria (refresh, sesión
  // recién montada) o con archivos que no cumplen requisitos, retrocedemos
  // al paso 6 para que vuelva a subirlos. archivosSubidos no se persiste y
  // los huérfanos del bucket se limpian en beforeunload, así que no
  // intentamos rehidratar — siempre re-pedimos el upload.
  const reconciliacionRef = useRef(false)
  useEffect(() => {
    if (reconciliacionRef.current) return
    reconciliacionRef.current = true

    const tipos = archivosSubidos.map((a) => a.tipoArchivo)
    const tieneIne = tipos.includes('ine_frente') || tipos.includes('pasaporte_principal')
    const tieneIngresos = tipos.filter((t) => t === 'comprobante_ingreso').length >= 2
    const tieneDomicilio = tipos.includes('comprobante_domicilio')
    const cumpleRequisitos = tieneIne && tieneIngresos && tieneDomicilio

    if (!cumpleRequisitos) setPaso(6)
    // Solo corre al montar; las dependencias son leídas vía store snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const tiposSubidos = archivosSubidos.map((a) => a.tipoArchivo)
  const ineCargado =
    tiposSubidos.includes('ine_frente') || tiposSubidos.includes('pasaporte_principal')
  const comprobantesIngreso = tiposSubidos.filter((t) => t === 'comprobante_ingreso').length
  const domicilioCargado = tiposSubidos.includes('comprobante_domicilio')

  return (
    <>
      {errorSubmit?.tipo === 'conflicto' && <ModalConflicto onConfirmado={onConflictoConfirmado} />}
      {errorSubmit?.tipo === 'plazo_invalido_para_monto' && (
        <ModalPlazoInvalido onConfirmado={onConflictoConfirmado} />
      )}

      <form id={ACTIVE_PASO_FORM_ID} onSubmit={handleSubmit} noValidate>
        <FormCard>
          <StepTitle
            numero={7}
            total={pasos.length}
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

            {/* Referencias */}
            <SeccionCard titulo="Tus contactos" paso={5} onEditar={onEditarPaso} icono={Users}>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="min-w-0">
                  <span className="mb-1 block text-xs text-gray-500">Contacto 1</span>
                  <span className="block truncate font-medium text-gray-900">
                    {datos.ref1Nombre || 'No especificado'}
                  </span>
                  {datos.ref1Telefono && (
                    <span className="block text-xs text-gray-500">{datos.ref1Telefono}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="mb-1 block text-xs text-gray-500">Contacto 2</span>
                  <span className="block truncate font-medium text-gray-900">
                    {datos.ref2Nombre || 'No especificado'}
                  </span>
                  {datos.ref2Telefono && (
                    <span className="block text-xs text-gray-500">{datos.ref2Telefono}</span>
                  )}
                </div>
              </div>
            </SeccionCard>

            {/* Documentos */}
            <SeccionCard titulo="Tus documentos" paso={6} onEditar={onEditarPaso} icono={FileText}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <DocStatus
                  label="Tu identificación"
                  cargado={ineCargado}
                  detalle={
                    ineCargado && tipoIdentificacion
                      ? `Listo ✓ (${TIPO_IDENTIFICACION_LABELS[tipoIdentificacion]})`
                      : 'Falta subir'
                  }
                  icono={Camera}
                />
                <DocStatus
                  label="Comprobantes de ingresos"
                  cargado={comprobantesIngreso >= 2}
                  detalle={
                    comprobantesIngreso >= 2
                      ? `${comprobantesIngreso} archivos listos ✓`
                      : `${comprobantesIngreso} de 2 listos`
                  }
                  icono={FileText}
                />
                <DocStatus
                  label="Comprobante de domicilio"
                  cargado={domicilioCargado}
                  detalle={domicilioCargado ? 'Archivo listo ✓' : 'Falta subir'}
                  icono={Home}
                  fullWidth
                />
              </div>
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
