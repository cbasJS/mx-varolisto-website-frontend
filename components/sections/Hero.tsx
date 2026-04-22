"use client";

import { motion } from "framer-motion";
import { MdOutlineWhatsapp, MdOutlineVerified } from "react-icons/md";
import { CTA_URL, WHATSAPP_URL } from "@/lib/config";
import { staggerContainer, fadeUpVariant, fadeInVariant } from "@/lib/animations";

export default function Hero() {
  return (
    <section
      className="hero-gradient pt-16 pb-20 px-6"
      aria-label="Sección principal"
    >
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Social proof badge */}
        <motion.div variants={fadeUpVariant}>
          <div
            className="badge-bob inline-flex items-center gap-2 bg-secondary-container md:bg-primary/5 text-on-secondary-container md:text-primary px-4 py-1.5 rounded-full mb-6 md:mb-8"
            aria-label="Estamos de tu lado"
          >
            {/* Mobile only */}
            <span className="flex items-center gap-2 md:hidden">
              <span
                className="material-symbols-outlined text-lg"
                aria-hidden="true"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                thumb_up
              </span>
              <span className="text-sm font-semibold">Estamos de tu lado</span>
            </span>
            {/* Desktop only */}
            <span className="hidden md:inline text-sm font-bold tracking-tight">
              Sin trámites complicados
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="font-headline font-extrabold text-4xl md:text-6xl text-primary leading-tight mb-6 tracking-tight"
          variants={fadeUpVariant}
        >
          Cuando necesitas dinero,{" "}
          <span className="text-primary md:text-secondary">aquí empiezas</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-on-surface-variant font-medium mb-12 leading-relaxed"
          variants={fadeUpVariant}
        >
          Sin trámites complicados. Te contactamos en minutos.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-md md:max-w-sm mx-auto"
          variants={fadeUpVariant}
        >
          <div className="flex flex-col items-center gap-1.5 w-full">
            <a
              href={CTA_URL}
              className="cta-shimmer w-full bg-gradient-to-br from-primary to-primary-container md:[background-image:none] md:bg-secondary text-on-primary md:text-primary px-8 py-4 md:py-5 rounded-full md:rounded-2xl font-headline font-bold md:font-extrabold text-lg md:text-xl shadow-lg shadow-secondary/20 md:hover:shadow-xl md:hover:shadow-secondary/20 transition-shadow active:scale-95 flex items-center justify-center"
              aria-label="Solicitar financiamiento ahora"
            >
              Solicitar ahora
            </a>
            <p className="text-xs font-semibold text-on-surface-variant/70">
              Te toma menos de 2 minutos
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 w-full">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-surface-container-highest md:bg-surface-container-lowest md:border-2 md:border-surface-container text-primary md:text-on-surface px-8 py-4 rounded-full md:rounded-2xl font-headline font-bold text-lg hover:bg-surface-variant md:hover:bg-surface-bright transition-all active:scale-95 flex items-center justify-center gap-3"
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
          variants={fadeInVariant}
        >
          <MdOutlineVerified
            className="text-secondary text-lg"
            aria-hidden="true"
          />
          Atención personalizada en todo México
        </motion.p>
      </motion.div>
    </section>
  );
}
