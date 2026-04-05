"use client"

import { motion } from "framer-motion"
import { CTA_URL, WHATSAPP_URL } from "@/lib/config"

export default function BottomNav() {
  return (
    <motion.div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex items-center px-4 py-3 gap-2"
      role="navigation"
      aria-label="Acciones rápidas"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.45, ease: "easeOut" }}
    >
      <motion.a
        href={CTA_URL}
        className="cta-shimmer flex-1 flex items-center justify-center gap-2 bg-secondary text-primary rounded-full py-3 px-4 font-headline font-bold text-sm shadow-lg"
        whileTap={{ scale: 0.95 }}
        aria-label="Solicitar préstamo ahora"
      >
        <span
          className="material-symbols-outlined text-lg"
          aria-hidden="true"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          bolt
        </span>
        Solicitar ahora
      </motion.a>

      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl transition-colors"
        whileTap={{ scale: 0.9 }}
        whileHover={{ color: "#000666" }}
        aria-label="Hablar por WhatsApp"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          chat
        </span>
        <span className="font-body text-[10px] font-semibold mt-0.5">WhatsApp</span>
      </motion.a>
    </motion.div>
  )
}
