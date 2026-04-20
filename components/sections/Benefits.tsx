"use client";

import { motion } from "framer-motion";
import { benefitItems } from "@/content/home";
import { VIEWPORT_ONCE, VIEWPORT_CLOSE } from "@/lib/animations";

export default function Benefits() {
  return (
    <section
      id="beneficios"
      className="py-20 px-6 bg-surface-container-lowest"
      aria-label="Beneficios de VaroListo.mx"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-headline font-extrabold text-3xl text-primary mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          ¿Por qué Varo<span className="text-secondary">Listo.mx</span>?
        </motion.h2>

        <div className="grid grid-cols-1 gap-10">
          {benefitItems.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              className="flex gap-5 items-start"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT_CLOSE}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <motion.div
                className="w-12 h-12 shrink-0 bg-secondary/10 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.12, rotate: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                aria-hidden="true"
              >
                <span className="material-symbols-outlined text-3xl text-secondary">
                  {benefit.icon}
                </span>
              </motion.div>
              <div>
                <h3 className="font-headline font-bold text-xl text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
