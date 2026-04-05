"use client"

import { motion } from "framer-motion"

const benefits = [
  {
    icon: "bolt",
    title: "Proceso sencillo",
    description:
      "Olvídate de las filas y el papeleo excesivo. Todo es digital y diseñado para tu comodidad.",
  },
  {
    icon: "speed",
    title: "Evaluación rápida",
    description:
      "Nuestra tecnología evalúa tu perfil en segundos para ofrecerte las mejores alternativas.",
  },
  {
    icon: "dashboard_customize",
    title: "Opciones personalizadas",
    description:
      "Encontramos diferentes esquemas de financiamiento que se adaptan a tu perfil y necesidades.",
  },
  {
    icon: "support_agent",
    title: "Atención directa",
    description:
      "Te contactamos personalmente para guiarte en cada paso del camino con total transparencia.",
  },
]

export default function Benefits() {
  return (
    <section id="beneficios" className="py-20 px-6 bg-white" aria-label="Beneficios de VaroListo">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-headline font-extrabold text-3xl text-primary mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          ¿Por qué VaroListo?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              className="flex gap-5 items-start"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <motion.div
                className="w-12 h-12 shrink-0 bg-secondary/10 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.12, rotate: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                aria-hidden="true"
              >
                <span className="material-symbols-outlined text-3xl text-secondary">
                  {benefit.icon}
                </span>
              </motion.div>
              <div>
                <h3 className="font-headline font-bold text-xl text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
