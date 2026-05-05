# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Puertos reservados — no tocar

Los puertos **3000** y **4000** están reservados para los servicios principales del stack VaroListo:

- **3000** — Frontend Next.js (`pnpm dev` de este repo)
- **4000** — Backend Fastify (`mx-varolisto-api-backend`)

**Regla obligatoria para cualquier proceso auxiliar que arranques** (Playwright UI, Storybook, dev server temporal, MCP server, script de prueba, lo que sea): **usa un puerto ≥ 5000**. Sugeridos: `5173` (Vite default), `5555`, `6006`, `8080`, `9222` (Chrome DevTools).

**Por qué importa:** Cuando un proceso auxiliar toma 3000 o 4000, el frontend o el backend dejan de responder y el usuario tiene que matar el puerto manualmente para volver a levantarlos. Esto rompe el flujo de desarrollo.

**Cómo aplicarlo en comandos comunes:**

- `playwright test --ui --ui-port=5174`
- `next dev -p 5000` (si necesitas un segundo Next)
- `vitest --ui --api.port=5175`
- `python -m http.server 8000` (en vez de default 8000 ya está fuera, ok)

Si una herramienta no permite cambiar el puerto, **no la arranques** sin avisar al usuario primero.

## TDD — Requisito obligatorio

**Ningún código de producción se escribe sin un test que falle primero.**

Antes de implementar cualquier función, caso de uso, hook o utilidad nueva:

1. Escribe el test. Ejecútalo. Confirma que falla por la razón correcta (feature ausente, no un error de sintaxis).
2. Escribe el mínimo código necesario para que pase.
3. Refactoriza si es necesario. Los tests deben seguir en verde.

Para código existente sin tests (bug fix, refactor): escribe primero el test que reproduce el bug o que describe el comportamiento esperado, luego modifica el código.

Lo mismo aplica para E2E: antes de implementar o modificar un flujo de usuario, el test E2E que cubre ese flujo debe existir y fallar primero. Los tests E2E cubren caminos críticos del usuario (flujo completo de solicitud, errores de backend, guardias de navegación) — no reemplazan los unitarios.

`pnpm test` y `pnpm test:e2e` deben pasar en verde antes de cualquier commit.

Los fixtures y valores de prueba deben reflejar datos reales del negocio: CPs de México que existen (ej. `06600` = Col. Juárez, Cuauhtémoc, CDMX), nombres de estados y municipios en su forma oficial, montos dentro del rango del producto ($2,000–$20,000), plazos válidos (2–6 meses), CURPs con formato real. No usar placeholders genéricos (`"06000"`, `"CDMX"`, `"test-colonia"`). Los tests existentes en `buildPayload.test.ts` son la referencia de estilo y datos.

## Comandos

- `pnpm dev` — Servidor de desarrollo en http://localhost:3000
- `pnpm build` — Build de producción
- `pnpm lint` — ESLint vía Next.js
- `pnpm test` — Pruebas unitarias (Vitest, una sola corrida)
- `pnpm test:watch` — Vitest en modo watch
- `pnpm test:e2e` — Pruebas E2E (Playwright, requiere servidor activo o usa `webServer`)

## Arquitectura

### Stack

- Next.js 15 App Router (TypeScript estricto)
- Tailwind CSS con sistema de tokens extendido (Material Design 3)
- Framer Motion para animaciones
- shadcn/ui (estilo `radix-nova`) para componentes base
- Zustand — store del formulario de solicitud (persistido en sessionStorage)
- react-hook-form + Zod — validación del formulario de solicitud
- @tanstack/react-query — fetching de datos (colonias, etc.)
- @varolisto/shared-schemas — schemas Zod compartidos, instalado desde GitHub Packages; Zod debe permanecer en el proyecto

### Clean Architecture

El dominio del formulario de solicitud sigue Clean Architecture con 3 capas bajo `lib/solicitud/`:

