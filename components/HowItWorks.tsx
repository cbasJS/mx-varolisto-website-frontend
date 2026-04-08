"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Deja tus datos",
    description: "Completa el formulario en menos de 2 min.",
    accent: false,
  },
  {
    number: "2",
    title: "Evaluamos tu perfil",
    description: "Análisis inmediato para encontrar tu mejor opción.",
    accent: false,
  },
  {
    number: "3",
    title: "Te contactamos",
    description:
      "¡Listo! Nos ponemos en contacto contigo para darte los detalles.",
    accent: true,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="py-24 px-6 bg-surface-container"
      aria-label="Cómo funciona VaroListo"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-headline font-extrabold text-3xl text-primary mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          ¿Cómo funciona?
        </motion.h2>

        <ol className="relative space-y-16" aria-label="Pasos del proceso">
          <div
            className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-outline-variant/30"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <motion.li
              key={step.number}
              className="relative flex gap-8 items-center"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
            >
              <motion.div
                className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-extrabold text-xl z-10 shadow-lg ${
                  step.accent
                    ? "bg-secondary text-primary step-accent-glow"
                    : "bg-primary text-white"
                }`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: i * 0.12 + 0.1,
                }}
                aria-label={`Paso ${step.number}`}
              >
                {step.number}
              </motion.div>
              <div>
                <h3 className="font-headline font-bold text-2xl text-primary">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant mt-1">
                  {step.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
