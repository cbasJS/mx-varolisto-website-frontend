Contexto del proyecto:
Estás trabajando en varolisto.mx, una plataforma de microcréditos personales en México.
Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Zustand, TanStack Query, react-dropzone.
Todos los componentes de shadcn/ui ya están instalados en components/ui/.

Tarea: Construir el formulario de solicitud de crédito en /app/solicitar/page.tsx.
Es un formulario multi-paso de 6 pasos. Sin login. Sin backend todavía — el submit por ahora solo hace console.log del payload completo.

────────────────────────────────────────

1. ESTRUCTURA DE ARCHIVOS A CREAR
   ────────────────────────────────────────

app/solicitar/
page.tsx ← página principal, renderiza <FormularioSolicitud />

components/solicitar/
FormularioSolicitud.tsx ← orquestador: maneja paso actual, barra de progreso, navegación
BarraPasos.tsx ← indicador visual de progreso (6 pasos)
pasos/
Paso1DatosPersonales.tsx
Paso2Solicitud.tsx
Paso3SituacionEconomica.tsx
Paso4Referencias.tsx
Paso5Documentos.tsx
Paso6Revision.tsx
PantallaExito.tsx ← se muestra tras el submit, muestra el folio generado

lib/
solicitud-schema.ts ← schemas Zod por paso + schema completo
solicitud-store.ts ← store Zustand con persist en sessionStorage
clabe-validator.ts ← función pura de validación de CLABE
generar-folio.ts ← genera folio formato VL-AAAAMM-XXXX

──────────────────────────────────────── 2. TIPOS Y SCHEMA ZOD (lib/solicitud-schema.ts)
────────────────────────────────────────

Define un schema Zod separado por paso. Luego combínalos en solicitudSchema completo.
Infiere el tipo TypeScript de cada schema con z.infer<>.

paso1Schema campos:

- nombre: string, min 2
- apellidoPaterno: string, min 2
- apellidoMaterno: string, min 2
- sexo: enum ["M", "F", "ND"]
- fechaNacimiento: string (formato YYYY-MM-DD), validar edad >= 18
- curp: string, exactamente 18 caracteres, uppercase, regex /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/
- telefono: string, exactamente 10 dígitos numéricos
- codigoPostal: string, exactamente 5 dígitos
- colonia: string, min 1
- municipio: string, min 2
- calle: string, min 2
- numeroExterior: string, min 1
- numeroInterior: string opcional

paso2Schema campos:

- montoSolicitado: number, min 2000, max 20000
- plazoMeses: enum ["2","3","4","5","6"]
- primerCredito: enum ["si","no"]
- destinoPrestamo: enum con valores:
  "liquidar_deuda" (score V8: 5)
  "capital_trabajo" (score V8: 5)
  "gasto_medico" (score V8: 5)
  "equipo_trabajo" (score V8: 5)
  "mejora_hogar" (score V8: 5)
  "educacion" (score V8: 2)
  "gasto_familiar" (score V8: 2)
  "viaje_evento" (score V8: 2)
  "otro" (score V8: 0)
- destinoOtro: string opcional, requerido solo cuando destinoPrestamo === "otro"

paso3Schema campos:

- tipoActividad: enum [
  "empleado_formal", ← CFDI nómina
  "empleado_informal", ← sin contrato
  "negocio_propio", ← dueño de negocio
  "independiente", ← freelance / honorarios
  "otro"
  ]
- nombreEmpleadorNegocio: string, min 2
- antiguedad: enum ["menos_1", "uno_a_dos", "mas_2"] → mapea a V6: 2/6/10 pts
- ingresoMensual: number, min 1000
- tieneDeudas: enum ["si","no"]
- cantidadDeudas: enum ["1","2","3_o_mas"] opcional, requerido si tieneDeudas === "si"
- montoTotalDeudas: enum [
  "menos_5k","5k_15k","15k_30k","mas_30k"
  ] opcional, requerido si tieneDeudas === "si"
- pagoMensualDeudas: number opcional, requerido si tieneDeudas === "si"

paso4Schema campos:

- ref1Nombre: string, min 2
- ref1Telefono: string, 10 dígitos
- ref1Relacion: enum ["familiar","trabajo","amigo","otro"]
- ref2Nombre: string, min 2
- ref2Telefono: string, 10 dígitos — validar que != ref1Telefono y != telefono del solicitante (usar refine)
- ref2Relacion: enum ["familiar","trabajo","amigo","otro"]

paso5Schema campos:

- comprobantes: array de File, min 1 archivo, max 5 archivos, cada uno max 10MB, tipos: image/jpeg, image/png, application/pdf
- clabe: string — validar con función validateClabe() de lib/clabe-validator.ts

paso6Schema:

- aceptaPrivacidad: literal(true)
- aceptaTerminos: literal(true)

