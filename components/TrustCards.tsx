"use client"

import { motion } from "framer-motion"

const cards = [
  {
    icon: "mood",
    title: "Trato directo",
    description: "Hablamos tu idioma, sin términos complicados ni letras chiquitas.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: "verified",
    title: "100% Confiable",
    description: "Tus datos están seguros y los usamos solo para ayudarte.",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
]

export default function TrustCards() {
  return (
    <section className="px-6 py-10" aria-label="Por qué confiar en VaroListo">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
          >
            <div className={`${card.iconBg} p-3 rounded-xl shrink-0`} aria-hidden="true">
              <span className={`material-symbols-outlined text-3xl ${card.iconColor}`}>
                {card.icon}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-primary font-headline text-lg">{card.title}</h3>
              <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
