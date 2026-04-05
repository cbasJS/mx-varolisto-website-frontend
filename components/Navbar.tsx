"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CTA_URL } from "@/lib/config"

const navLinks = [
  { label: "Beneficios", href: "beneficios" },
  { label: "Cómo funciona", href: "como-funciona" },
  { label: "Contacto", href: "contacto" },
]

const NAVBAR_HEIGHT = 72

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
  window.scrollTo({ top, behavior: "smooth" })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-shadow duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav
        className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto"
        aria-label="Navegación principal"
      >
        <a
          href="/"
          className="text-xl font-extrabold text-primary font-headline tracking-tight"
          aria-label="VaroListo - Inicio"
        >
          VaroListo
        </a>

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollToSection(href)}
              className="text-on-surface-variant font-medium font-headline text-sm hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              {label}
            </button>
          ))}
        </div>

        <a
          href={CTA_URL}
          className="bg-secondary text-primary px-5 py-2 rounded-full font-headline font-bold text-sm hover:brightness-95 transition-all active:scale-95"
          aria-label="Solicitar préstamo ahora"
        >
          Solicitar ahora
        </a>
      </nav>
    </motion.header>
  )
}
