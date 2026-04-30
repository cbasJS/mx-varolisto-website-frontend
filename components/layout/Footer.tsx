"use client";

import { motion } from "framer-motion";
import { footerLinks } from "@/content/nav";
import BrandName from "@/components/layout/BrandName";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <motion.footer
      id="contacto"
      className="w-full py-12 px-6 bg-surface-container-lowest border-t border-surface-container pb-32 md:pb-12"
      aria-label="Pie de página"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <a href="/" className="font-headline font-extrabold text-primary text-xl">
            <BrandName />
          </a>

          <nav aria-label="Links del pie de página">
            <ul className="flex gap-8 font-body text-sm text-on-surface-variant font-medium">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-surface-container pt-8 space-y-2">
          <p className="text-xs text-on-surface-variant/60 leading-relaxed text-center md:text-left">
            <BrandName className="text-primary" /> no es una
            institución financiera. Este sitio tiene fines informativos. Las
            solicitudes están sujetas a evaluación y contacto directo. El uso de
            este sitio web implica la aceptación de nuestros términos y
            condiciones.
          </p>
          <p className="text-xs text-on-surface-variant/60 text-center md:text-left">
            © {currentYear} <BrandName className="text-primary" /> México.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
