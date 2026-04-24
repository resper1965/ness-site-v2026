import React from "react";
import { motion } from "motion/react";
import BlueDot from "./BlueDot";

interface Client {
  name: string;
  url: string;
  logo: string;
}

const clients: Client[] = [
  {
    name: "Alupar",
    url: "https://alupar.com.br",
    logo: "https://logo.clearbit.com/alupar.com.br",
  },
  {
    name: "Leite Tosto e Barros",
    url: "https://tostoadv.com",
    logo: "https://logo.clearbit.com/tostoadv.com",
  },
  {
    name: "Target Trading",
    url: "https://targettrading.com.br",
    logo: "https://logo.clearbit.com/targettrading.com.br",
  },
  {
    name: "Ionic Health",
    url: "https://ionic.health",
    logo: "https://logo.clearbit.com/ionic.health",
  },
  {
    name: "TNE",
    url: "https://tnesa.com.br",
    logo: "https://logo.clearbit.com/tnesa.com.br",
  },
  {
    name: "TBE",
    url: "https://tbe.com.br",
    logo: "https://logo.clearbit.com/tbe.com.br",
  },
];

export default function ClientLogos() {
  return (
    <section className="py-20 px-8 bg-surface border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[10px] text-primary-container font-bold uppercase tracking-widest block mb-3">
            quem confia na ness.
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-white tracking-tight lowercase">
            empresas que transformamos<BlueDot />
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, i) => (
            <motion.a
              key={client.name}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              title={client.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group flex items-center justify-center h-20 px-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary-container/20 hover:bg-white/[0.04] transition-all"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-10 max-w-[120px] object-contain brightness-0 invert opacity-40 group-hover:opacity-80 transition-opacity"
                onError={(e) => {
                  // Fallback to text if logo fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const span = document.createElement('span');
                    span.className = 'text-xs font-display text-white/40 group-hover:text-white/80 uppercase tracking-widest transition-colors';
                    span.textContent = client.name;
                    parent.appendChild(span);
                  }
                }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
