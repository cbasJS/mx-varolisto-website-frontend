# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

- `pnpm dev` — Servidor de desarrollo en http://localhost:3000
- `pnpm build` — Build de producción
- `pnpm lint` — ESLint vía Next.js

No hay framework de pruebas configurado.

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
│   ├── solicitud/        — schemas.ts, generarFolio.ts, buildPayload.ts
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
    ├── colonias/         — coloniaRepository.ts (fetch a /api/colonias)
    ├── storage/          — formatBytes.ts
    ├── persistence/      — solicitudStore.ts (Zustand), submittingContext.tsx
    ├── config/           — appConfig.ts (URLs/marca), env.ts (server-only)
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
  - `FormUI.tsx` — StepTitle, FieldError, FormActions reutilizables
  - `PantallaExito.tsx` — pantalla post-envío con folio generado
  - `pasos/` — un componente por paso (Paso1–Paso7)
- `components/ui/` — Componentes shadcn/radix (button, input, slider, checkbox, etc.)
- `content/` — Datos y copy de la UI: `home.ts` (landing), `nav.ts` (navegación y footer)
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
- `types/index.ts` — Interfaces de UI compartidas (BenefitItem, ProcessStep, TestimonialItem, etc.)

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

### Estilos
- Colores de marca: `primary #000666` (azul marino), `secondary #2ECC71` (verde)
- Variables CSS de fuentes: `--font-manrope` (titulares), `--font-inter` (cuerpo)
- Tokens extendidos en `tailwind.config.ts` (sistema Material Design 3: primary-fixed, on-primary, surface variants, etc.)
- Animaciones CSS en `app/globals.css`: `cta-spotlight`, `step-glow`, `badge-bob`
- Dark mode por clase (`dark:`), no hay toggle activo

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
