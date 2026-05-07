'use client'

import { motion } from 'framer-motion'
import { fadeUpVariant } from '@/lib/animations'
import { heroCopy } from '@/content/home'

export function SocialProofBadge() {
  const { badge } = heroCopy
  return (
    <motion.div variants={fadeUpVariant}>
      <div
        className="badge-bob inline-flex items-center gap-2 bg-secondary-container md:bg-primary/5 text-on-secondary-container md:text-primary px-4 py-1.5 rounded-full mb-6 md:mb-8"
        aria-label={badge.ariaLabel}
      >
        {/* Mobile only */}
        <span className="flex items-center gap-2 md:hidden">
          <span
            className="material-symbols-outlined text-lg"
            aria-hidden="true"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {badge.mobileIcon}
          </span>
          <span className="text-sm font-semibold">{badge.mobileLabel}</span>
        </span>
        {/* Desktop only */}
        <span className="hidden md:inline text-sm font-bold tracking-tight">
          {badge.desktopLabel}
        </span>
      </div>
    </motion.div>
  )
}
