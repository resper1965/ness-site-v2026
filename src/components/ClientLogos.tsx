import { useTranslation } from "react-i18next";
import { CabecalhoDeSecao } from "./Abertura";

interface Client {
  name: string;
  url: string;
  sector: string;
}

/**
 * Wordmarks em texto: sem dependência do Clearbit (instável e em
 * descontinuação), sem requisições externas e legível em qualquer tema.
 * Trocar por SVGs locais quando houver autorização de uso de logotipo.
 *
 * No desenho delicado: lista alinhada à esquerda com linha de 1 px, em vez de
 * seis caixas centralizadas com o setor em caixa alta. O título fecha com o
 * ponto azul, que é o próprio ponto de "ness.".
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
      <div className="mx-auto max-w-7xl">
        <CabecalhoDeSecao titulo={t('clients.title', 'quem confia na ness')} />
        <ul className="grid grid-cols-2 gap-x-10 md:grid-cols-3 lg:grid-cols-6">
          {clients.map((client) => (
            <li key={client.name} className="border-t border-white/10">
              <a href={client.url} target="_blank" rel="noopener noreferrer" className="group block py-4">
                <span className="block font-display text-[15px] font-medium text-white/80 transition-colors group-hover:text-white">
                  {client.name}
                </span>
                <span className="text-[12.5px] text-on-surface-variant">{client.sector}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
