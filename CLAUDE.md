# CLAUDE.md

Este archivo provee orientación a Claude Code (claude.ai/code) cuando trabaja en este repositorio.

## Comandos

- `npm run dev` — Servidor de desarrollo en http://localhost:3000
- `npm run build` — Build de producción
- `npm run lint` — ESLint vía Next.js

No hay framework de pruebas configurado.

## Arquitectura

### Stack
- Next.js 14 App Router (TypeScript estricto)
- Tailwind CSS con sistema de tokens extendido
- Framer Motion para animaciones
- shadcn/ui (estilo `radix-nova`) para componentes base
- Zustand instalado (sin stores activos aún)
- React Query instalado (sin uso activo aún)
- react-hook-form + Zod instalados (sin uso activo aún)

### Estructura de directorios

- `app/` — Páginas y layout raíz. El layout carga fuentes (Manrope, Inter) y metadatos.
- `components/layout/` — Navbar, Footer, BottomNav, ScrollRestorationClient
- `components/sections/` — Secciones de la landing page (Hero, Benefits, HowItWorks, etc.)
- `components/ui/` — Componentes shadcn/radix (button, input, slider, etc.)
- `content/` — Datos y copy de la UI: `home.ts` (secciones de la landing), `nav.ts` (links de navegación y footer)
- `hooks/` — Hooks reutilizables: `useScrolled`, `useScrollRestoration`
- `lib/config.ts` — URLs externas (Google Form CTA, WhatsApp) y constantes de marca
- `lib/animations.ts` — Variantes de Framer Motion reutilizables (`staggerContainer`, `fadeUpVariant`, `fadeInVariant`, `VIEWPORT_ONCE`, `VIEWPORT_CLOSE`)
- `lib/utils.ts` — Helper `cn()` para classnames (clsx + tailwind-merge)
- `types/index.ts` — Interfaces TypeScript compartidas

### Rutas
- `/` — Landing page; `app/page.tsx` compone las secciones secuencialmente
- `/terminos-condiciones` — Términos y condiciones
- `/aviso-de-privacidad-integral` — Aviso de privacidad

### Estilos
- Colores de marca: `primary #000666` (azul marino), `secondary #2ECC71` (verde)
- Variables CSS de fuentes: `--font-manrope` (titulares), `--font-inter` (cuerpo)
- Tokens extendidos en `tailwind.config.ts` (sistema Material Design 3: primary-fixed, on-primary, surface variants, etc.)
- Animaciones CSS en `app/globals.css`: `cta-spotlight`, `step-glow`, `badge-bob`
- Dark mode por clase (`dark:`), no hay toggle activo

### Patrones de componentes
- Los componentes interactivos usan la directiva `"use client"`
- Animaciones con Framer Motion: patrón container/stagger con `whileInView` para scroll-trigger
- Alias de path `@/*` apunta a la raíz del repo (ej. `import { config } from "@/lib/config"`)
- Alias `@/ui` apunta a `components/ui/`

### Integraciones externas
Todas las URLs externas viven en `lib/config.ts`. Actualizar ahí cuando cambien el link del CTA o el número de WhatsApp.
