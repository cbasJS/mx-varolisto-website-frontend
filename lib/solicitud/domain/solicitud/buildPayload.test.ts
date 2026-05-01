import { describe, it, expect } from "vitest"
import { buildPayload, type BuildPayloadInput } from "./buildPayload"

// Datos representativos de un solicitante real:
// - empleado formal, $10,000 a 6 meses para capital de trabajo
// - vive en CDMX, 18-30 años en la misma dirección
const inputBase: BuildPayloadInput = {
  sessionUuid: "test-uuid-1234",
  tipoIdentificacion: "ine",
  archivosSubidos: [],
  paso7Data: {
    aceptaPrivacidad: true,
    aceptaTerminos: true,
  },
  datos: {
    // identidad (schema paso1)
    nombre: "Juan",
    apellidoPaterno: "García",
    apellidoMaterno: "López",
    sexo: "M",
    fechaNacimiento: "1995-06-15",
    curp: "GALJ950615HDFRCN01",
    email: "juan.garcia@example.com",
    telefono: "5512345678",
    // domicilio (schema paso3) — CP real de Col. Juárez, CDMX
    codigoPostal: "06600",
    colonia: "Juárez",
    municipio: "Cuauhtémoc",
    estado: "Ciudad de México",
    calle: "Av. Insurgentes Norte",
    numeroExterior: "123",
    aniosViviendo: "entre_1_y_2",
    tipoVivienda: "rentada",
    // préstamo (schema paso2) — monto y plazo dentro del rango $2,000–$20,000 / 2–6 meses
    montoSolicitado: 10000,
    plazoMeses: "6",
    destinoPrestamo: "capital_trabajo",
    // economía (schema paso4)
    tipoActividad: "empleado_formal",
    nombreEmpleadorNegocio: "Empresa SA de CV",
    antiguedad: "mas_2",
    estadoCivil: "soltero",
    dependientesEconomicos: "ninguno",
    ingresoMensual: 15000,
    tieneDeudas: "no",
    // referencias (schema paso5)
    ref1Nombre: "María Pérez",
    ref1Telefono: "5598765432",
    ref1Relacion: "familiar",
    ref2Nombre: "Carlos Ruiz",
    ref2Telefono: "5511112222",
    ref2Relacion: "amigo",
  },
}

