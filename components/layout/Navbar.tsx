"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CTA_URL, NAVBAR_HEIGHT } from "@/lib/config";
import { useScrolled } from "@/hooks/useScrolled";
import { navLinks } from "@/content/nav";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrolled();

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-shadow duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-surface-container"
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
          className="text-xl md:text-2xl font-extrabold text-primary font-headline tracking-tight"
          aria-label="VaroListo.mx - Inicio"
        >
          Varo<span className="text-secondary">Listo.mx</span>
        </a>

        {isHome && (
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
        )}

        {isHome && (
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-on-primary md:bg-secondary md:text-primary px-6 md:px-5 py-2 rounded-full font-headline font-bold text-sm hover:opacity-80 md:hover:opacity-100 md:hover:brightness-95 transition-opacity md:transition-all duration-150 active:scale-95"
            aria-label="Solicitar préstamo ahora"
          >
            Solicitar ahora
          </a>
        )}
      </nav>
    </motion.header>
  );
}
