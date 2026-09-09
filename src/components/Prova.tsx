import { m as motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { anosDeLegado } from '../constants/brand';

/**
 * A faixa de prova: números e alcance numa seção só.
 *
 * Eram duas — presença global e métricas —, uma logo abaixo da outra, dizendo
 * a mesma coisa em dois formatos: "somos grandes e antigos". Juntas, ocupam
 * uma tela em vez de duas e o visitante lê a prova de uma vez.
 *
 * ponytail: os números vêm de constante. Quando a pesquisa de métricas
 * (docs/PESQUISA-metricas.md) devolver as fontes, eles ganham origem — e os
 * que não tiverem fonte saem.
 */
const NUMEROS = [
  { chave: 'years', valor: `${anosDeLegado()}+`, rotulo: 'anos de experiência' },
  { chave: 'projects', valor: '500+', rotulo: 'projetos executados' },
  { chave: 'clients', valor: '200+', rotulo: 'clientes ativos' },
  { chave: 'uptime', valor: '99.9%', rotulo: 'disponibilidade' },
];

export default function Prova() {
  const { t } = useTranslation();

  const paises = [
    t('presence.locations.brazil'),
    t('presence.locations.portugal'),
    t('presence.locations.chile'),
    t('presence.locations.peru'),
    t('presence.locations.colombia'),
    t('presence.locations.usa'),
  ];

  return (
    <section className="py-16 px-8 bg-surface-container border-y border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {NUMEROS.map((n, i) => (
            <motion.div
              key={n.chave}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tighter">
                {n.valor}
              </div>
              <div className="text-[11px] text-primary-container font-bold uppercase tracking-widest">
                {t(`metrics.${n.chave}`, n.rotulo)}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Globe className="text-primary-container" size={16} aria-hidden="true" />
            <span className="text-on-surface-variant text-[11px] tracking-widest uppercase font-bold">
              {t('presence.global')}
            </span>
          </div>
          {paises.map((pais) => (
            <span key={pais} className="text-on-surface-variant text-sm lowercase-all">
              {pais}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