──────────────────────────────────────── 3. VALIDADOR DE CLABE (lib/clabe-validator.ts)
────────────────────────────────────────

Implementa la función validateClabe(clabe: string): boolean

Algoritmo oficial CLABE:

- Debe tener exactamente 18 dígitos
- Pesos: [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7]
- Multiplicar cada uno de los primeros 17 dígitos por su peso
- Sumar los productos
- Módulo 10 del resultado
- Restar de 10, módulo 10 = dígito de control
- Comparar con el dígito 18 (índice 17)

También exporta la función getBancoFromClabe(clabe: string): string

- Los primeros 3 dígitos son el código de banco
- Retorna el nombre del banco para los códigos más comunes en México:
  "002" → "BBVA", "006" → "Bancomext", "009" → "Banobras",
  "012" → "HSBC", "014" → "Santander", "021" → "HSBC",
  "030" → "Bajío", "032" → "IXE", "036" → "Inbursa",
  "037" → "Banorte", "042" → "Mifel", "044" → "Scotia",
  "058" → "Banregio", "059" → "Invex", "060" → "Bansi",
  "062" → "Afirme", "072" → "Banorte", "102" → "ABN AMRO",
  "103" → "American Express", "106" → "BAMSA", "108" → "Tokyo",
  "110" → "JP Morgan", "112" → "Bansí", "113" → "Vel'sGus",
  "116" → "ING", "124" → "Deutsche", "126" → "Credit Suisse",
  "127" → "Azteca", "128" → "Autofin", "129" → "Barclays",
  "130" → "Compartamos", "131" → "Ahorro Famsa", "132" → "Multiva",
  "133" → "Actinver", "134" → "Walmart", "135" → "Nafin",
  "136" → "Interbanco", "137" → "Bancoppel", "138" → "ABC Capital",
  "139" → "UBS Bank", "140" → "Consubanco", "141" → "Volkswagen",
  "143" → "CIBanco", "145" → "Bbase", "147" → "Banxico",
  "148" → "Agromercantil", "149" → "HDI Seguros", "150" → "Where",
  "155" → "ICBC", "156" → "Sabadell", "166" → "BaBien",
  "168" → "Hipotecaria Federal", "600" → "Monexcb", "601" → "GE Money",
  "602" → "Bamsa", "605" → "Valida", "606" → "HDI Seguros",
  "607" → "Base", "608" → "Fincomún", "610" → "HsBC",
  "611" → "Accendo Banco", "613" → "Multiva Cbolsa", "616" → "Mbankup",
  "617" → "Chedraui", "618" → "FDEAM", "621" → "HSBC",
  "622" → "HSBC", "623" → "Asea", "626" → "CBDEUTSCHE",
  "627" → "Zurichvi", "628" → "Su Casita", "629" → "CBS",
  "630" → "Intercam Banco", "631" → "CI Bolsa", "632" → "Bulltick CB",
  "633" → "Sterling", "636" → "HDI Seguros", "637" → "Order",
  "638" → "Akala", "640" → "CB JP Morgan", "642" → "Reforma",
  "646" → "STP", "648" → "Evercore", "649" → "BBVA Bancomer2",
  "651" → "Seguro B Intercam", "652" → "CRDFMER", "653" → "Kuspit",
  "655" → "Sofiexpress", "656" → "Unagra", "659" → "ASP Integra OPC",
  "670" → "Libertad", "674" → "AXA", "679" → "FND",
  "684" → "Transfer", "685" → "Fondo (FIRA)", "686" → "Invercap",
  "689" → "FDEAM", "699" → "CoDi Valida", "706" → "Arcus",
  "710" → "Telecomunicaciones", "722" → "Mercado Pago",
  "723" → "Cuenca", "728" → "SPIN by OXXO", "730" → "Nvio",
  "732" → "Mercado Pago", "733" → "Covalto", "734" → "Nu México",
  "736" → "Clip MTP", "741" → "Azteca Móvil", "742" → "Pagafácil",
  "743" → "Nubank", "744" → "Spin by OXXO", "745" → "BIMO",
  "746" → "STP", "748" → "Spin", "749" → "BBVA Bancomer",
  "706" → "Arcus", "900" → "CoDi"
  Si no se encuentra: retorna "Banco desconocido"

──────────────────────────────────────── 4. GENERADOR DE FOLIO (lib/generar-folio.ts)
────────────────────────────────────────

Función generateFolio(): string
Formato: VL-AAAAMM-XXXX donde XXXX es un número aleatorio de 4 dígitos con ceros a la izquierda.
Ejemplo: VL-202604-0031
(El número secuencial real vendrá del backend; por ahora usar random 4 dígitos)

──────────────────────────────────────── 5. ZUSTAND STORE (lib/solicitud-store.ts)
────────────────────────────────────────

