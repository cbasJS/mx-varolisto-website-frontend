# VaroListo — Landing Page

Landing page de captación de leads para **VaroListo**, enfocada en conectar usuarios con opciones de financiamiento personal en México.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** con design tokens personalizados
- **Framer Motion** para animaciones
- **TypeScript**

## Estructura

```
app/
  layout.tsx        # Fuentes (Manrope + Inter), metadata, Material Symbols
  page.tsx          # Composición de secciones
  globals.css       # Animaciones CSS (shimmer, badge-bob, step-glow)
components/
  Navbar.tsx        # Header fijo con sombra dinámica al scroll
  Hero.tsx          # Headline, badge social proof, CTAs animados
  TrustCards.tsx    # Trato directo + 100% Confiable
  Benefits.tsx      # 4 beneficios en grid responsive
  HowItWorks.tsx    # 3 pasos con conector vertical
  Testimonials.tsx  # 3 testimonios en grid
  FinalCTA.tsx      # Sección oscura con CTA principal y WhatsApp
  Footer.tsx        # Links legales + disclaimer obligatorio
  BottomNav.tsx     # Barra sticky inferior (solo mobile)
lib/
  config.ts         # URLs del formulario externo y WhatsApp
```

## Configuración

Antes de publicar, edita [`lib/config.ts`](lib/config.ts):

```ts
export const CTA_URL = "https://tu-formulario-externo.com"
export const WHATSAPP_NUMBER = "521XXXXXXXXXX"
```

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Diseño

| Token | Valor |
|---|---|
| `primary` | `#000666` — Azul marino |
| `secondary` | `#2ECC71` — Verde vibrante |
| Fuente titular | Manrope (extrabold) |
| Fuente cuerpo | Inter |

## Aviso legal

El footer incluye el disclaimer requerido: VaroListo no es una institución financiera. El sitio tiene fines informativos y las solicitudes están sujetas a evaluación y contacto directo.
