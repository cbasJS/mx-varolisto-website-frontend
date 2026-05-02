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
    description:
      'Olvídate de las filas y el papeleo excesivo. Todo es digital y diseñado para tu comodidad.',
  },
  {
    icon: 'speed',
    title: 'Evaluación rápida',
    description:
      'Nuestra tecnología evalúa tu perfil en segundos para ofrecerte las mejores alternativas.',
  },
  {
    icon: 'dashboard_customize',
    title: 'Opciones personalizadas',
    description:
      'Encontramos diferentes esquemas de financiamiento que se adaptan a tu perfil y necesidades.',
  },
  {
    icon: 'support_agent',
    title: 'Atención directa',
    description:
      'Te contactamos personalmente para guiarte en cada paso del camino con total transparencia.',
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: '1',
    title: 'Deja tus datos',
    description: 'Completa el formulario en menos de 2 min.',
    accent: false,
  },
  {
    number: '2',
    title: 'Evaluamos tu perfil',
    description: 'Análisis inmediato para encontrar tu mejor opción.',
    accent: false,
  },
  {
    number: '3',
    title: 'Te contactamos',
    description: '¡Listo! Nos ponemos en contacto contigo para darte los detalles.',
    accent: true,
  },
]

export const testimonialItems: TestimonialItem[] = [
  { quote: 'Sin vueltas raras ni letras chiquitas. Todo claro desde el inicio' },
  { quote: 'Sin estrés y con un proceso sencillo' },
  { quote: 'Fácil de solicitar y con información transparente' },
]

export const trustCardItems: TrustCardItem[] = [
  {
    icon: 'mood',
    title: 'Trato directo',
    description: 'Hablamos tu idioma, sin términos complicados ni letras chiquitas.',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    icon: 'verified',
    title: '100% Confiable',
    description: 'Tus datos están seguros y los usamos solo para ayudarte.',
    iconBg: 'bg-secondary-fixed',
    iconColor: 'text-on-secondary-fixed',
  },
]
