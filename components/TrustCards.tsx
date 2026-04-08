"use client";

import { motion } from "framer-motion";

const cards = [
  {
    icon: "mood",
    title: "Trato directo",
    description:
      "Hablamos tu idioma, sin términos complicados ni letras chiquitas.",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    icon: "verified",
    title: "100% Confiable",
    description: "Tus datos están seguros y los usamos solo para ayudarte.",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-on-secondary-fixed",
  },
];

export default function TrustCards() {
  return (
    <section
      className="md:hidden px-6 py-8"
      aria-label="Por qué confiar en VaroListo"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="bg-surface-container-lowest p-6 rounded-mobile-xl shadow-sm flex items-start gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
          >
            <div
              className={`${card.iconBg} p-3 rounded-mobile-xl ${card.iconColor}`}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined !text-3xl">
                {card.icon}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-primary font-headline text-lg">
                {card.title}
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