```
lib/solicitud/
├── domain/               — Reglas de negocio puras (sin deps de React ni HTTP)
│   ├── loan/             — calcularCuota.ts (fórmula de amortización)
│   ├── enums/            — labelMaps.ts (labels y meta de enums)
│   ├── solicitud/        — schemas.ts, generarFolio.ts, buildPayload.ts, documentosConfig.ts
│   ├── shared/           — dateUtils.ts
│   └── index.ts          — barrel de toda la capa
│
├── application/          — Casos de uso (orquestación sin estado de React)
│   ├── useCases/
│   │   ├── submitSolicitud.ts   — POST /api/solicitudes + clasificarError()
│   │   ├── guardarPaso.ts       — persistir datos + avanzar paso
│   │   └── hidratarArchivos.ts  — GET staging + mapeo a ArchivoSubido[]
│   └── index.ts          — barrel de toda la capa
│
└── infrastructure/       — HTTP, storage, persistencia (detalles técnicos)
    ├── http/             — apiClient.ts, apiErrors.ts
    ├── colonias/         — coloniaRepository.ts (fetch a /api/colonias); exporta ColoniaNotFoundError y ColoniaServiceError
    ├── storage/          — formatBytes.ts
    ├── persistence/      — solicitudStore.ts (Zustand), submittingContext.tsx
    ├── config/           — appConfig.ts (URLs/marca/constantes), apiConfig.ts (URLs base + endpoints por ambiente), env.ts (server-only)
    └── index.ts          — barrel de toda la capa
```

**Regla de dependencias:** domain no importa de application ni infrastructure. application importa de domain e infrastructure. Los hooks de React (UI layer) importan de application.

**Compatibilidad:** los paths originales (`lib/solicitud/store`, `lib/api`, `lib/config`, `lib/env`, `lib/solicitud/utils/*`) son re-export barrels — todos los imports existentes siguen funcionando.

### Estructura de directorios

- `app/` — Páginas y layout raíz. El layout carga fuentes (Manrope, Inter) y metadatos.
- `app/solicitar/` — Ruta del formulario de solicitud de crédito
- `app/api/colonias/` — API Route que consulta colonias por código postal (Copomex); usa `lib/solicitud/infrastructure/config/env.ts` server-only para el token
- `components/layout/` — Navbar, Footer, BottomNav, ScrollRestorationClient
- `components/sections/` — Secciones de la landing page (Hero, Benefits, HowItWorks, etc.)
- `components/solicitar/` — Formulario completo de solicitud:
  - `FormularioSolicitud.tsx` — orquestador, renderiza el paso activo condicionalmente
  - `BarraPasos.tsx` — indicador de progreso (barra mobile / pills desktop)
  - Primitivas de UI: `FloatingInput`, `PillOption`, `DatePickerInput`, `StepTitle`, `FormActions`, `FieldError`, `InfoBanner`, `SectionDivider`, etc. — un archivo por componente
  - `PantallaExito.tsx` — pantalla post-envío con folio generado
  - `pasos/` — un componente por paso (Paso1–Paso7)
- `components/ui/` — Componentes shadcn/radix (button, input, slider, checkbox, etc.)
- `content/` — Capa de datos estáticos de UI (copy, links, configuración de secciones de la landing). Sin lógica ni dependencias externas. Las interfaces de cada archivo se definen junto a sus datos en el mismo archivo. Si la landing requiriera internacionalización o un CMS, esta capa migraría a `lib/landing/domain/`.
- `hooks/solicitar/` — Hooks del formulario (UI layer):
  - `useSolicitudNavigation.ts` — coordinador delgado: llama casos de uso de `application/`, maneja estado local de React (`folio`, `enviando`, `errorSubmit`)
  - `usePaso1.ts` … `usePaso7.ts` — form controllers con react-hook-form + Zod
  - `useAutoSave.ts` — auto-guardado al store (debounced)
  - `useUploadArchivo.ts` — máquina de estados de uploads (pending/uploading/uploaded/failed/deleting)
  - `useNavegacionConGuarda.ts` — intercepta navegación cuando hay datos/archivos sin guardar
  - `useBeforeUnloadCleanup.ts` — sendBeacon para limpiar staging al cerrar pestaña
