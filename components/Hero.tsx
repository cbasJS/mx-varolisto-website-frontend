"use client";

import { motion, type Variants } from "framer-motion";
import { MdOutlineWhatsapp } from "react-icons/md";
import { CTA_URL, WHATSAPP_URL } from "@/lib/config";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export default function Hero() {
  return (
    <section
      className="hero-gradient pt-16 pb-20 px-6"
      aria-label="Sección principal"
    >
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Social proof badge */}
        <motion.div variants={fadeUp}>
          <div
            className="badge-bob inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full mb-8"
            aria-label="Más de 500 solicitudes procesadas hoy"
          >
            <span className="flex -space-x-1 shrink-0" aria-hidden="true">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300" />
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400" />
            </span>
            <span className="text-sm font-bold tracking-tight">
              Sin trámites complicados
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="font-headline font-extrabold text-4xl md:text-6xl text-primary leading-tight mb-6 tracking-tight"
          variants={fadeUp}
        >
          ¿Necesitas dinero rápido?{" "}
          <span className="text-secondary">
            Te ayudamos a encontrar opciones
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-on-surface-variant font-medium mb-12 leading-relaxed"
          variants={fadeUp}
        >
          Sin trámites complicados. Te contactamos en minutos.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full max-w-md mx-auto"
          variants={fadeUp}
        >
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-shimmer w-full bg-secondary text-primary px-8 py-4 rounded-2xl font-headline font-extrabold text-xl shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-shadow active:scale-95 flex items-center justify-center"
              aria-label="Solicitar financiamiento ahora"
            >
              Solicitar ahora
            </a>
            <p className="text-xs font-semibold text-on-surface-variant/70">
              Te toma menos de 2 minutos
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-1">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border-2 border-gray-100 text-on-surface px-8 py-4 rounded-2xl font-headline font-bold text-lg hover:bg-gray-50 hover:border-secondary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              aria-label="Hablar con un asesor por WhatsApp"
            >
              <MdOutlineWhatsapp
                className="text-2xl text-secondary"
                aria-hidden="true"
              />
              WhatsApp
            </a>
            <p className="text-xs font-semibold text-on-surface-variant/70">
              Te respondemos lo antes posible
            </p>
          </div>
        </motion.div>

        <motion.p
          className="mt-10 text-sm font-medium text-on-surface-variant/60 flex items-center justify-center gap-1.5"
          variants={fadeIn}
        >
          <span
            className="material-symbols-outlined text-secondary text-base"
            aria-hidden="true"
          >
            verified
          </span>
          Atención personalizada en todo México
        </motion.p>
      </motion.div>
    </section>
  );
}