Store con persist middleware usando sessionStorage.
Nombre del store en sessionStorage: "vl-solicitud"

Estado:

- pasoActual: number (1-6), default 1
- datos: Partial<SolicitudCompleta> (tipo inferido del schema completo), default {}
- comprobantes: nunca persiste en sessionStorage (los File no son serializables)
- timestampInicio: number (Date.now() al iniciar), para metadata de V7

Acciones:

- setPaso(paso: number): void
- guardarPaso(paso: number, datos: Partial<SolicitudCompleta>): void
  → hace merge del objeto existente con los nuevos datos
- resetForm(): void → limpia todo y vuelve a paso 1

──────────────────────────────────────── 6. CP LOOKUP con TanStack Query
────────────────────────────────────────

En Paso1DatosPersonales.tsx, cuando el usuario termina de escribir el CP (5 dígitos):

- Llamar a https://api.copomex.com/query/info_cp/{cp}?type=simplified&token=demo
  (token "demo" funciona para desarrollo, límite 50 requests/día)
- La respuesta tiene: response[].response.municipio, response[].response.estado, response[].response.asentamiento (nombre de colonia)
- Poblar el Select de colonia con todas las colonias del CP
- Auto-poblar municipio (read-only)
- Manejar loading state con skeleton en el Select de colonia
- Manejar error: si el CP no existe, mostrar "Código postal no encontrado"
- Usar useQuery de TanStack Query con queryKey: ['cp', codigoPostal]
- Solo ejecutar la query cuando codigoPostal.length === 5

──────────────────────────────────────── 7. COMPONENTE ORQUESTADOR (FormularioSolicitud.tsx)
────────────────────────────────────────

- Lee pasoActual del store de Zustand
- Renderiza BarraPasos con el paso actual
- Renderiza el componente del paso correspondiente
- Pasa funciones onNext y onBack a cada paso
- onNext(datos): guarda datos en store, avanza paso
- onBack(): retrocede paso
- En paso 6, al submit: llama generateFolio(), construye payload completo, console.log(payload), muestra PantallaExito con el folio

──────────────────────────────────────── 8. BARRA DE PASOS (BarraPasos.tsx)
────────────────────────────────────────

