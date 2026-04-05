"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    quote:
      "Proceso rápido y claro. Me contactaron muy rápido y resolvieron mis dudas de inmediato.",
    author: "Roberto M.",
    location: "CDMX",
  },
  {
    quote:
      "Me contactaron muy rápido y me mostraron opciones que se ajustaban a lo que buscaba.",
    author: "Elena G.",
    location: "Monterrey",
  },
  {
    quote:
      "Andaba corto de lana y en VaroListo me echaron la mano súper rápido. Sin tanta vuelta.",
    author: "Ricardo Mendoza",
    location: "Comerciante — CDMX",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 px-6 bg-white" aria-label="Testimonios de clientes">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-headline font-extrabold text-3xl text-primary mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Lo que dicen nuestros usuarios
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.author}
              className="p-6 rounded-2xl bg-surface-container border border-gray-100 cursor-default"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(0,6,102,0.10)" }}
            >
              <blockquote className="italic text-primary font-medium mb-4 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm font-bold text-on-surface-variant not-italic">
                — {t.author}
                {t.location && <span className="font-normal">, {t.location}</span>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
