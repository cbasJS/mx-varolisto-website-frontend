# VaroListo.mx — Frontend

Landing page y flujo de solicitud de crédito para **VaroListo**, plataforma de financiamiento personal en México.

## Stack

- **Next.js 14** (App Router, TypeScript estricto)
- **Tailwind CSS** con design tokens Material Design 3
- **Framer Motion** para animaciones
- **shadcn/ui** (`radix-nova`) para componentes base
- **react-hook-form + Zod** — validación del formulario de solicitud
- **Zustand** — estado global del formulario (persistido en sessionStorage)
- **@varolisto/shared-schemas** — schemas Zod compartidos (NPM privado vía GitHub Packages)

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Landing page |
| `/solicitar` | Formulario de solicitud (6 pasos) |
| `/terminos-condiciones` | Términos y condiciones |
| `/aviso-de-privacidad-integral` | Aviso de privacidad integral |

## Formulario de solicitud (`/solicitar`)

Flujo de 6 pasos con navegación entre ellos y scroll al top en cada transición:

| Paso | Componente | Datos |
|---|---|---|
| 1 | `Paso1DatosPersonales` | Nombre, CURP, correo, teléfono, dirección |
| 2 | `Paso2Solicitud` | Monto, plazo, destino, primer crédito |
| 3 | `Paso3SituacionEconomica` | Actividad, empleador, antigüedad, ingresos, deudas |
| 4 | `Paso4Referencias` | 2 referencias personales |
| 5 | `Paso5Documentos` | Comprobantes (drag & drop) + CLABE interbancaria |
| 6 | `Paso6Revision` | Resumen + consentimientos → envío |

## Estructura

```
app/
  page.tsx                    # Landing page
  solicitar/                  # Ruta del formulario
  api/colonias/               # API route: consulta colonias por CP (SEPOMEX)
components/
  layout/                     # Navbar, Footer, BottomNav
  sections/                   # Secciones de la landing (Hero, Benefits, etc.)
  solicitar/                  # Formulario completo
    FormularioSolicitud.tsx   # Orquestador principal
    BarraPasos.tsx            # Indicador de progreso
    FormUI.tsx                # Componentes de UI reutilizables del form
    PantallaExito.tsx         # Pantalla de éxito post-envío
    pasos/                    # Un componente por paso
  ui/                         # Componentes shadcn/radix
content/
  home.ts                     # Copy de la landing
  nav.ts                      # Links de navegación y footer
hooks/
  solicitar/                  # Hooks por paso + navegación
    useSolicitudNavigation.ts # Orquestador: next/back/submit + scroll
    usePaso1.ts … usePaso6.ts # Validación por paso con react-hook-form
lib/
  solicitud/
    store.ts                  # Zustand store (sessionStorage)
    schemas/index.ts          # Re-exports de @varolisto/shared-schemas
    utils/                    # Helpers: labels, CLABE mask, cálculo de cuota, etc.
  config.ts                   # URLs externas (WhatsApp) y constantes de marca
  animations.ts               # Variantes Framer Motion reutilizables
  utils.ts                    # cn() helper
```

## Configuración

URLs externas en [`lib/config.ts`](lib/config.ts). Actualizar ahí cuando cambie el número de WhatsApp u otros links.

El paquete `@varolisto/shared-schemas` se instala desde GitHub Packages. Requiere un `.npmrc` con el token de autenticación:

```
@varolisto:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Build de producción
npm run lint     # ESLint
```

## Diseño

| Token | Valor |
|---|---|
| `primary` | `#000666` — Azul marino |
| `secondary` | `#2ECC71` — Verde vibrante |
| Fuente titular | Manrope (extrabold) |
| Fuente cuerpo | Inter |

Los tokens siguen el sistema Material Design 3 (primary-fixed, on-primary, surface variants, etc.) definidos en `tailwind.config.ts`.
