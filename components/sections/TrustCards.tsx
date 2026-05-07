'use client'

import { motion } from 'framer-motion'
import { trustCardItems } from '@/content/home'
import { VIEWPORT_CLOSE } from '@/lib/animations'

export default function TrustCards() {
  return (
    <section className="md:hidden px-6 py-8" aria-label="Por qué confiar en VaroListo.mx">
      <div className="grid grid-cols-1 gap-4 max-w-7xl mx-auto">
        {trustCardItems.map((card, i) => (
          <motion.div
            key={card.title}
            className="bg-surface-container-lowest p-6 rounded-mobile-xl shadow-sm flex items-start gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_CLOSE}
            transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
          >
            <div
              className={`${card.iconBg} p-3 rounded-mobile-xl ${card.iconColor}`}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined !text-3xl">{card.icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-primary font-headline text-lg">{card.title}</h3>
              <p className="text-on-surface-variant text-sm mt-1">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
