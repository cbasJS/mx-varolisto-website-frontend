import type { Variants } from "framer-motion";

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export const fadeInVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

// Shared viewport config — triggers animation once when element enters view
export const VIEWPORT_ONCE = { once: true, margin: "-80px" } as const;

// Tighter threshold for elements closer to the bottom of the viewport
export const VIEWPORT_CLOSE = { once: true, margin: "-60px" } as const;
