# Plano Arquitectónico del Proyecto VaroListo.mx

**Documento de Referencia Arquitectónica**  
**Última actualización:** Abril 2026  
**Versión:** 1.0

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
3. [Arquitectura Limpia Objetivo](#arquitectura-limpia-objetivo)
4. [Diagrama C4 de Componentes](#diagrama-c4-de-componentes)
5. [Capa de API y Formularios](#capa-de-api-y-formularios)
6. [Patrones de Implementación](#patrones-de-implementación)
7. [Decisiones Arquitectónicas (ADRs)](#decisiones-arquitectónicas)
8. [Guías de Gobernanza](#guías-de-gobernanza)
9. [Plan de Desarrollo](#plan-de-desarrollo)

---

## Resumen Ejecutivo

**VaroListo.mx** es una página de marketing para un servicio de préstamos personales en México. El proyecto utiliza:

- **Next.js 14** con App Router (SSR/SSG listo)
- **React 18** para componentes interactivos
- **TypeScript 5** para tipado estricto
- **Tailwind CSS 3** para estilos utilitarios
- **Framer Motion 12** para animaciones fluidas
- **React Icons 5.6** para iconografía

### Objetivo Principal

Transformar el proyecto de una estructura monolítica de componentes en una arquitectura **limpia y modular** que:

1. Separe responsabilidades (layout, secciones, UI, lógica de negocio)
2. Centralice configuración y constantes
3. Implemente una capa API robusta para formularios de captura de leads
4. Proporcione hooks personalizados reutilizables
5. Facilite futuras expansiones (backend API, autenticación, etc.)

### Estado Actual

- **Sin backend propio**: todos los CTAs (Call-To-Action) dirigidos a Google Forms o WhatsApp
- **Nueva iniciativa**: captura de leads conectada a un **backend API real**
- **Estructura actual**: componentes en `/components` sin diferenciación de nivel

---

## Estado Actual del Proyecto

### Estructura Existente

```
mx-varolisto-website-frontend/
├── app/
│   ├── layout.tsx                    # Layout raíz
│   ├── page.tsx                      # Página principal (home)
│   ├── globals.css                   # Estilos globales
│   ├── terminos-condiciones/         # Página de T&C
│   └── aviso-de-privacidad-integral/ # Página de privacidad
├── components/                        # Todos los componentes sin distinción
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── TrustCards.tsx
│   ├── Benefits.tsx
│   ├── HowItWorks.tsx
│   ├── MobileTestimonial.tsx
│   ├── Testimonials.tsx (no usado)
│   ├── FinalCTA.tsx
│   ├── BottomNav.tsx
│   ├── Footer.tsx
│   └── ScrollToTop.tsx
├── lib/
│   └── config.ts                     # URLs externas (Google Forms, WhatsApp)
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### Componentes Actuales (Análisis)

| Componente            | Tipo     | Responsabilidad                | Ubicación                |
| --------------------- | -------- | ------------------------------ | ------------------------ |
| **Navbar**            | Layout   | Navegación superior            | `components/`            |
| **Hero**              | Sección  | Portada con CTAs               | `components/`            |
| **TrustCards**        | Sección  | Tarjetas de confianza (mobile) | `components/`            |
| **Benefits**          | Sección  | Listado de beneficios          | `components/`            |
| **HowItWorks**        | Sección  | Proceso en 3 pasos             | `components/`            |
| **MobileTestimonial** | Sección  | Testimonio (mobile)            | `components/`            |
| **Testimonials**      | Sección  | Grid de testimonios            | `components/` (no usado) |
| **FinalCTA**          | Sección  | CTA final (desktop)            | `components/`            |
| **BottomNav**         | Layout   | Barra inferior (mobile)        | `components/`            |
| **Footer**            | Layout   | Pie de página                  | `components/`            |
| **ScrollToTop**       | Utilidad | Scroll restoration             | `components/`            |

### Dependencias de Configuración

**lib/config.ts:**

```typescript
export const CTA_URL = 'https://forms.gle/FijHjFViHpu6wTKE7' // Google Forms
export const WHATSAPP_NUMBER = '+525650456534'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
```

Todos los CTAs apuntan a estos valores, lo que permite cambios centralizados.

### Análisis de Animaciones

- **Framer Motion**: motion variants reutilizables en cada componente
- **CSS personalizado**: animaciones de shimmer y glow en `globals.css`
- **Patrones**: stagger children, fade up, whileInView, whileHover
- **Oportunidad de mejora**: crear archivo `lib/animations.ts` para centralizar variantes

### Configuración de Tailwind

**Theme extendido:**

- Paleta Material Design 3 (primary: #000666, secondary: #2ECC71)
- Radio de bordes: mobile-friendly (.25rem a full)
- Tipografía: Manrope (headlines) + Inter (body)
- Dark mode listo (aunque no implementado en UI)

---

## Arquitectura Limpia Objetivo

### Estructura Propuesta

```
/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Layout raíz
│   ├── page.tsx                      # Home
│   ├── globals.css                   # CSS global
│   ├── api/                          # Route Handlers (futuro)
│   │   └── leads/
│   │       └── route.ts              # POST /api/leads
│   ├── terminos-condiciones/
│   ├── aviso-de-privacidad-integral/
│   └── formulario-prestamo/          # Nueva ruta (futura)
│
├── components/
│   ├── layout/                       # Layout components (layout tier)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── BottomNav.tsx
│   │
│   ├── sections/                     # Page sections (section tier)
│   │   ├── Hero.tsx
│   │   ├── TrustCards.tsx
│   │   ├── Benefits.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── MobileTestimonial.tsx
│   │   ├── FinalCTA.tsx
│   │   └── LeadForm.tsx              # NUEVA: formulario de captura
│   │
│   └── ui/                           # Atomic components (ui tier)
│       ├── Button.tsx                # Cuando ≥2 consumers
│       ├── Input.tsx
│       ├── FormField.tsx
│       └── Card.tsx
│
├── hooks/                            # Custom hooks
│   ├── useScrolled.ts                # Scroll listener para navbar
│   ├── useScrollRestoration.ts       # Restauración de scroll
│   └── useLeadForm.ts                # NUEVA: lógica del formulario
│
├── lib/
│   ├── config.ts                     # Constantes y URLs
│   ├── api.ts                        # NUEVA: funciones HTTP centralizadas
│   ├── animations.ts                 # NUEVA: variantes de Framer Motion
│   └── validation.ts                 # NUEVA: esquemas de validación
│
├── types/
│   └── index.ts                      # TypeScript interfaces compartidas
│
├── content/                          # NUEVA: data layer
│   ├── home.ts                       # Arrays de datos de secciones
│   └── nav.ts                        # Datos de navegación
│
└── styles/                           # OPCIONAL: CSS modular futura
    └── animations.module.css         # CSS de animaciones
```

### Principios Arquitectónicos

#### 1. Separation of Concerns

- **Layout Components**: Navbar, Footer, BottomNav
- **Section Components**: Hero, Benefits, CTA (contienen lógica de sección)
- **UI Components**: Button, Input, Card (reutilizables, sin lógica)
- **Hooks**: Lógica de estado y efectos reutilizable
- **API**: Toda comunicación HTTP centralizada

#### 2. Single Responsibility Principle

- Cada componente tiene UNA razón para cambiar
- Separar presentación de lógica
- Hooks manejan estado y efectos

#### 3. Dependency Injection

- `lib/config.ts` inyecta URLs
- `lib/api.ts` inyecta métodos HTTP
- `hooks/useLeadForm.ts` inyecta validación

#### 4. DRY (Don't Repeat Yourself)

- Animaciones centralizadas en `lib/animations.ts`
- Validación reutilizable en `lib/validation.ts`
- Funciones HTTP en `lib/api.ts`

---

## Diagrama C4 de Componentes

### Nivel 1: Sistema General

```
┌─────────────────────────────────────────────────────────┐
│         VaroListo.mx - Sistema de Marketing             │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐                                        │
│  │   Frontend   │                                        │
│  │  (Next.js)   │──────┐                                 │
│  └──────────────┘      │                                 │
│                        │                                 │
│                        ├──→ Google Forms (actual)        │
│                        ├──→ WhatsApp API (actual)        │
│                        └──→ Backend API (nuevo)          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Nivel 2: Contenedor Frontend

```
┌──────────────────────────────────────────────────────────┐
│           Navegador (Cliente)                            │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │        Next.js 14 (App Router)                     │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │  Page Root (app/layout.tsx + page.tsx)    │   │  │
│  │  │                                            │   │  │
│  │  │  ├── ScrollToTop                          │   │  │
│  │  │  ├── Navbar                               │   │  │
│  │  │  ├── main                                 │   │  │
│  │  │  │   ├── Hero                             │   │  │
│  │  │  │   ├── TrustCards                       │   │  │
│  │  │  │   ├── Benefits                         │   │  │
│  │  │  │   ├── HowItWorks                       │   │  │
│  │  │  │   ├── MobileTestimonial                │   │  │
│  │  │  │   ├── LeadForm (NEW)                   │   │  │
│  │  │  │   └── FinalCTA                         │   │  │
│  │  │  ├── BottomNav                            │   │  │
│  │  │  └── Footer                               │   │  │
│  │  │                                            │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │  Hooks & Utilities                         │   │  │
│  │  │                                            │   │  │
│  │  │  ├── useScrolled()                         │   │  │
│  │  │  ├── useScrollRestoration()                │   │  │
│  │  │  └── useLeadForm() (NEW)                   │   │  │
│  │  │                                            │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │  Services & Libraries                      │   │  │
│  │  │                                            │   │  │
│  │  │  ├── lib/config.ts                         │   │  │
│  │  │  ├── lib/api.ts (NEW)                      │   │  │
│  │  │  ├── lib/animations.ts (NEW)               │   │  │
│  │  │  ├── lib/validation.ts (NEW)               │   │  │
│  │  │  └── types/index.ts                        │   │  │
│  │  │                                            │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │  External Services                         │   │  │
│  │  │                                            │   │  │
│  │  │  ├── Framer Motion (Animaciones)           │   │  │
│  │  │  ├── Google Fonts (Tipografía)             │   │  │
│  │  │  ├── React Icons (Iconografía)             │   │  │
│  │  │  └── Tailwind CSS (Estilos)                │   │  │
│  │  │                                            │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

### Nivel 3: Componentes Detallados

#### App Layer (Páginas)

```
app/page.tsx
├── Hero (Sección)
│   ├── motion.div (container)
│   ├── Badge (social proof)
│   ├── h1 + p (copy)
│   ├── CTA botón (Google Forms)
│   ├── WhatsApp botón
│   └── Verified badge
├── TrustCards (Sección mobile)
│   └── motion.div[] (grid de 2)
├── Benefits (Sección)
│   └── motion.div[] (grid de 4 items)
├── HowItWorks (Sección)
│   └── ol (3 steps numbered)
├── MobileTestimonial (Sección mobile)
│   └── Testimonio + avatar
├── LeadForm (NUEVA Sección)
│   ├── useLeadForm hook
│   ├── Formulario multi-paso
│   ├── Validación en tiempo real
│   └── Envío a /api/leads
└── FinalCTA (Sección desktop)
    ├── Botones CTA
    └── Animación de fondo
```

#### Components Tier

**Layout Tier:**

```
components/layout/Navbar.tsx
├── State: scrolled (useEffect)
├── Handler: scrollToSection()
├── Render: nav con scroll-aware backdrop
└── CTAs: Google Forms

components/layout/Footer.tsx
├── Links: Privacidad, T&C, Contacto
├── Copyright: año dinámico
└── Aviso legal

components/layout/BottomNav.tsx
├── Fixed mobile bar
├── Botón CTA + WhatsApp
└── Animation: slide up on mount
```

**Section Tier:**

```
components/sections/Hero.tsx
├── Variants: container, fadeUp, fadeIn
├── Content: h1, p, 2 botones
├── Animation: stagger children
└── Responsive: mobile-specific copy

components/sections/LeadForm.tsx (NEW)
├── Hook: useLeadForm()
├── State: formData, loading, errors
├── Validation: validateEmail, etc
├── Submit: POST /api/leads
├── Feedback: success/error states
└── Accessibility: labels, aria
```

**UI Tier (Futura):**

```
components/ui/Button.tsx (cuando ≥2 consumers)
├── Props: variant, size, loading, disabled
├── Styles: Tailwind variants
└── Accessibility: button semantics

components/ui/Input.tsx (cuando ≥2 consumers)
├── Props: type, error, placeholder, value
├── Styles: focus states, error styling
└── Validation: error message display

components/ui/FormField.tsx (cuando ≥2 consumers)
├── Wrapper: label + input + error
├── Props: name, label, error, required
└── Accessibility: htmlFor binding
```

---

## Capa de API y Formularios

### Arquitectura de Submisión de Leads

```
┌──────────────────────────────────────────────────────────┐
│          LeadForm Component (UI)                         │
│                                                          │
│  ├── Campos: Nombre, Email, Teléfono, Monto, Plazo     │
│  ├── Validación: useLeadForm hook                        │
│  └── Submit: handleSubmit → api.submitLead()            │
│                                                          │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│          useLeadForm Hook                                │
│                                                          │
│  ├── State Management:                                   │
│  │   ├── formData: { name, email, phone, ... }          │
│  │   ├── errors: { [field]: string }                    │
│  │   ├── loading: boolean                               │
│  │   └── submitted: boolean                             │
│  │                                                      │
│  ├── Validation:                                         │
│  │   ├── validateEmail(email)                           │
│  │   ├── validatePhone(phone)                           │
│  │   └── validateForm()                                 │
│  │                                                      │
│  └── Handlers:                                           │
│      ├── handleChange(field, value)                     │
│      ├── handleBlur(field)                              │
│      └── handleSubmit() → api.submitLead()              │
│                                                          │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│          lib/api.ts - Funciones HTTP                     │
│                                                          │
│  export async function submitLead(data: Lead) {         │
│    const response = await fetch('/api/leads', {         │
│      method: 'POST',                                    │
│      headers: { 'Content-Type': 'application/json' },   │
│      body: JSON.stringify(data)                         │
│    })                                                   │
│    return response.json()                               │
│  }                                                      │
│                                                          │
│  export async function getQuote(amount: number) {       │
│    // Endpoint futuro para simulador de cuota           │
│  }                                                      │
│                                                          │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│          app/api/leads/route.ts                          │
│                                                          │
│  POST /api/leads                                         │
│  ├── Validación server-side                             │
│  ├── Sanitización de datos                              │
│  ├── Guardado en BD (futuro)                            │
│  ├── Envío a WhatsApp/Email (futuro)                    │
│  └── Response: { success, leadId, ... }                 │
│                                                          │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│          Backend API (Externa)                           │
│                                                          │
│  VaroListo Backend                                       │
│  ├── POST /api/v1/leads                                 │
│  ├── Database: leads collection                         │
│  ├── Análisis: creditworthiness                         │
│  └── Notificación: admin + cliente                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Implementación: lib/api.ts

```typescript
// lib/api.ts - Funciones HTTP centralizadas

export interface Lead {
  name: string
  email: string
  phone: string
  amount: number
  term: number
  income?: number
  empleoStatus?: 'employed' | 'self-employed' | 'unemployed'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// Configuración centralizada
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Función genérica de fetch
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: 'UNKNOWN_ERROR',
          message: 'Algo salió mal. Por favor intenta de nuevo.',
        },
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Error de conexión. Por favor verifica tu internet.',
      },
    }
  }
}

// API: Submisión de leads
export async function submitLead(lead: Lead): Promise<ApiResponse<{ leadId: string }>> {
  return request<{ leadId: string }>('/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  })
}

// API: Obtener cotización (futuro)
export async function getQuote(amount: number, term: number): Promise<ApiResponse> {
  return request('/quotes', {
    method: 'POST',
    body: JSON.stringify({ amount, term }),
  })
}

// API: Verificar email (futuro)
export async function verifyEmail(email: string): Promise<ApiResponse> {
  return request(`/verify-email?email=${encodeURIComponent(email)}`)
}
```

### Implementación: hooks/useLeadForm.ts

```typescript
// hooks/useLeadForm.ts - Custom hook para manejo del formulario

import { useState, useCallback } from 'react'
import type { Lead } from '@/lib/api'
import { submitLead } from '@/lib/api'
import { validateLead, type ValidationErrors } from '@/lib/validation'

export interface UseLeadFormReturn {
  formData: Lead
  errors: ValidationErrors
  loading: boolean
  submitted: boolean
  touched: Record<string, boolean>
  handleChange: (field: keyof Lead, value: any) => void
  handleBlur: (field: keyof Lead) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
  setSubmitted: (value: boolean) => void
}

const INITIAL_STATE: Lead = {
  name: '',
  email: '',
  phone: '',
  amount: 5000,
  term: 3,
  income: undefined,
  empleoStatus: 'employed',
}

export function useLeadForm(): UseLeadFormReturn {
  const [formData, setFormData] = useState<Lead>(INITIAL_STATE)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = useCallback(
    (field: keyof Lead, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Limpiar error cuando el usuario empieza a escribir
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  const handleBlur = useCallback((field: keyof Lead) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validar formulario
      const validationErrors = validateLead(formData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setLoading(true)
      try {
        const response = await submitLead(formData)

        if (response.success) {
          setSubmitted(true)
          setFormData(INITIAL_STATE)
          setTouched({})
          setErrors({})

          // Reset después de 3 segundos
          setTimeout(() => setSubmitted(false), 3000)
        } else {
          setErrors({
            submit: response.error?.message || 'Error al enviar el formulario',
          })
        }
      } catch (error) {
        setErrors({
          submit: error instanceof Error ? error.message : 'Error desconocido',
        })
      } finally {
        setLoading(false)
      }
    },
    [formData],
  )

  const reset = useCallback(() => {
    setFormData(INITIAL_STATE)
    setErrors({})
    setTouched({})
    setSubmitted(false)
  }, [])

  return {
    formData,
    errors,
    loading,
    submitted,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setSubmitted,
  }
}
```

### Implementación: lib/validation.ts

```typescript
// lib/validation.ts - Esquemas de validación

import type { Lead } from '@/lib/api'

export type ValidationErrors = Partial<Record<keyof Lead | 'submit', string>>

// Validadores individuales
const validators = {
  name: (value: string): string | undefined => {
    if (!value || value.trim().length === 0) return 'El nombre es requerido'
    if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres'
    if (value.length > 100) return 'El nombre no puede exceder 100 caracteres'
    return undefined
  },

  email: (value: string): string | undefined => {
    if (!value) return 'El email es requerido'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Email inválido'
    return undefined
  },

  phone: (value: string): string | undefined => {
    if (!value) return 'El teléfono es requerido'
    const phoneRegex = /^(\+52|0)?[1-9]\d{9}$/
    if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
      return 'Teléfono inválido (10-11 dígitos)'
    }
    return undefined
  },

  amount: (value: number): string | undefined => {
    if (!value || value <= 0) return 'El monto debe ser mayor a $0'
    if (value < 2000) return 'Monto mínimo: $2,000'
    if (value > 20000) return 'Monto máximo: $20,000'
    return undefined
  },

  term: (value: number): string | undefined => {
    if (!value || value <= 0) return 'El plazo es requerido'
    if (value < 2 || value > 6) return 'Plazo válido: 2-6 meses'
    return undefined
  },
}

// Función de validación completa
export function validateLead(lead: Lead): ValidationErrors {
  const errors: ValidationErrors = {}

  Object.entries(validators).forEach(([field, validator]) => {
    const value = lead[field as keyof Lead]
    const error = validator(value)
    if (error) {
      errors[field as keyof Lead] = error
    }
  })

  return errors
}

// Validadores individuales exportados
export const validateEmail = validators.email
export const validatePhone = validators.phone
```

### Implementación: components/sections/LeadForm.tsx

```typescript
'use client'

import { motion } from 'framer-motion'
import { useLeadForm } from '@/hooks/useLeadForm'
import type { Lead } from '@/lib/api'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function LeadForm() {
  const {
    formData,
    errors,
    loading,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLeadForm()

  if (submitted) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-6xl mb-4">✓</div>
        <h3 className="font-headline font-bold text-2xl text-primary mb-2">
          ¡Solicitud enviada!
        </h3>
        <p className="text-on-surface-variant">
          Nos pondremos en contacto contigo en breve.
        </p>
      </motion.div>
    )
  }

  return (
    <section
      id="formulario-prestamo"
      className="py-20 px-6 bg-surface-container-lowest"
      aria-label="Formulario de solicitud de préstamo"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.h2
            variants={item}
            className="font-headline font-extrabold text-3xl text-primary mb-2 text-center"
          >
            Solicita tu préstamo
          </motion.h2>

          <motion.p
            variants={item}
            className="text-center text-on-surface-variant mb-8"
          >
            Completa el formulario y te contactaremos en minutos
          </motion.p>

          <motion.form
            variants={item}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-on-surface mb-1"
              >
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full px-4 py-2 rounded-lg border font-body transition-colors ${
                  errors.name
                    ? 'border-error bg-error-container/10'
                    : 'border-surface-container focus:border-primary'
                }`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-error mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-on-surface mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-2 rounded-lg border font-body transition-colors ${
                  errors.email
                    ? 'border-error bg-error-container/10'
                    : 'border-surface-container focus:border-primary'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-error mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-on-surface mb-1"
              >
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+52 55 1234 5678"
                className={`w-full px-4 py-2 rounded-lg border font-body transition-colors ${
                  errors.phone
                    ? 'border-error bg-error-container/10'
                    : 'border-surface-container focus:border-primary'
                }`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-xs text-error mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-on-surface mb-1"
              >
                Monto: ${formData.amount.toLocaleString('es-MX')}
              </label>
              <input
                id="amount"
                type="range"
                min="2000"
                max="20000"
                step="500"
                value={formData.amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                <span>$2,000</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Plazo */}
            <div>
              <label
                htmlFor="term"
                className="block text-sm font-medium text-on-surface mb-1"
              >
                Plazo: {formData.term} meses
              </label>
              <select
                id="term"
                value={formData.term}
                onChange={(e) => handleChange('term', Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-surface-container focus:border-primary font-body transition-colors"
              >
                {[2, 3, 4, 5, 6].map((month) => (
                  <option key={month} value={month}>
                    {month} meses
                  </option>
                ))}
              </select>
            </div>

            {/* Error global */}
            {errors.submit && (
              <div className="bg-error-container/20 border border-error rounded-lg p-3">
                <p className="text-sm text-error">{errors.submit}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-primary px-6 py-3 rounded-full font-headline font-bold text-lg hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-busy={loading}
            >
              {loading ? 'Enviando...' : 'Solicitar ahora'}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
```

### Implementación: app/api/leads/route.ts

```typescript
// app/api/leads/route.ts - API Route Handler

import type { NextRequest } from 'next/server'

interface LeadRequest {
  name: string
  email: string
  phone: string
  amount: number
  term: number
}

export async function POST(request: NextRequest) {
  try {
    // Parsear JSON
    const body = (await request.json()) as LeadRequest

    // Validación server-side (redundante, pero necesaria)
    if (!body.name || !body.email || !body.phone) {
      return Response.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Faltan campos requeridos',
          },
        },
        { status: 400 },
      )
    }

    // Aquí iría lógica de:
    // 1. Guardar en BD
    // 2. Enviar a backend externo
    // 3. Notificar vía email/WhatsApp

    // Por ahora, respuesta de éxito simulada
    return Response.json(
      {
        success: true,
        data: {
          leadId: `LEAD-${Date.now()}`,
          status: 'received',
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error en POST /api/leads:', error)

    return Response.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al procesar la solicitud',
        },
      },
      { status: 500 },
    )
  }
}
```

---

## Patrones de Implementación

### 1. Patrón Hook + Component

Separar lógica de presentación:

```typescript
// Hook (lógica)
export function useFeature() {
  const [state, setState] = useState()
  // lógica aquí
  return { state, handler }
}

// Component (presentación)
export function Feature() {
  const { state, handler } = useFeature()
  return <div onClick={handler}>{state}</div>
}
```

### 2. Patrón API Centralized

Todas las llamadas HTTP en `lib/api.ts`:

```typescript
// ✓ Correcto
import { submitLead } from '@/lib/api'
const response = await submitLead(data)

// ✗ Evitar
const response = await fetch('/api/leads', { ... })
```

### 3. Patrón Config Injection

URLs y constantes en `lib/config.ts`:

```typescript
// ✓ Correcto
import { CTA_URL } from '@/lib/config'
<a href={CTA_URL}>CTA</a>

// ✗ Evitar
<a href="https://forms.gle/...">CTA</a>
```

### 4. Patrón Variant Centralized

Animaciones en `lib/animations.ts`:

```typescript
// ✓ Correcto
import { fadeUp, container } from '@/lib/animations'
<motion.div variants={container} {...props} />

// ✗ Evitar
const fadeUp = { ... }; // repetido en 10 archivos
```

### 5. Patrón Validation Separated

Esquemas en `lib/validation.ts`:

```typescript
// ✓ Correcto
import { validateLead } from '@/lib/validation'
const errors = validateLead(formData)

// ✗ Evitar
const errors = {}
if (!formData.name) errors.name = '...'
```

---

## Decisiones Arquitectónicas (ADRs)

### ADR-001: Usar Next.js App Router

**Status:** ADOPTADO

**Contexto:**

- Next.js 14 introduce App Router como estándar
- Soporta Server Components y Route Handlers
- Facilita futuras integraciones backend

**Decisión:**
Usar App Router en `/app` en lugar de Pages Router.

**Consecuencias:**

- ✓ Mejor rendimiento con Server Components
- ✓ Route Handlers nativos para API
- ⚠️ Requiere mayor familiaridad con React 18+

### ADR-002: Separar Componentes por Nivel (Layout/Section/UI)

**Status:** ADOPTADO

**Contexto:**

- Componentes actualmente sin distinción de responsabilidad
- Facilita reutilización y testing
- Permite crecimiento ordenado

**Decisión:**

```
components/
├── layout/    # Navbar, Footer, BottomNav
├── sections/  # Hero, Benefits, etc.
└── ui/        # Atoms (cuando ≥2 consumers)
```

**Consecuencias:**

- ✓ Arquitectura escalable
- ✓ Fácil localizar dónde agregar componentes
- ⚠️ Requiere disciplina en la clasificación

### ADR-003: Centralizar API en lib/api.ts

**Status:** ADOPTADO

**Contexto:**

- Múltiples endpoints futuros (leads, quotes, auth)
- Necesidad de manejo centralizado de errores
- Facilita testing y cambios de URL

**Decisión:**
Crear `lib/api.ts` con funciones fetch tipadas para cada endpoint.

**Consecuencias:**

- ✓ Control centralizado de errores HTTP
- ✓ URL base configurable vía env
- ✓ Testing simplificado
- ⚠️ Requiere mantener actualizado

### ADR-004: Custom Hook para Lógica de Formularios

**Status:** ADOPTADO

**Contexto:**

- Múltiples formularios futuros
- Validación reutilizable
- State management consistente

**Decisión:**
Patrón `useFormName()` para cada formulario principal con validación integrada.

**Consecuencias:**

- ✓ Lógica separada de UI
- ✓ Validación reutilizable
- ✓ Testing aislado
- ⚠️ Requiere hooks knowledge

### ADR-005: Animaciones en lib/animations.ts

**Status:** RECOMENDADO

**Contexto:**

- Múltiples componentes usan Framer Motion
- Variantes repetidas en cada componente
- Oportunidad de DRY

**Decisión:**
Centralizar variantes comunes en `lib/animations.ts`.

**Ejemplo implementación:**

```typescript
// lib/animations.ts
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}
```

**Consecuencias:**

- ✓ Consistencia visual
- ✓ Cambios globales fáciles
- ✓ Archivo único de referencia
- ⚠️ Requiere actualizar componentes existentes

### ADR-006: Tipado Estricto con TypeScript

**Status:** ADOPTADO

**Contexto:**

- tsconfig.json con strict: true
- Lead form requiere validación en dos capas
- Mejor documentación del código

**Decisión:**
Uso exhaustivo de tipos, especialmente para datos de API y formularios.

**Consecuencias:**

- ✓ Errores detectados en build time
- ✓ Mejor DX con autocompletar
- ⚠️ Más verbosidad inicial
- ⚠️ Requiere Type knowledge

### ADR-007: Estructura de Tipos en types/index.ts

**Status:** RECOMENDADO

**Contexto:**

- Tipos compartidos entre múltiples módulos
- Necesidad de versioning de API
- Documentación centralizada

**Decisión:**
Crear `types/index.ts` con interfaces principales:

```typescript
// types/index.ts
export interface Lead {
  name: string
  email: string
  phone: string
  amount: number
  term: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
}
```

**Consecuencias:**

- ✓ Tipos compartidos y versionados
- ✓ Documentación integrada
- ✓ Fácil cambios globales
- ⚠️ Requiere mantenimiento

---

## Guías de Gobernanza

### 1. Guía de Añadir Componentes

#### Regla: Clasificar por Nivel

```
├── layout/    → Componentes de estructura (Navbar, Footer)
├── sections/  → Componentes de sección (Hero, Benefits)
└── ui/        → Componentes reutilizables (Button cuando ≥2 consumers)
```

**Criterios de clasificación:**

| Nivel         | Características                                           | Ejemplos                  |
| ------------- | --------------------------------------------------------- | ------------------------- |
| **layout/**   | Estructura de página, header/footer, persistentes         | Navbar, Footer, BottomNav |
| **sections/** | Secciones de contenido, llamadas a acción, scroll targets | Hero, Benefits, LeadForm  |
| **ui/**       | Átomos reutilizables SOLO cuando ≥2 componentes los usan  | Button, Input, Card       |

**Proceso:**

1. Nuevo componente inicia en `sections/` (más probable)
2. Si se reutiliza en 2+ componentes → extraer a `ui/`
3. Si estructura la página → agregar a `layout/`

#### Ejemplo: Agregar FormField

```typescript
// Paso 1: Identificar consumidores
// - LeadForm.tsx (usa Input + Label)
// - FutureAuthForm.tsx (usa Input + Label)
// → ≥2 consumidores → extraer a ui/

// Paso 2: Crear components/ui/FormField.tsx
export interface FormFieldProps {
  name: string
  label: string
  type?: string
  error?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function FormField({
  name,
  label,
  error,
  ...props
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...props} aria-invalid={!!error} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

// Paso 3: Actualizar consumers
// import { FormField } from '@/components/ui/FormField'
// <FormField name="email" label="Email" value={...} onChange={...} />
```

### 2. Guía de Validación

#### Flujo de Validación en 2 Capas

```
Client (UI)              → Server (Route Handler)
  ↓                        ↓
useLeadForm hook        lib/api.ts
  ↓                        ↓
validateLead()          POST /api/leads
  ↓                        ↓
Feedback inmediato      Validación redundante
                         ↓
                      Lógica de negocio
                         ↓
                      Respuesta JSON
```

#### Implementación:

**lib/validation.ts:**

```typescript
export function validateEmail(email: string): string | undefined {
  if (!email) return 'Email requerido'
  if (!email.includes('@')) return 'Email inválido'
  return undefined
}
```

**hooks/useLeadForm.ts:**

```typescript
const errors = validateLead(formData)
if (errors.email) {
  // Mostrar error inmediatamente en UI
  setErrors(errors)
  return
}
```

**app/api/leads/route.ts:**

```typescript
// Validación redundante server-side
const validationErrors = validateLead(body)
if (Object.keys(validationErrors).length > 0) {
  return Response.json({ error: '...' }, { status: 400 })
}
```

### 3. Guía de Animaciones

#### Estándar: Usar lib/animations.ts

**Variantes comunes:**

```typescript
// lib/animations.ts
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
}
```

**Uso en componentes:**

```typescript
import { fadeUp, container } from '@/lib/animations'

export function MySection() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.h2 variants={fadeUp}>Heading</motion.h2>
      <motion.p variants={fadeUp}>Descripción</motion.p>
    </motion.div>
  )
}
```

### 4. Guía de Configuración

#### Constantes en lib/config.ts

```typescript
// ✓ Recomendado
export const CTA_URL = process.env.NEXT_PUBLIC_CTA_URL || 'https://forms.gle/...'
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '+525650456534'

// ✓ Variables de ambiente
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CTA_URL=https://forms.gle/...
```

**Uso en componentes:**

```typescript
import { CTA_URL, WHATSAPP_URL } from '@/lib/config'

<a href={CTA_URL}>Solicitar</a>
```

### 5. Guía de Hooks Personalizados

#### Patrón: Hook = Lógica Pura

```typescript
// ✓ Correcto: Lógica pura, sin JSX
export function useFeature() {
  const [state, setState] = useState()
  useEffect(() => { /* efectos */ }, [])
  return { state, handlers }
}

// ✗ Evitar: Lógica + JSX
export function useFeature() {
  return <div>JSX aquí</div>
}
```

#### Naming Convention

```typescript
// use[Feature][Concern]
useLeadForm() // Formulario de leads
useScrolled() // Estado de scroll
useScrollRestoration() // Restauración de scroll
useFormValidation() // Validación de formulario (genérico)
```

### 6. Guía de Testing (Futuro)

#### Estructura Test

```typescript
// Crear carpeta __tests__ al lado del componente
components/sections/
├── LeadForm.tsx
├── LeadForm.test.tsx
└── __tests__/
    └── LeadForm.integration.test.tsx
```

#### Patrón Test

```typescript
// components/sections/__tests__/LeadForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LeadForm from '../LeadForm'

describe('LeadForm', () => {
  it('should validate email on blur', () => {
    render(<LeadForm />)
    const emailInput = screen.getByLabelText('Email')

    fireEvent.blur(emailInput)

    expect(screen.getByText('Email requerido')).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    render(<LeadForm />)

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })
    // ... más campos

    fireEvent.click(screen.getByRole('button', { name: /solicitar/i }))

    await waitFor(() => {
      expect(screen.getByText('¡Solicitud enviada!')).toBeInTheDocument()
    })
  })
})
```

---

## Plan de Desarrollo

### Fase 1: Refactorización Base (1-2 sprints)

**Objetivo:** Reorganizar estructura sin cambiar funcionalidad

**Tareas:**

1. Crear carpetas `components/layout`, `components/sections`

   ```bash
   mkdir -p components/{layout,sections,ui}
   ```

2. Mover componentes existentes:

   ```bash
   # Layout tier
   mv components/Navbar.tsx components/layout/
   mv components/Footer.tsx components/layout/
   mv components/BottomNav.tsx components/layout/

   # Section tier
   mv components/Hero.tsx components/sections/
   mv components/Benefits.tsx components/sections/
   # ... resto de secciones
   ```

3. Actualizar imports en `app/page.tsx`

   ```typescript
   // Antes
   import Hero from '@/components/Hero'

   // Después
   import Hero from '@/components/sections/Hero'
   ```

4. Crear `lib/animations.ts` y centralizar variantes
5. Crear `types/index.ts` con interfaces comunes
6. Crear `lib/validation.ts` (vacío, listo para formarios)

**Verificación:**

- `npm run build` sin errores
- Visualmente sin cambios

---

### Fase 2: API Layer (1 sprint)

**Objetivo:** Implementar capa centralizada de API

**Tareas:**

1. Crear `lib/api.ts` con funciones HTTP genéricas

   ```typescript
   export async function request<T>(...)
   export async function submitLead(lead: Lead)
   export async function getQuote(amount, term)
   ```

2. Crear `app/api/leads/route.ts`

   ```typescript
   export async function POST(request: NextRequest)
   ```

3. Crear `types/index.ts` con interfaces:

   ```typescript
   export interface Lead { ... }
   export interface ApiResponse<T> { ... }
   export interface ApiError { ... }
   ```

4. Crear `lib/validation.ts` con esquemas:

   ```typescript
   export function validateLead(lead): ValidationErrors
   export function validateEmail(email): string | undefined
   ```

5. Test:
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com",...}'
   ```

---

### Fase 3: Hook + Component LeadForm (1 sprint)

**Objetivo:** Implementar formulario de captura de leads con validación

**Tareas:**

1. Crear `hooks/useLeadForm.ts` con:
   - State management (formData, errors, loading)
   - Validación integrada
   - Submit handler conectado a `lib/api.ts`

2. Crear `components/sections/LeadForm.tsx`:
   - Formulario con campos
   - Integración con hook
   - Estados: normal, validación, loading, success

3. Agregar a `app/page.tsx`:

   ```typescript
   import LeadForm from '@/components/sections/LeadForm'

   <LeadForm />
   ```

4. Estilos Tailwind y animaciones Framer Motion

5. Testing:
   ```bash
   npm test -- LeadForm.test.tsx
   ```

---

### Fase 4: UI Components (Opcional, cuando sea necesario)

**Objetivo:** Extraer componentes reutilizables a `ui/`

**Triggers para mover a UI:**

- Componente se usa en 2+ lugares
- Propiedades genéricas (props, variants)
- Sin lógica de negocio

**Ejemplos candidatos:**

- `Button.tsx` (si se usa en LeadForm + otros)
- `Input.tsx` (si se usa en LeadForm + auth form futuro)
- `FormField.tsx` (wrapper de label + input + error)

---

### Fase 5: Integraciones Backend (Paralelo)

**Objetivo:** Conectar a backend real

**Tareas:**

1. Actualizar `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=https://api.varolisto.mx
   ```

2. Implementar en `app/api/leads/route.ts`:

   ```typescript
   // Guardar en BD
   // Enviar a backend
   // Notificar cliente
   ```

3. Agregar webhooks para notificaciones

---

## Blueprint para Nuevo Desarrollo

### Checklist: Agregar Nueva Sección

```markdown
## Implementar Nueva Sección: [NombreSección]

### 1. Analizar Requisitos

- [ ] Especificación de diseño
- [ ] Datos requeridos
- [ ] Interactividad
- [ ] Responsive design

### 2. Crear Componente

- [ ] Crear `components/sections/[NombreSección].tsx`
- [ ] Importar animaciones desde `lib/animations.ts`
- [ ] Tipado con TypeScript
- [ ] Accesibilidad (a11y)

### 3. Datos (si aplica)

- [ ] Crear/actualizar `content/home.ts`
- [ ] Tipado de datos en `types/index.ts`

### 4. Agregar a Página

- [ ] Importar en `app/page.tsx`
- [ ] Posicionar en orden correcto
- [ ] Establecer `id` para scroll

### 5. Testing

- [ ] Responsive en mobile (< 768px)
- [ ] Responsive en desktop (≥ 768px)
- [ ] Animaciones suave
- [ ] Accesibilidad keyboard + screen reader

### 6. Performance

- [ ] Lighthouse score > 90
- [ ] Sin warnings en console
- [ ] Bundle impact < 50KB

### 7. Documentación

- [ ] Props documentados (JSDoc)
- [ ] Ejemplo de uso
- [ ] Variaciones (si aplica)
```

### Checklist: Agregar Nuevo API Endpoint

```markdown
## Implementar Nuevo Endpoint: POST /api/[recurso]

### 1. Tipos

- [ ] Crear interfaz en `types/index.ts`
- [ ] Interfaz Request
- [ ] Interfaz Response

### 2. Validación

- [ ] Agregar validador en `lib/validation.ts`
- [ ] Validación client-side
- [ ] Validación server-side (redundante)

### 3. Cliente

- [ ] Crear función en `lib/api.ts`
- [ ] Manejo de errores
- [ ] Typing correcto

### 4. Servidor

- [ ] Crear `app/api/[recurso]/route.ts`
- [ ] Validación
- [ ] Lógica de negocio
- [ ] Logging

### 5. Testing

- [ ] Test unitario (validación)
- [ ] Test integración (endpoint)
- [ ] Error cases
- [ ] Success cases

### 6. Documentación

- [ ] README.md actualizado
- [ ] Ejemplo de uso
- [ ] Posibles errores
```

### Checklist: Agregar Nuevo Hook

```markdown
## Implementar Nuevo Hook: use[Feature]

### 1. Diseño

- [ ] Responsabilidad única
- [ ] Inputs (parámetros)
- [ ] Outputs (return value)

### 2. Implementación

- [ ] `hooks/use[Feature].ts`
- [ ] TypeScript interface de return
- [ ] JSDoc comentarios

### 3. Testing

- [ ] `hooks/__tests__/use[Feature].test.ts`
- [ ] Comportamiento normal
- [ ] Edge cases
- [ ] Cleanup (useEffect)

### 4. Documentación

- [ ] Comentarios inline
- [ ] Ejemplo de uso en README

### 5. Integración

- [ ] Actualizar componentes que lo usan
- [ ] Verificar que funciona
```

---

## Resumen de Archivos a Crear

| Archivo                            | Propósito             | Prioridad |
| ---------------------------------- | --------------------- | --------- |
| `lib/api.ts`                       | HTTP centralizando    | Alta      |
| `lib/animations.ts`                | Variantes Motion      | Media     |
| `lib/validation.ts`                | Esquemas validación   | Alta      |
| `types/index.ts`                   | Interfaces TypeScript | Alta      |
| `hooks/useLeadForm.ts`             | Lógica formulario     | Alta      |
| `components/sections/LeadForm.tsx` | UI formulario         | Alta      |
| `app/api/leads/route.ts`           | API endpoint          | Alta      |
| `content/home.ts`                  | Data arrays           | Baja      |
| `content/nav.ts`                   | Nav data              | Baja      |

---

## Conclusión

Este documento proporciona una **hoja de ruta clara** para:

1. ✓ Entender la estructura actual
2. ✓ Implementar una arquitectura limpia y modular
3. ✓ Agregar nuevo formulario de captura de leads
4. ✓ Mantener código escalable y mantenible

**Próximos pasos:**

1. Revisar y validar arquitectura con equipo
2. Priorizar fases según capacidad
3. Crear tickets de desarrollo
4. Comenzar Fase 1 (refactorización base)

**Referencias de Tecnología:**

- [Next.js 14 Docs](https://nextjs.org/docs)
- [React 18 Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Documento generado automáticamente**  
Equipo: VaroListo.mx  
Contacto: contacto@varolisto.mx