- `hooks/` — Hooks globales: `useScrolled`, `useScrollRestoration`
- `lib/solicitud/store.ts` — re-export barrel → `infrastructure/persistence/solicitudStore.ts`
- `lib/solicitud/schemas/index.ts` — re-export barrel → `domain/solicitud/schemas.ts`
- `lib/solicitud/utils/` — re-export barrels hacia domain/ e infrastructure/ (compatibilidad)
- `lib/config.ts` — re-export barrel → `infrastructure/config/appConfig.ts`
- `lib/env.ts` — re-export barrel → `infrastructure/config/env.ts`. **Nunca importar desde componentes `"use client"`.**
- `lib/generar-folio.ts` — re-export barrel → `domain/solicitud/generarFolio.ts`
- `lib/api/` — re-export barrels → `infrastructure/http/`
- `lib/animations.ts` — Variantes de Framer Motion (`staggerContainer`, `fadeUpVariant`, `fadeInVariant`, `VIEWPORT_ONCE`, `VIEWPORT_CLOSE`)
- `lib/utils.ts` — Helper `cn()` para classnames (clsx + tailwind-merge)
- `hooks/useMobile.ts` — Hook global para detectar viewport mobile (< 768px)

### Rutas

- `/` — Landing page; `app/page.tsx` compone las secciones secuencialmente
- `/solicitar` — Formulario de solicitud de crédito (7 pasos)
- `/terminos-condiciones` — Términos y condiciones
- `/aviso-de-privacidad-integral` — Aviso de privacidad

### Flujo del formulario de solicitud

El estado vive en Zustand (`infrastructure/persistence/solicitudStore.ts`) persistido en sessionStorage. `useSolicitudNavigation` coordina navegación y llama al caso de uso `submitSolicitud` para el envío. Cada paso usa su propio hook (`usePasoN`) que envuelve react-hook-form con el schema Zod correspondiente.

Todos los cambios de paso (next, back, editar, submit) llaman `scrollTop()` para llevar la vista al inicio del formulario.

El store expone `_hasHydrated` (seteado por `onRehydrateStorage`); úsalo para evitar renderizar el formulario antes de que sessionStorage hidrate el estado.

`buildPayload` en `domain/solicitud/buildPayload.ts` transforma el estado del store en el `CrearSolicitudRequest` del backend. Es una función pura — testeable sin React.

### Variables de entorno

- `COPOMEX_TOKEN` — Token de Copomex (requerido en server-side). En desarrollo: `.env.local`. En producción: Vercel dashboard.
- `COPOMEX_BASE_URL` — (opcional) URL base de Copomex; default a `https://api.copomex.com/query`.
- `NEXT_PUBLIC_ENV` — Ambiente activo: `local` | `sandbox` | `production`. Si no se define, se infiere desde `NODE_ENV`. Controla las URLs base de la API en `infrastructure/config/apiConfig.ts`.

### Estilos

- Colores de marca: `primary #000666` (azul marino), `secondary #2ECC71` (verde)
- Variables CSS de fuentes: `--font-manrope` (titulares), `--font-inter` (cuerpo)
- Tokens extendidos en `tailwind.config.ts` (sistema Material Design 3: primary-fixed, on-primary, surface variants, etc.)
- Animaciones CSS en `app/globals.css`: `cta-spotlight`, `step-glow`, `badge-bob`
- Dark mode por clase (`dark:`), no hay toggle activo

### Centralización de constantes

Cualquier literal numérico o expresión regular que aparezca más de una vez en el repo debe extraerse a una constante nombrada. La ubicación depende de la capa Clean Architecture:

| Ubicación                                          | Tipo de constante                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------- |
| `lib/solicitud/domain/constants.ts`                | Reglas de negocio puras: edades límite, rangos del producto, conteos mínimos |
| `lib/solicitud/infrastructure/http/apiClient.ts`   | Timeouts HTTP (`DEFAULT_TIMEOUT_MS`, `SHORT_TIMEOUT_MS`)                     |
| `lib/solicitud/infrastructure/config/appConfig.ts` | Configuración de app: `COLONIAS_STALE_TIME_MS`, etc.                         |

**Regla**: si un número o regex aparece más de una vez, va en la constante de su capa. Si cambia una regla de negocio (ej. la edad mínima baja a 17), se edita en un solo lugar.

