'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { usePaso7 } from '@/hooks/solicitar/usePaso7'
import { useSolicitudStore } from '@/lib/solicitud/store'
import type { Paso7Data } from '@/lib/solicitud/schemas/index'
import type { ErrorSubmit } from '@/hooks/solicitar/useSolicitudNavigation'
import {
  DESTINO_LABELS,
  ACTIVIDAD_LABELS,
  RELACION_LABELS,
  ANTIGUEDAD_LABELS,
  ANIOS_VIVIENDO_LABELS,
  TIPO_VIVIENDA_LABELS,
  ESTADO_CIVIL_LABELS,
  DEPENDIENTES_LABELS,
  TIPO_IDENTIFICACION_LABELS,
} from '@/lib/solicitud/utils/lookup-labels'
import { StepTitle } from '@/components/wizard/StepTitle'
import { SeccionCard } from './SeccionCard'
import { Fila, SubLabel } from './FilaDatos'
import { ModalConflicto } from './ModalConflicto'
import { ConsentimientosSection } from './ConsentimientosSection'
import { pasos } from '@/content/solicitar'

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
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const tipoIdentificacion = useSolicitudStore((s) => s.tipoIdentificacion)

  const { handleSubmit, setValue, errors, privacidad, terminos, ambosAceptados } =
    usePaso7(onSubmit)

  useEffect(() => {
    if (errorSubmit?.tipo === 'red') {
      toast.error('Algo salió mal al enviar. Revisa tu conexión e inténtalo de nuevo.', {
        onDismiss: onLimpiarError,
        onAutoClose: onLimpiarError,
      })
    } else if (errorSubmit?.tipo === 'desconocido') {
      toast.error(errorSubmit.mensaje ?? 'Ocurrió un error inesperado. Inténtalo de nuevo.', {
        onDismiss: onLimpiarError,
        onAutoClose: onLimpiarError,
      })
    }
  }, [errorSubmit]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {errorSubmit?.tipo === 'conflicto' && <ModalConflicto onConfirmado={onConflictoConfirmado} />}

      <form onSubmit={handleSubmit} noValidate>
        <StepTitle
          numero={7}
          total={pasos.length}
          titulo="Revisa tu solicitud"
          subtitulo="Confirma que todo esté correcto antes de enviar."
        />

        <div className="space-y-3 mb-8">
          {/* Paso 1 — Préstamo */}
          <SeccionCard titulo="Préstamo deseado" paso={1} onEditar={onEditarPaso} icono="payments">
            <Fila
              label="Monto"
              value={
                datos.montoSolicitado
                  ? `$${datos.montoSolicitado.toLocaleString('es-MX')}`
                  : undefined
              }
            />
            <Fila
              label="Plazo"
              value={datos.plazoMeses ? `${datos.plazoMeses} meses` : undefined}
            />
            <Fila
              label="Destino"
              value={datos.destinoPrestamo ? DESTINO_LABELS[datos.destinoPrestamo] : undefined}
            />
          </SeccionCard>

          {/* Paso 2 — Identidad */}
          <SeccionCard titulo="Identidad" paso={2} onEditar={onEditarPaso} icono="person">
            <Fila
              label="Nombre"
              value={`${datos.nombre ?? ''} ${datos.apellidoPaterno ?? ''} ${datos.apellidoMaterno ?? ''}`.trim()}
            />
            <Fila label="CURP" value={datos.curp} />
            <Fila label="Correo" value={datos.email} />
            <Fila label="Teléfono" value={datos.telefono} />
          </SeccionCard>

          {/* Paso 3 — Domicilio */}
          <SeccionCard titulo="Domicilio" paso={3} onEditar={onEditarPaso} icono="home">
            <Fila
              label="Dirección"
              value={
                datos.calle
                  ? `${datos.calle} ${datos.numeroExterior ?? ''}${datos.numeroInterior ? ' Int. ' + datos.numeroInterior : ''}, ${datos.colonia ?? ''}, ${datos.municipio ?? ''} CP ${datos.codigoPostal ?? ''}`
                  : undefined
              }
            />
            <Fila
              label="Tiempo viviendo"
              value={datos.aniosViviendo ? ANIOS_VIVIENDO_LABELS[datos.aniosViviendo] : undefined}
            />
            <Fila
              label="Tipo de vivienda"
              value={datos.tipoVivienda ? TIPO_VIVIENDA_LABELS[datos.tipoVivienda] : undefined}
            />
          </SeccionCard>

          {/* Paso 4 — Economía */}
          <SeccionCard
            titulo="Situación económica"
            paso={4}
            onEditar={onEditarPaso}
            icono="account_balance_wallet"
          >
            <Fila
              label="Actividad"
              value={datos.tipoActividad ? ACTIVIDAD_LABELS[datos.tipoActividad] : undefined}
            />
            <Fila label="Empleador / Negocio" value={datos.nombreEmpleadorNegocio} />
            <Fila
              label="Antigüedad"
              value={datos.antiguedad ? ANTIGUEDAD_LABELS[datos.antiguedad] : undefined}
            />
            <Fila
              label="Estado civil"
              value={datos.estadoCivil ? ESTADO_CIVIL_LABELS[datos.estadoCivil] : undefined}
            />
            <Fila
              label="Dependientes"
              value={
                datos.dependientesEconomicos
                  ? DEPENDIENTES_LABELS[datos.dependientesEconomicos]
                  : undefined
              }
            />
            <Fila
              label="Ingreso mensual"
              value={
                datos.ingresoMensual
                  ? `$${datos.ingresoMensual.toLocaleString('es-MX')}`
                  : undefined
              }
            />
            <Fila label="Tiene deudas" value={datos.tieneDeudas === 'si' ? 'Sí' : 'No'} />
          </SeccionCard>

          {/* Paso 5 — Referencias */}
          <SeccionCard titulo="Referencias" paso={5} onEditar={onEditarPaso} icono="group">
            <SubLabel>Referencia 1</SubLabel>
            <Fila label="Nombre" value={datos.ref1Nombre} />
            <Fila label="Teléfono" value={datos.ref1Telefono} />
            <Fila
              label="Relación"
              value={datos.ref1Relacion ? RELACION_LABELS[datos.ref1Relacion] : undefined}
            />
            {datos.ref1Email && <Fila label="Correo" value={datos.ref1Email} />}
            <SubLabel>Referencia 2</SubLabel>
            <Fila label="Nombre" value={datos.ref2Nombre} />
            <Fila label="Teléfono" value={datos.ref2Telefono} />
            <Fila
              label="Relación"
              value={datos.ref2Relacion ? RELACION_LABELS[datos.ref2Relacion] : undefined}
            />
            {datos.ref2Email && <Fila label="Correo" value={datos.ref2Email} />}
          </SeccionCard>

          {/* Paso 6 — Documentos */}
          <SeccionCard titulo="Documentos" paso={6} onEditar={onEditarPaso} icono="folder_open">
            <Fila
              label="Identificación"
              value={
                tipoIdentificacion ? TIPO_IDENTIFICACION_LABELS[tipoIdentificacion] : undefined
              }
            />
            <Fila
              label="Archivos subidos"
              value={`${archivosSubidos.length} archivo${archivosSubidos.length !== 1 ? 's' : ''}`}
            />
          </SeccionCard>
        </div>

        <ConsentimientosSection
          privacidad={privacidad}
          terminos={terminos}
          onPrivacidadChange={(checked) =>
            setValue('aceptaPrivacidad', checked === true ? true : (undefined as unknown as true), {
              shouldValidate: true,
            })
          }
          onTerminosChange={(checked) =>
            setValue('aceptaTerminos', checked === true ? true : (undefined as unknown as true), {
              shouldValidate: true,
            })
          }
          errorPrivacidad={errors.aceptaPrivacidad?.message}
          errorTerminos={errors.aceptaTerminos?.message}
        />

        {/* Botones */}
        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={enviando}
            className="flex items-center gap-1.5 rounded-xl border-2 border-surface-container-high bg-white px-6 py-3 text-sm font-semibold text-on-surface-variant transition-all hover:border-outline-variant hover:bg-surface-bright active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden>
              arrow_back
            </span>
            Atrás
          </button>
          <button
            type="submit"
            disabled={!ambosAceptados || enviando}
            className="flex items-center gap-2 rounded-xl bg-secondary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-all hover:bg-secondary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {enviando ? (
              <>
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando…
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden
                >
                  send
                </span>
                Enviar solicitud
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
