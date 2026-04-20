"use client";

import { motion } from "framer-motion";
import { testimonialItems } from "@/content/home";
import { VIEWPORT_ONCE, VIEWPORT_CLOSE } from "@/lib/animations";

export default function Testimonials() {
  return (
    <>
      {/* Desktop: grid de tarjetas */}
      <section
        className="hidden md:block py-16 px-6 bg-surface-container-lowest"
        aria-label="Testimonios de clientes"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-headline font-extrabold text-3xl text-primary mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            ¿Por qué VaroListo.mx?
          </motion.h2>

          <div className="grid grid-cols-3 gap-6">
            {testimonialItems.map((t, i) => (
              <motion.figure
                key={i}
                className="p-6 rounded-2xl bg-surface-container border border-surface-container-high cursor-default"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CLOSE}
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

      {/* Mobile: cita destacada */}
      <section
        className="md:hidden px-6 py-16 bg-primary text-white overflow-hidden relative"
        aria-label="Testimonio de cliente"
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-[120px] opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"
          aria-hidden="true"
        />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_CLOSE}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span
            className="material-symbols-outlined text-secondary-fixed text-6xl opacity-50"
            aria-hidden="true"
          >
            format_quote
          </span>

          <h2 className="font-headline font-extrabold text-3xl leading-tight mt-4">
            &ldquo;Buscaba lana para arreglar mi casa y en Varo
            <span className="text-secondary">Listo.mx</span> todo fue rápido y sin
            complicaciones.&rdquo;
          </h2>

          <div className="mt-8 flex items-center gap-4">
            <div>
              <p className="font-headline font-bold">Francisco García</p>
              <p className="text-primary-fixed-dim text-sm italic">
                Programador móvil - CDMX
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
