"use client";

import { motion } from "framer-motion";

export default function MobileTestimonial() {
  return (
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
        viewport={{ once: true, margin: "-60px" }}
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
  );
}
