import { ACCEPTED_MIME_TYPES } from '@varolisto/shared-schemas/form'
import type { CrearSolicitudRequest } from '@varolisto/shared-schemas/api'
import type { TipoIdentificacion } from '@varolisto/shared-schemas/enums'
import type { ArchivoSubido } from '@/lib/solicitud/store'

type MimeTypePermitido = (typeof ACCEPTED_MIME_TYPES)[number]

function aMimePermitido(mime: string): MimeTypePermitido {
  // Garantía de tipo en el límite con shared-schemas. La whitelist real
  // se aplica en el input del file picker (accept="image/jpeg,...") y se
  // re-valida en el schema de Zod al enviar — este cast es de tipos, no
  // de seguridad.
  if ((ACCEPTED_MIME_TYPES as readonly string[]).includes(mime)) {
    return mime as MimeTypePermitido
  }
  // Fallback: si llegó algo inesperado, dejamos image/jpeg para que el
  // schema lance un error claro abajo (en lugar de un cast oculto).
  return 'image/jpeg'
}
import type {
  Paso1Data,
  Paso2Data,
  Paso3Data,
  Paso4Data,
  Paso5Data,
  Paso7Data,
} from '@/lib/solicitud/domain/solicitud/schemas'

type DatosSolicitud = Partial<Paso1Data & Paso2Data & Paso3Data & Paso4Data & Paso5Data & Paso7Data>

export interface BuildPayloadInput {
  datos: DatosSolicitud
  sessionUuid: string
  tipoIdentificacion: TipoIdentificacion
  archivosSubidos: ArchivoSubido[]
  paso7Data: Paso7Data
}

export function buildPayload({
  datos,
  sessionUuid,
  tipoIdentificacion,
  archivosSubidos,
  paso7Data,
}: BuildPayloadInput): CrearSolicitudRequest {
  return {
    // Paso 2 (UI) — identidad (schema paso1)
    nombre: datos.nombre ?? '',
    apellidoPaterno: datos.apellidoPaterno ?? '',
    apellidoMaterno: datos.apellidoMaterno ?? '',
    sexo: datos.sexo!,
    fechaNacimiento: datos.fechaNacimiento ?? '',
    curp: datos.curp ?? '',
    email: datos.email ?? '',
    rfc: datos.rfc,
    telefono: datos.telefono ?? '',
    // Paso 3 (UI) — domicilio (schema paso3)
    codigoPostal: datos.codigoPostal ?? '',
    colonia: datos.colonia ?? '',
    municipio: datos.municipio ?? '',
    estado: datos.estado ?? '',
    ciudad: datos.ciudad ?? undefined,
    calle: datos.calle ?? '',
    numeroExterior: datos.numeroExterior ?? '',
    numeroInterior: datos.numeroInterior,
    aniosViviendo: datos.aniosViviendo!,
    tipoVivienda: datos.tipoVivienda!,
    // Paso 1 (UI) — préstamo (schema paso2)
    montoSolicitado: datos.montoSolicitado!,
    plazoMeses: datos.plazoMeses!,
    destinoPrestamo: datos.destinoPrestamo!,
    // Paso 4 (UI) — economía (schema paso4)
    tipoActividad: datos.tipoActividad!,
    nombreEmpleadorNegocio: datos.nombreEmpleadorNegocio ?? '',
    antiguedad: datos.antiguedad!,
    estadoCivil: datos.estadoCivil!,
    dependientesEconomicos: datos.dependientesEconomicos!,
    ingresoMensual: datos.ingresoMensual!,
    tieneDeudas: datos.tieneDeudas!,
    cantidadDeudas: datos.cantidadDeudas,
    montoTotalDeudas: datos.montoTotalDeudas,
    pagoMensualDeudas: datos.pagoMensualDeudas,
    // Paso 5 (UI) — referencias (schema paso5)
    ref1Nombre: datos.ref1Nombre ?? '',
    ref1Telefono: datos.ref1Telefono ?? '',
    ref1Relacion: datos.ref1Relacion!,
    ref1Email: datos.ref1Email,
    ref2Nombre: datos.ref2Nombre ?? '',
    ref2Telefono: datos.ref2Telefono ?? '',
    ref2Relacion: datos.ref2Relacion!,
    ref2Email: datos.ref2Email,
    // Paso 6 (UI) — documentos (schema paso6)
    sessionUuid,
    tipoIdentificacion,
    archivosDeclarados: archivosSubidos.map((a) => ({
      tipoArchivo: a.tipoArchivo,
      nombreOriginal: a.nombreOriginal,
      mimeType: aMimePermitido(a.mimeType),
      tamanoBytes: a.tamanoBytes,
    })),
    // Paso 7 (UI) — consentimientos (schema paso7)
    aceptaPrivacidad: paso7Data.aceptaPrivacidad,
    aceptaTerminos: paso7Data.aceptaTerminos,
  }
}
