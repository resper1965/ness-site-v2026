import type { ReactNode } from 'react';
import { useTranslation } from "react-i18next";
import { CabecalhoDeSecao } from "./Abertura";
import { sequencia } from "../utils/movimento";

interface Client {
  name: string;
  url: string;
  sector: string;
  /**
   * O logotipo em SVG monocromático, quando houver autorização de uso da
   * marca (pendência do Ricardo). Sem ele, a faixa mostra o wordmark em
   * texto — a faixa aceita os dois (ESTUDO-desktop-wow, C4).
   */
  logo?: ReactNode;
}

/**
 * A faixa de seis (docs/ESTUDO-desktop-wow.md, C4): os clientes numa linha
 * só, na largura inteira da grade, cada marca a 60 % de branco que vira azul
 * sob o mouse. Sem dependência do Clearbit (instável e em descontinuação),
 * sem requisições externas e legível em qualquer tema.
 *
 * No desenho delicado: linha de 1 px em cima de cada marca, o setor abaixo, e
 * o título fecha com o ponto azul, que é o próprio ponto de "ness.".
 */
const clients: Client[] = [
  { name: "Alupar", url: "https://alupar.com.br", sector: "energia" },
  { name: "Leite Tosto e Barros", url: "https://tostoadv.com", sector: "jurídico" },
  { name: "Target Trading", url: "https://targettrading.com.br", sector: "logística" },
  { name: "Ionic Health", url: "https://ionic.health", sector: "saúde" },
  { name: "TNE", url: "https://tnesa.com.br", sector: "energia" },
  { name: "TBE", url: "https://tbe.com.br", sector: "energia" },
];

export default function ClientLogos() {
  const { t } = useTranslation();
  return (
    <section className="bg-surface px-8 py-24">
      <div className="mx-auto max-w-7xl secao-grade gap-y-10">
        <div className="cabecalho-fixo">
          <CabecalhoDeSecao titulo={t('clients.title', 'quem confia na ness')} />
        </div>
        {/* Seis colunas na largura inteira a partir de 1024 px: 186 px por
            marca, o bastante para "Leite Tosto e Barros" em duas linhas
            equilibradas. Abaixo disso, três e depois duas. */}
        <ul className="faixa-grade grid grid-cols-2 gap-x-8 md:grid-cols-3 lg:grid-cols-6">
          {clients.map((client, i) => (
            <li key={client.name} className="filete filete-acende revela border-t border-white/10" style={sequencia(i)}>
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-5 transition-transform duration-[250ms] hover:-translate-y-0.5"
              >
                <span className="block min-h-[2.6em] text-balance font-display text-nome font-medium leading-tight text-white/60 transition-colors duration-[150ms] group-hover:text-primary-container">
                  {client.logo ?? client.name}
                </span>
                <span className="mt-2 block text-[12.5px] text-on-surface-variant">{client.sector}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