```typescript
// ❌ MAL — magic number repetido en el hook
const maxDate = new Date()
maxDate.setFullYear(maxDate.getFullYear() - 18)

// ✅ BIEN — constante nombrada importada de la capa de dominio
import { EDAD_MINIMA_ANIOS } from '@/lib/solicitud/domain/constants'
const maxDate = new Date()
maxDate.setFullYear(maxDate.getFullYear() - EDAD_MINIMA_ANIOS)

// ❌ MAL — timeout hardcodeado en casos de uso
await apiPost(route, payload, { timeoutMs: 30_000 })

// ✅ BIEN — constante exportada del cliente HTTP
import { DEFAULT_TIMEOUT_MS } from '@/lib/solicitud/infrastructure/http/apiClient'
await apiPost(route, payload, { timeoutMs: DEFAULT_TIMEOUT_MS })

// ❌ MAL — label duplicado en mapa plano y meta object
export const DESTINO_LABELS = { liquidar_deuda: 'Liquidar una deuda', ... }
export const DESTINOS_META  = { liquidar_deuda: { label: 'Liquidar una deuda', icono: '...' }, ... }

// ✅ BIEN — label derivado del meta object (fuente única de verdad)
export const DESTINO_LABELS = Object.fromEntries(
  Object.entries(DESTINOS_META).map(([k, v]) => [k, v.label])
) as Record<DestinoPrestamo, string>
```

### Patrones de componentes

- Los componentes interactivos usan la directiva `"use client"`
- Animaciones con Framer Motion: patrón container/stagger con `whileInView` para scroll-trigger
- Alias de path `@/*` apunta a la raíz del repo (ej. `import { config } from "@/lib/config"`); no hay alias `@/ui` en tsconfig — usar `@/components/ui/`

### Integraciones externas

- URLs externas viven en `lib/config.ts`
- `@varolisto/shared-schemas` se instala desde GitHub Packages; requiere `.npmrc` con token de autenticación:
  ```
  @varolisto:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=TOKEN
  ```

## Pruebas

### Unitarias — Vitest (`lib/`)

Correr con `pnpm test`. Los archivos de prueba viven junto al código fuente (`*.test.ts`).

Archivos cubiertos:

| Archivo                                                    | Qué prueba                                                                 |
| ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| `lib/solicitud/domain/loan/calcularCuota.test.ts`          | Fórmula de amortización para los plazos del producto (2–6 meses)           |
| `lib/solicitud/domain/shared/dateUtils.test.ts`            | Conversión y formateo de fechas                                            |
| `lib/solicitud/domain/solicitud/buildPayload.test.ts`      | Transformación del store a `CrearSolicitudRequest`                         |
| `lib/solicitud/infrastructure/storage/formatBytes.test.ts` | Formateo de tamaños de archivo (B / KB / MB)                               |
| `lib/solicitud/infrastructure/http/apiErrors.test.ts`      | `ApiError`, `esErrorDeValidacion`, `esErrorDeConflicto`, `clasificarError` |
| `lib/solicitud/utils/formatCurrency.test.ts`               | Formateo de moneda en Paso 4 (ingreso, deudas)                             |

### E2E — Playwright (`e2e/`)

Correr con `pnpm test:e2e`. El `webServer` de `playwright.config.ts` levanta Next.js automáticamente.

| Archivo                   | Qué cubre                                                                                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/flujo-feliz.spec.ts` | Submit exitoso → `PantallaExito` con folio; estado "Enviando…"; errores 409 y de red; validación de checkboxes                                                                                        |
| `e2e/formulario.spec.ts`  | Estructura de cada paso; uploads (subida, eliminación, reintentos, hidratación de staging); `useNavegacionConGuarda` (AlertDialog con archivos/datos/submit en vuelo); `sendBeacon` al cerrar pestaña |

**Estrategia:** los tests inyectan el store en `sessionStorage` directamente (`inyectarStore`) en lugar de navegar paso a paso por la UI. Esto evita dependencias frágiles del `DatePickerInput` y llamadas reales a APIs externas (COPOMEX, uploads).
