import type { Variants } from 'framer-motion'

const FADE_UP_Y = 28
const FADE_UP_DURATION = 0.55
const FADE_IN_DURATION = 0.5
const STAGGER_CHILDREN = 0.12
const STAGGER_DELAY = 0.15
const VIEWPORT_MARGIN = '-80px'
const VIEWPORT_MARGIN_CLOSE = '-60px'

const PASO_SLIDE_X = 50
const PASO_SLIDE_DURATION = 0.3

export type StepDirection = 1 | -1

export function getStepDirection(prev: number | null, current: number): StepDirection {
  if (prev == null) return 1
  return current < prev ? -1 : 1
}

// Variants funcionales: framer-motion lee `custom={direction}` en cada motion.div
// al momento de animar, así el paso saliente conserva la dirección con la que
// navegó aunque el usuario cambie de sentido entre frames.
export const pasoSlideVariants: Variants = {
  enter: (direction: StepDirection) => ({
    opacity: 0,
    x: direction > 0 ? PASO_SLIDE_X : -PASO_SLIDE_X,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: StepDirection) => ({
    opacity: 0,
    x: direction > 0 ? -PASO_SLIDE_X : PASO_SLIDE_X,
  }),
}

export const pasoTransition = { duration: PASO_SLIDE_DURATION, ease: 'easeInOut' as const }

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: STAGGER_CHILDREN, delayChildren: STAGGER_DELAY },
  },
}

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: FADE_UP_Y },
  show: { opacity: 1, y: 0, transition: { duration: FADE_UP_DURATION, ease: 'easeOut' } },
}

export const fadeInVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: FADE_IN_DURATION } },
}

// Shared viewport config — triggers animation once when element enters view
export const VIEWPORT_ONCE = { once: true, margin: VIEWPORT_MARGIN } as const

// Tighter threshold for elements closer to the bottom of the viewport
export const VIEWPORT_CLOSE = { once: true, margin: VIEWPORT_MARGIN_CLOSE } as const
