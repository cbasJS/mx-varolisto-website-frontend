"use client";

import { motion } from "framer-motion";

const testimonials = [
  { quote: "Te contactamos en minutos" },
  { quote: "Proceso rápido y claro" },
  { quote: "Sin trámites complicados" },
];

export default function Testimonials() {
  return (
    <section
      className="py-16 px-6 bg-white"
      aria-label="Testimonios de clientes"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-headline font-extrabold text-3xl text-primary mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          ¿Por qué VaroListo?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              className="p-6 rounded-2xl bg-surface-container border border-gray-100 cursor-default"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 32px -8px rgba(0,6,102,0.10)",
              }}
            >
              <blockquote className="italic text-primary font-medium leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
