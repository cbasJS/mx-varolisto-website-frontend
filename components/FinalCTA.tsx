"use client";

import { motion } from "framer-motion";
import { MdOutlineWhatsapp } from "react-icons/md";
import { CTA_URL, WHATSAPP_URL } from "@/lib/config";

export default function FinalCTA() {
  return (
    <section
      className="py-24 px-6 bg-primary text-white overflow-hidden relative"
      aria-label="Solicita ahora"
    >
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <h2 className="font-headline font-extrabold text-4xl md:text-5xl mb-12 tracking-tight">
          Obtén opciones hoy mismo
        </h2>

        <div className="flex flex-col sm:flex-row items-start justify-center gap-6 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center gap-2 flex-1 w-full">
            <motion.a
              href={CTA_URL}
              className="cta-shimmer w-full bg-secondary text-primary px-8 py-5 rounded-2xl font-headline font-extrabold text-xl shadow-xl shadow-secondary/20 flex items-center justify-center"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              aria-label="Solicitar financiamiento ahora"
            >
              Solicitar ahora
            </motion.a>
            <p className="text-sm opacity-80">
              Empieza tu registro sin compromiso
            </p>
          </div>

          <div className="flex-1 w-full">
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-5 rounded-2xl font-headline font-extrabold text-xl flex items-center justify-center gap-3"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              aria-label="Hablar con un asesor por WhatsApp"
            >
              <MdOutlineWhatsapp className="text-2xl" aria-hidden="true" />
              WhatsApp
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
