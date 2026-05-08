export interface HeroCopy {
  badge: {
    mobileLabel: string
    mobileIcon: string
    desktopLabel: string
    ariaLabel: string
  }
  headline: {
    before: string
    highlight: string
  }
  subtitle: string
  ctaPrimary: {
    label: string
    microcopy: string
    ariaLabel: string
  }
  ctaWhatsapp: {
    label: string
    microcopy: string
    ariaLabel: string
  }
  footer: string
}

export const heroCopy: HeroCopy = {
  badge: {
    mobileLabel: 'Estamos de tu lado',
    mobileIcon: 'thumb_up',
    desktopLabel: 'Préstamos personales · 100% en línea',
    ariaLabel: 'Estamos de tu lado',
  },
  headline: {
    before: 'Cuando necesitas dinero,',
    highlight: 'aquí empiezas',
  },
  subtitle: 'Sin filas ni sucursales. Respuesta en menos de 24 h.',
  ctaPrimary: {
    label: 'Solicitar préstamo',
    microcopy: 'Te toma menos de 5 minutos · sin compromiso',
    ariaLabel: 'Solicitar préstamo',
  },
  ctaWhatsapp: {
    label: 'WhatsApp',
    microcopy: 'Te respondemos en menos de 24 h',
    ariaLabel: 'Hablar con un asesor por WhatsApp',
  },
  footer: 'Atención personalizada en todo México',
}

export interface BenefitItem {
  icon: string
  title: string
  description: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  accent?: boolean
}

export interface TestimonialItem {
  quote: string
  name?: string
  role?: string
}

export interface TrustCardItem {
  icon: string
  title: string
  description: string
  iconBg: string
  iconColor: string
}

export const benefitItems: BenefitItem[] = [
  {
    icon: 'bolt',
    title: 'Proceso sencillo',
    description: 'Olvídate de filas y papeleo. Todo lo haces desde tu celular.',
  },
  {
    icon: 'speed',
    title: 'Respuesta rápida',
    description:
      'Analizamos tu solicitud al detalle y te respondemos en menos de 24 h por WhatsApp.',
  },
  {
    icon: 'dashboard_customize',
    title: 'Opciones a tu medida',
    description: 'Te ofrecemos cuotas y plazos que se ajustan a lo que puedes pagar.',
  },
  {
    icon: 'support_agent',
    title: 'Atención directa',
    description: 'Te contactamos por WhatsApp para guiarte y resolver tus dudas.',
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: '1',
    title: 'Llena tu solicitud',
    description: 'Te toma menos de 5 minutos. Sin papeleo.',
    accent: false,
  },
  {
    number: '2',
    title: 'Te respondemos',
    description: 'En menos de 24 h te escribimos al WhatsApp con la respuesta.',
    accent: false,
  },
  {
    number: '3',
    title: 'Recibe el dinero',
    description: 'Si todo está bien, lo depositamos directo a tu cuenta.',
    accent: true,
  },
]

export const testimonialItems: TestimonialItem[] = [
  { quote: 'Sin vueltas raras ni letras chiquitas. Todo claro desde el inicio' },
  { quote: 'Sin estrés y con un proceso sencillo' },
  { quote: 'Fácil de solicitar y con información transparente' },
]

export interface FeaturedTestimonial {
  quoteBefore: string
  brandHighlight: string
  quoteAfter: string
  name: string
  role: string
}

export const featuredTestimonial: FeaturedTestimonial = {
  quoteBefore: 'Buscaba lana para arreglar mi casa y en Varo',
  brandHighlight: 'Listo.mx',
  quoteAfter: ' todo fue rápido y sin complicaciones.',
  name: 'Francisco García',
  role: 'Programador móvil - CDMX',
}

export const trustCardItems: TrustCardItem[] = [
  {
    icon: 'mood',
    title: 'Trato directo',
    description: 'Hablamos como tú: sin términos complicados ni letra chiquita.',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    icon: 'verified',
    title: 'Datos seguros',
    description: 'Tus datos viajan cifrados y los usamos sólo para procesar tu solicitud.',
    iconBg: 'bg-secondary-fixed',
    iconColor: 'text-on-secondary-fixed',
  },
]