describe("buildPayload", () => {
  it("mapea los datos de identidad correctamente", () => {
    const payload = buildPayload(inputBase)
    expect(payload.nombre).toBe("Juan")
    expect(payload.apellidoPaterno).toBe("García")
    expect(payload.apellidoMaterno).toBe("López")
    expect(payload.sexo).toBe("M")
    expect(payload.fechaNacimiento).toBe("1995-06-15")
    expect(payload.curp).toBe("GALJ950615HDFRCN01")
    expect(payload.email).toBe("juan.garcia@example.com")
    expect(payload.telefono).toBe("5512345678")
  })

  it("mapea los datos del préstamo con valores dentro del rango del producto", () => {
    const payload = buildPayload(inputBase)
    expect(payload.montoSolicitado).toBe(10000)   // $2,000–$20,000
    expect(payload.plazoMeses).toBe("6")           // "2"|"3"|"4"|"5"|"6"
    expect(payload.destinoPrestamo).toBe("capital_trabajo")
  })

  it("mapea la situación económica con enums reales", () => {
    const payload = buildPayload(inputBase)
    expect(payload.tipoActividad).toBe("empleado_formal")
    expect(payload.antiguedad).toBe("mas_2")
    expect(payload.estadoCivil).toBe("soltero")
    expect(payload.dependientesEconomicos).toBe("ninguno")
    expect(payload.tieneDeudas).toBe("no")
    expect(payload.ingresoMensual).toBe(15000)     // mínimo $1,000 según schema
  })

  it("mapea las referencias con relaciones válidas", () => {
    const payload = buildPayload(inputBase)
    expect(payload.ref1Relacion).toBe("familiar")  // "familiar"|"trabajo"|"amigo"|"otro"
    expect(payload.ref2Relacion).toBe("amigo")
  })

  it("incluye sessionUuid y tipoIdentificacion", () => {
    const payload = buildPayload(inputBase)
    expect(payload.sessionUuid).toBe("test-uuid-1234")
    expect(payload.tipoIdentificacion).toBe("ine") // "ine"|"pasaporte"
  })

  it("incluye los consentimientos del paso 7", () => {
    const payload = buildPayload(inputBase)
    expect(payload.aceptaPrivacidad).toBe(true)
    expect(payload.aceptaTerminos).toBe(true)
  })

  it("mapea archivosSubidos a archivosDeclarados con tipos de archivo reales", () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      archivosSubidos: [
        {
          clienteId: "cliente-1",
          tipoArchivo: "ine_frente",           // tipo real del enum TIPO_ARCHIVO
          nombreOriginal: "ine_frente.jpg",
          mimeType: "image/jpeg",
          tamanoBytes: 204800,                 // 200 KB
          storagePath: "staging/test-uuid/ine_frente.jpg",
          archivoId: "archivo-1",
        },
        {
          clienteId: "cliente-2",
          tipoArchivo: "comprobante_domicilio",
          nombreOriginal: "recibo_luz.pdf",
          mimeType: "application/pdf",
          tamanoBytes: 512000,                 // 500 KB
          storagePath: "staging/test-uuid/recibo_luz.pdf",
          archivoId: "archivo-2",
        },
      ],
    }
    const payload = buildPayload(input)
    expect(payload.archivosDeclarados).toHaveLength(2)
    expect(payload.archivosDeclarados[0]).toEqual({
      tipoArchivo: "ine_frente",
      nombreOriginal: "ine_frente.jpg",
      mimeType: "image/jpeg",
      tamanoBytes: 204800,
    })
    expect(payload.archivosDeclarados[1].tipoArchivo).toBe("comprobante_domicilio")
  })

  it("archivosDeclarados no expone clienteId, storagePath ni archivoId al backend", () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      archivosSubidos: [
        {
          clienteId: "cliente-1",
          tipoArchivo: "ine_reverso",
          nombreOriginal: "ine_reverso.jpg",
          mimeType: "image/jpeg",
          tamanoBytes: 180000,
          storagePath: "staging/test-uuid/ine_reverso.jpg",
          archivoId: "archivo-1",
        },
      ],
    }
    const payload = buildPayload(input)
    const archivo = payload.archivosDeclarados[0] as Record<string, unknown>
    expect(archivo["clienteId"]).toBeUndefined()
    expect(archivo["storagePath"]).toBeUndefined()
    expect(archivo["archivoId"]).toBeUndefined()
  })

  it("devuelve array vacío de archivosDeclarados cuando no hay archivos subidos", () => {
    const payload = buildPayload(inputBase)
    expect(payload.archivosDeclarados).toEqual([])
  })

  it("usa string vacío como fallback para campos de texto requeridos ausentes", () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      datos: { ...inputBase.datos, nombre: undefined },
    }
    const payload = buildPayload(input)
    expect(payload.nombre).toBe("")
  })

  it("pasa undefined para rfc y numeroInterior cuando no se proporcionan", () => {
    const payload = buildPayload(inputBase)
    expect(payload.rfc).toBeUndefined()
    expect(payload.numeroInterior).toBeUndefined()
  })

  it("incluye pasaporte como tipoIdentificacion válido", () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      tipoIdentificacion: "pasaporte",
      archivosSubidos: [
        {
          clienteId: "cliente-1",
          tipoArchivo: "pasaporte_principal",
          nombreOriginal: "pasaporte.jpg",
          mimeType: "image/jpeg",
          tamanoBytes: 350000,
          storagePath: "staging/test-uuid/pasaporte.jpg",
          archivoId: "archivo-1",
        },
      ],
    }
    const payload = buildPayload(input)
    expect(payload.tipoIdentificacion).toBe("pasaporte")
    expect(payload.archivosDeclarados[0].tipoArchivo).toBe("pasaporte_principal")
  })
})
