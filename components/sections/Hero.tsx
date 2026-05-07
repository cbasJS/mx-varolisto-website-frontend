'use client'

import { motion } from 'framer-motion'
import { MdOutlineWhatsapp, MdOutlineVerified } from 'react-icons/md'
import { CTA_URL, WHATSAPP_URL } from '@/lib/config'
import { staggerContainer, fadeUpVariant, fadeInVariant } from '@/lib/animations'
import { heroCopy } from '@/content/home'
import { SocialProofBadge } from './hero/SocialProofBadge'

export default function Hero() {
  const { headline, subtitle, ctaPrimary, ctaWhatsapp, footer } = heroCopy

  return (
    <section className="hero-gradient pt-16 pb-20 px-6" aria-label="Sección principal">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <SocialProofBadge />

        <motion.h1
          className="font-headline font-extrabold text-4xl md:text-6xl text-primary leading-tight mb-6 tracking-tight"
          variants={fadeUpVariant}
        >
          {headline.before}{' '}
          <span className="text-primary md:text-secondary">{headline.highlight}</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-on-surface-variant font-medium mb-12 leading-relaxed"
          variants={fadeUpVariant}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-md md:max-w-sm mx-auto"
          variants={fadeUpVariant}
        >
          <div className="flex flex-col items-center gap-1.5 w-full">
            <a
              href={CTA_URL}
              className="cta-shimmer w-full bg-gradient-to-br from-primary to-primary-container md:[background-image:none] md:bg-secondary text-on-primary md:text-primary px-8 py-4 md:py-5 rounded-full md:rounded-2xl font-headline font-bold md:font-extrabold text-lg md:text-xl shadow-lg shadow-secondary/20 md:hover:shadow-xl md:hover:shadow-secondary/20 transition-shadow active:scale-95 flex items-center justify-center"
              aria-label={ctaPrimary.ariaLabel}
            >
              {ctaPrimary.label}
            </a>
            <p className="text-xs font-semibold text-on-surface-variant/70">
              {ctaPrimary.microcopy}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 w-full">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-surface-container-highest md:bg-surface-container-lowest md:border-2 md:border-surface-container text-primary md:text-on-surface px-8 py-4 rounded-full md:rounded-2xl font-headline font-bold text-lg hover:bg-surface-variant md:hover:bg-surface-bright transition-all active:scale-95 flex items-center justify-center gap-3"
              aria-label={ctaWhatsapp.ariaLabel}
            >
              <MdOutlineWhatsapp className="text-2xl text-secondary" aria-hidden="true" />
              {ctaWhatsapp.label}
            </a>
            <p className="text-xs font-semibold text-on-surface-variant/70">
              {ctaWhatsapp.microcopy}
            </p>
          </div>
        </motion.div>

        <motion.p
          className="mt-10 text-sm font-medium text-on-surface-variant/60 flex items-center justify-center gap-1.5"
          variants={fadeInVariant}
        >
          <MdOutlineVerified className="text-secondary text-lg" aria-hidden="true" />
          {footer}
        </motion.p>
      </motion.div>
    </section>
  )
}
