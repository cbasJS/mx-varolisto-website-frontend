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

### Estructura de directorios

- `app/` — Páginas y layout raíz. El layout carga fuentes (Manrope, Inter) y metadatos.
- `app/solicitar/` — Ruta del formulario de solicitud de crédito
- `app/api/colonias/` — API Route que consulta colonias por código postal (Copomex); usa `lib/env.ts` server-only para el token
- `components/layout/` — Navbar, Footer, BottomNav, ScrollRestorationClient
- `components/sections/` — Secciones de la landing page (Hero, Benefits, HowItWorks, etc.)
- `components/solicitar/` — Formulario completo de solicitud:
  - `FormularioSolicitud.tsx` — orquestador, renderiza el paso activo condicionalmente
  - `BarraPasos.tsx` — indicador de progreso (barra mobile / pills desktop)
  - `FormUI.tsx` — StepTitle, FieldError, FormActions reutilizables
  - `PantallaExito.tsx` — pantalla post-envío con folio generado
  - `pasos/` — un componente por paso (Paso1–Paso6)
- `components/ui/` — Componentes shadcn/radix (button, input, slider, checkbox, etc.)
- `content/` — Datos y copy de la UI: `home.ts` (landing), `nav.ts` (navegación y footer)
- `hooks/solicitar/` — Hooks del formulario:
  - `useSolicitudNavigation.ts` — orquestador central: `handleNext`, `handleBack`, `handleEditarPaso`, `handleSubmit`; todos llaman `scrollTop()` al cambiar paso
  - `usePaso1.ts` … `usePaso6.ts` — validación por paso con react-hook-form + Zod
  - `useAutoSave.ts` — auto-guardado al store
- `hooks/` — Hooks globales: `useScrolled`, `useScrollRestoration`
- `lib/solicitud/store.ts` — Zustand store con persistencia en sessionStorage (datos de todos los pasos + paso activo); `comprobantes` (File[]) se excluye de la persistencia
- `lib/solicitud/schemas/index.ts` — re-exports de `@varolisto/shared-schemas`
- `lib/solicitud/utils/` — Helpers: `lookup-labels.ts` (labels de enums desde `@varolisto/shared-schemas/enums`), `calcularCuota.ts`, `fetchColonias.ts`, `formatBytes.ts`, `formatCurrency.ts`, `normalizeRegister.ts`
- `lib/config.ts` — URLs externas (WhatsApp, email) y constantes de marca
- `lib/env.ts` — Configuración server-only de variables de entorno (Copomex token/URL). **Nunca importar desde componentes `"use client"`.**
- `lib/generar-folio.ts` — Genera el folio de solicitud (`VL-YYYYMM-NNNN`)
- `lib/animations.ts` — Variantes de Framer Motion (`staggerContainer`, `fadeUpVariant`, `fadeInVariant`, `VIEWPORT_ONCE`, `VIEWPORT_CLOSE`)
- `lib/utils.ts` — Helper `cn()` para classnames (clsx + tailwind-merge)
- `types/index.ts` — Interfaces de UI compartidas (BenefitItem, ProcessStep, TestimonialItem, etc.)

### Rutas
- `/` — Landing page; `app/page.tsx` compone las secciones secuencialmente
- `/solicitar` — Formulario de solicitud de crédito (6 pasos)
- `/terminos-condiciones` — Términos y condiciones
- `/aviso-de-privacidad-integral` — Aviso de privacidad

### Flujo del formulario de solicitud
El estado vive en Zustand (`lib/solicitud/store.ts`) persistido en sessionStorage. `useSolicitudNavigation` orquesta la navegación entre pasos; `FormularioSolicitud` renderiza condicionalmente el paso activo. Cada paso usa su propio hook (`usePasoN`) que envuelve react-hook-form con el schema Zod correspondiente.

Todos los cambios de paso (next, back, editar, submit) deben llamar `scrollTop()` para llevar la vista al inicio del formulario.

El store expone `_hasHydrated` (seteado por `onRehydrateStorage`); úsalo para evitar renderizar el formulario antes de que sessionStorage hidrate el estado.

El `handleSubmit` en `useSolicitudNavigation` actualmente solo genera el folio y hace `console.log` del payload — la integración con el backend está pendiente.

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
