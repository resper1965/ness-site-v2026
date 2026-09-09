import React from "react";
import { useTranslation } from "react-i18next";
import BlueDot from "./BlueDot";

interface Client {
  name: string;
  url: string;
  sector: string;
}

/**
 * Wordmarks em texto: sem dependência do Clearbit (instável e em
 * descontinuação), sem requisições externas e legível em qualquer tema.
 * Trocar por SVGs locais quando houver autorização de uso de logotipo.
 */
const clients: Client[] = [
  { name: "Alupar", url: "https://alupar.com.br", sector: "energia" },
  { name: "Leite Tosto e Barros", url: "https://tostoadv.com", sector: "jurídico" },
  { name: "Target Trading", url: "https://targettrading.com.br", sector: "mercado financeiro" },
  { name: "Ionic Health", url: "https://ionic.health", sector: "saúde" },
  { name: "TNE", url: "https://tnesa.com.br", sector: "energia" },
  { name: "TBE", url: "https://tbe.com.br", sector: "energia" },
];

export default function ClientLogos() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-6 md:px-8 bg-surface border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] text-primary-container font-bold lowercase tracking-widest block mb-3">
            {t('clients.eyebrow', 'quem confia na ness.')}
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-white tracking-tight lowercase">
            {t('clients.title', 'empresas que transformamos')}<BlueDot />
          </h2>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {clients.map((client) => (
            <li key={client.name}>
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-1 h-24 px-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary-container/30 hover:bg-white/[0.04] transition-colors text-center"
              >
                <span className="font-display font-semibold text-white/70 group-hover:text-white text-base tracking-tight transition-colors">
                  {client.name}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-on-surface-variant/70">{client.sector}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