Muestra 6 pasos en línea horizontal.
Cada paso: círculo numerado + etiqueta corta debajo.
Estados: completado (check + color verde VaroListo #2ECC71), actual (relleno navy #000666), pendiente (gris).
Etiquetas: "Datos", "Solicitud", "Economía", "Referencias", "Documentos", "Revisión"
En móvil: mostrar solo el número del paso actual y el total ("Paso 2 de 6") con una barra de progreso lineal debajo.

──────────────────────────────────────── 9. LÓGICA DE CADA PASO
────────────────────────────────────────

Cada paso sigue este patrón:

const PasoX = ({ onNext, onBack }) => {
const datos = useSolicitudStore(s => s.datos)
const { register, handleSubmit, control, formState } = useForm({
resolver: zodResolver(pasoXSchema),
defaultValues: datos // hidrata con lo guardado en el store
})
const onSubmit = (data) => onNext(data)
return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}

PASO 1 — Datos personales:

- Sección "Nombre": 3 inputs en fila (nombre, ap. paterno, ap. materno)
- Sección "Datos": sexo (RadioGroup: Hombre / Mujer / Prefiero no decir), fecha nacimiento, CURP (uppercase automático al escribir), teléfono
- Sección "Dirección": CP (dispara query), colonia (Select poblado por query, disabled hasta tener CP válido), municipio (Input read-only), calle, número exterior, número interior (opcional)

PASO 2 — Solicitud:

- Slider para monto ($2,000–$20,000, step $500). Mostrar monto seleccionado en grande arriba del slider.
- Select para plazo (2/3/4/5/6 meses)
- RadioGroup "¿Es tu primer crédito con VaroListo?" (Sí / No)
- Select para destino. Opciones agrupadas visualmente:
  Grupo "Lógica económica clara": Liquidar una deuda cara, Capital de trabajo / inventario, Gasto médico o dental, Equipo o herramienta de trabajo, Reparación o mejora del hogar
  Grupo "Gasto personal": Educación, Gasto familiar urgente, Viaje o evento personal
  Grupo "Otro": Otro — ¿cuál?
- Si destinoPrestamo === "otro": mostrar Input de texto adicional (requerido)
- Mostrar estimación de cuota: (monto × tasa_efectiva_B) con sistema francés como referencia. Tasa efectiva Perfil B primer crédito = 8.12% mensual. Aclarar: "Estimación referencial. La cuota final depende de tu evaluación."

PASO 3 — Situación económica:

- Select tipoActividad con las 5 opciones
- Input nombreEmpleadorNegocio (label cambia según tipoActividad: "Empresa" si empleado, "Nombre de tu negocio" si negocio_propio)
- Select antigüedad: "Menos de 1 año", "Entre 1 y 2 años", "Más de 2 años"
- Input ingresoMensual con prefijo "$" y sufijo "MXN"
- Divider "Deudas actuales"
- RadioGroup tieneDeudas (Sí / No)
- Si tieneDeudas === "si": mostrar condicionalmente:
  RadioGroup cantidadDeudas (1 / 2 / 3 o más)
  Select montoTotalDeudas ($1K–$5K / $5K–$15K / $15K–$30K / Más de $30K)
  Input pagoMensualDeudas con prefijo "$"

PASO 4 — Referencias:

- Aviso informativo arriba: "Contactaremos a estas personas para confirmar tu solicitud. Asegúrate de avisarles."
- Sección Referencia 1: nombre, teléfono, Select relación
- Sección Referencia 2: nombre, teléfono, Select relación
- Validación cross-field: ref2Telefono !== ref1Telefono

PASO 5 — Documentos:

- Zona de dropzone para comprobantes. Copy condicional según tipoActividad guardado en store:
  Si empleado_formal: "Sube tu CFDI de nómina más reciente, o al menos 2 recibos de nómina o estados de cuenta de los últimos 3 meses."
  Si negocio_propio o empleado_informal: "Sube al menos 2 estados de cuenta con depósitos de los últimos 3 meses. También puedes incluir recibos de proveedores o fotos de tu negocio o inventario."
  Si independiente: "Sube tus estados de cuenta de los últimos 3 meses o comprobantes de depósitos por honorarios."
  Default: "Sube al menos 2 documentos que muestren tus ingresos de los últimos 3 meses."
- Mostrar lista de archivos seleccionados con nombre, tamaño y botón para eliminar
- Formatos: JPG, PNG, PDF. Máx 10MB por archivo. Máx 5 archivos.
- Input CLABE (18 dígitos). Al completar los 18 dígitos:
  Validar con validateClabe(). Si válida: mostrar nombre del banco con getBancoFromClabe() en verde.
  Si inválida: mostrar error "CLABE inválida. Verifica que no sea el número de tu tarjeta."

PASO 6 — Revisión:

- Mostrar resumen de todos los datos en secciones colapsables (acordeón) o en cards de solo lectura
- Cada sección tiene un botón "Editar" que lleva de regreso al paso correspondiente
- Dos checkboxes requeridos: Aviso de Privacidad (con link) y Términos y Condiciones (con link)
- Botón submit: "Enviar solicitud"

──────────────────────────────────────── 10. PANTALLA DE ÉXITO (PantallaExito.tsx)
────────────────────────────────────────

Mostrar tras el submit exitoso:

- Folio generado en grande: VL-202604-XXXX
- Mensaje: "Recibimos tu solicitud. Te contactaremos por WhatsApp al [teléfono] en un máximo de 24 horas hábiles."
- Instrucción: "Guarda tu folio — lo necesitarás para cualquier consulta."
- Limpiar el store de Zustand al montar este componente

──────────────────────────────────────── 11. COLORES Y ESTILOS
────────────────────────────────────────

Paleta VaroListo:

- Navy principal: #000666
- Verde acento: #2ECC71
- Usar estas variables como clases Tailwind custom o inline donde sea necesario.

El formulario debe funcionar correctamente en móvil (la mayoría de usuarios accederá desde un teléfono).
Usar Tailwind responsive prefixes donde sea necesario.

──────────────────────────────────────── 12. LO QUE NO DEBES IMPLEMENTAR TODAVÍA
────────────────────────────────────────

- Integración con Supabase (backend pendiente)
- Subida real de archivos (los File objects solo se guardan en memoria)
- Autenticación de ningún tipo
- Panel del operador
- Envío de WhatsApp
- El folio final secuencial (usar random por ahora)

──────────────────────────────────────── 13. ORDEN DE IMPLEMENTACIÓN SUGERIDO
────────────────────────────────────────

1. lib/clabe-validator.ts
2. lib/generar-folio.ts
3. lib/solicitud-schema.ts
4. lib/solicitud-store.ts
5. components/solicitar/BarraPasos.tsx
6. components/solicitar/pasos/Paso1DatosPersonales.tsx
7. components/solicitar/pasos/Paso2Solicitud.tsx
8. components/solicitar/pasos/Paso3SituacionEconomica.tsx
9. components/solicitar/pasos/Paso4Referencias.tsx
10. components/solicitar/pasos/Paso5Documentos.tsx
11. components/solicitar/pasos/Paso6Revision.tsx
12. components/solicitar/PantallaExito.tsx
13. components/solicitar/FormularioSolicitud.tsx
14. app/solicitar/page.tsx
