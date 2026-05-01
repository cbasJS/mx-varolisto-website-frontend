# VaroListo.mx — Frontend

Landing page y flujo de solicitud de crédito para **VaroListo**, plataforma de financiamiento personal en México.

## Stack

- **Next.js 15** (App Router, TypeScript estricto)
- **Tailwind CSS** con design tokens Material Design 3
- **Framer Motion** para animaciones
- **shadcn/ui** (`radix-nova`) para componentes base
- **react-hook-form + Zod** — validación del formulario de solicitud
- **Zustand** — estado global del formulario (persistido en sessionStorage)
- **@tanstack/react-query** — fetching de datos (colonias por CP)
- **@varolisto/shared-schemas** — schemas Zod compartidos (NPM privado vía GitHub Packages)

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Landing page |
| `/solicitar` | Formulario de solicitud (7 pasos) |
| `/terminos-condiciones` | Términos y condiciones |
| `/aviso-de-privacidad-integral` | Aviso de privacidad integral |

## Formulario de solicitud (`/solicitar`)

Flujo de 7 pasos con navegación entre ellos y scroll al top en cada transición:

| Paso | Componente | Datos |
|---|---|---|
| 1 | `Paso1Solicitud` | Monto, plazo, destino |
| 2 | `Paso2Identidad` | Nombre, CURP, correo, teléfono, fecha de nacimiento |
| 3 | `Paso3Domicilio` | CP, colonia, ciudad, estado, tipo y antigüedad de vivienda |
| 4 | `Paso4SituacionEconomica` | Actividad, empleador, antigüedad, ingresos, deudas |
| 5 | `Paso5Referencias` | 2 referencias personales |
| 6 | `Paso6Documentos` | Identificación oficial + comprobantes (drag & drop) |
| 7 | `Paso7Revision` | Resumen + consentimientos → envío |

## Arquitectura

El dominio del formulario sigue **Clean Architecture** bajo `lib/solicitud/`:

```
lib/solicitud/
├── domain/          — Reglas de negocio puras (sin deps de React ni HTTP)
├── application/     — Casos de uso (submitSolicitud, guardarPaso, hidratarArchivos)
└── infrastructure/  — HTTP, storage, config, colonias, persistencia
    ├── config/
    │   ├── appConfig.ts   — constantes de marca y URLs internas
    │   ├── apiConfig.ts   — URLs base + endpoints por ambiente (local/sandbox/production)
    │   └── env.ts         — variables server-only (COPOMEX_TOKEN)
    └── colonias/
        └── coloniaRepository.ts  — fetch a /api/colonias; errores tipados (ColoniaNotFoundError, ColoniaServiceError)
```

Los paths legacy (`lib/config`, `lib/api`, `lib/solicitud/store`, `lib/solicitud/utils/*`) son re-export barrels para compatibilidad.

## Estructura de directorios

```
app/
  page.tsx                    # Landing page
  solicitar/                  # Ruta del formulario
  api/colonias/               # API route: consulta colonias por CP (Copomex)
components/
  layout/                     # Navbar, Footer, BottomNav
  sections/                   # Secciones de la landing (Hero, Benefits, etc.)
  solicitar/                  # Formulario completo
    FormularioSolicitud.tsx   # Orquestador principal
    BarraPasos.tsx            # Indicador de progreso
    PantallaExito.tsx         # Pantalla de éxito post-envío
    pasos/                    # Un componente por paso (Paso1–Paso7)
    FloatingInput.tsx         # Primitivas de UI del formulario (un archivo por componente)
    PillOption.tsx
    ...
  ui/                         # Componentes shadcn/radix
content/
  home.ts                     # Copy de la landing
  nav.ts                      # Links de navegación y footer
hooks/
  solicitar/                  # Hooks por paso + navegación
    useSolicitudNavigation.ts # Orquestador: next/back/submit + scroll
    usePaso1.ts … usePaso7.ts # Validación por paso con react-hook-form
    useAutoSave.ts            # Auto-guardado debounced al store
    useUploadArchivo.ts       # Máquina de estados de uploads
    useNavegacionConGuarda.ts # Intercepta navegación con datos sin guardar
    useBeforeUnloadCleanup.ts # sendBeacon para limpiar staging al cerrar pestaña
lib/
  solicitud/
    domain/                   # Schemas, cálculo de cuota, buildPayload, etc.
    application/              # Casos de uso
    infrastructure/           # HTTP, config, colonias, persistencia
  config.ts                   # Re-export barrel → infrastructure/config/appConfig.ts
  animations.ts               # Variantes Framer Motion reutilizables
  utils.ts                    # cn() helper
```

## Configuración

### Variables de entorno

| Variable | Descripción |
|---|---|
| `COPOMEX_TOKEN` | Token de Copomex (server-side). En dev: `.env.local`. En prod: Vercel dashboard. |
| `COPOMEX_BASE_URL` | (Opcional) URL base de Copomex. Default: `https://api.copomex.com/query`. |
| `NEXT_PUBLIC_ENV` | Ambiente: `local` \| `sandbox` \| `production`. Controla las URLs del backend en `apiConfig.ts`. |

### GitHub Packages

El paquete `@varolisto/shared-schemas` se instala desde GitHub Packages. Requiere un `.npmrc` con el token de autenticación:

```
@varolisto:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

## Desarrollo

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Build de producción
pnpm lint         # ESLint
pnpm test         # Pruebas unitarias (Vitest)
pnpm test:e2e     # Pruebas E2E (Playwright)
```

## Pruebas

### Unitarias — Vitest

Los archivos `.test.ts` viven junto al código fuente en `lib/solicitud/`. Cubren las funciones puras del dominio (`calcularCuota`, `buildPayload`, `dateUtils`) y utilidades de infraestructura (`formatBytes`, `apiErrors`/`clasificarError`, `formatCurrency`).

### E2E — Playwright

`e2e/flujo-feliz.spec.ts` — flujo completo Paso 1 → 7 → `PantallaExito`, errores de backend, validación de checkboxes.

`e2e/formulario.spec.ts` — estructura de cada paso, uploads (subida/eliminación/reintentos/hidratación), guardia de navegación con datos o archivos sin guardar, `sendBeacon` al cerrar pestaña.

Los tests inyectan el store en `sessionStorage` directamente para evitar dependencias frágiles del `DatePickerInput` y llamadas reales a APIs externas.

## Diseño

| Token | Valor |
|---|---|
| `primary` | `#000666` — Azul marino |
| `secondary` | `#2ECC71` — Verde vibrante |
| Fuente titular | Manrope |
| Fuente cuerpo | Inter |

Los tokens siguen el sistema Material Design 3 definidos en `tailwind.config.ts`.
