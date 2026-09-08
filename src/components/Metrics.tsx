import React from "react";
import { m as motion } from "motion/react";
import { useTranslation } from "react-i18next";
import BlueDot from "./BlueDot";
import { YEARS_OF_LEGACY } from "../constants/brand";

const metrics = [
  { key: "years", value: `${YEARS_OF_LEGACY}+`, label: "anos de experiência" },
  { key: "projects", value: "500+", label: "projetos executados" },
  { key: "clients", value: "200+", label: "clientes ativos" },
  { key: "uptime", value: "99.9%", label: "disponibilidade" },
];

export default function Metrics() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-8 bg-surface-container border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tighter">
                {m.value}
              </div>
              <div className="text-[11px] text-primary-container font-bold uppercase tracking-widest">
                {t(`metrics.${m.key}`, m.label)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
