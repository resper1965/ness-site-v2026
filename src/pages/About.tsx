import BlueDot from '../components/BlueDot';
import CTA from '../components/CTA';
import Metrica from '../components/Metrica';
import { useTranslation, Trans } from "react-i18next";
import { routeMeta } from '../utils/meta';
import { Target, Eye, Heart } from "lucide-react";

import { FOUNDATION_YEAR, anosDeLegado } from '../constants/brand';

const About = () => {
  const { t } = useTranslation();

  const timeline = [
    { year: "1991", desc: t('about.timeline.1991', "ness. é fundada como terceirização da área de tecnologia de um grande grupo econômico.") },
    { year: "1992", desc: t('about.timeline.1992', "Início das atividades de infraestrutura crítica, processamento de dados e BPO em larga escala.") },
    { year: "2004", desc: t('about.timeline.2004', "Expansão global: infraestrutura em grandes eventos por diversos países da Europa, Américas, África e Ásia.") },
    { year: "2012", desc: t('about.timeline.2012', "Pioneirismo no início de serviços especializados de privacidade e segurança digital avançada.") },
    { year: "2015", desc: t('about.timeline.2015', "Lançamento da divisão de software e processos, focada em engenharia digital de alta performance.") },
    { year: "2016", desc: t('about.timeline.2016', "Incubação da NESS Technology Healthcare (que viria a se tornar a IONIC Health).") },
    { year: "2017", desc: t('about.timeline.2017', "Incubação da Trustness como unidade de negócios estratégica para GRC.") },
    { year: "2022", desc: t('about.timeline.2022', "Incubação da forense.io como unidade de negócios líder em investigação digital.") },
    { year: "2024", desc: t('about.timeline.2024', "Estabelecida como uma plataforma modular para transformação digital confiável e segura.") },
    { year: "2026", desc: t('about.timeline.2026', "Início da operação de IA e Agentes, consolidando a ness. como líder em orquestração de conhecimento inteligente.") }
  ];

  const pillars = [
    { icon: Target, key: 'mission', title: t('about.mission'), desc: t('about.mission_desc') },
    { icon: Eye,    key: 'vision',  title: t('about.vision'),  desc: t('about.vision_desc') },
    { icon: Heart,  key: 'values',  title: t('about.values'),  desc: t('about.values_desc', "Excelência técnica inegociável, inovação constante e aplicada, parceria verdadeira e transparente, resultados reais e mensuráveis.") }
  ];

  // Sem entrada animada no topo: o texto saía do servidor em opacity 0 e só
  // aparecia depois do JavaScript, o que atrasava o LCP e deixava a página em
  // branco sem JS.
  return (
    <div className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen">
      {/* Background image — subtle */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-nebula" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/50 via-surface-container-lowest/90 to-surface-container-lowest z-10" />
      </div>

      <div className="max-w-6xl mx-auto space-y-28 relative z-20">

        {/* ── Hero ────────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <p className="text-primary-container font-mono text-[11px] uppercase tracking-[0.3em] mb-5">
            since {FOUNDATION_YEAR} — {anosDeLegado()} {t('about.years_label', 'anos de operação')}
          </p>

          <h1 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight leading-[1.1] mb-6 lowercase">
            <Trans
              i18nKey="about.subtitle"
              components={{ highlight: <span className="text-primary-container" /> }}
            /><BlueDot />
          </h1>

          <p className="text-base md:text-lg text-on-surface-variant font-normal leading-relaxed max-w-xl">
            {t('about.desc')}
          </p>
        </div>

        {/* ── Mission / Vision / Values ────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-8 border-y border-white/5 py-16">
          {pillars.map(({ icon: Icon, key, title, desc }, i) => (
            <div key={key}
              className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center">
                <Icon className="text-primary-container" size={20} aria-hidden="true" />
              </div>
              <h2 className="text-base font-display font-semibold text-white lowercase tracking-tight">
                {title}<BlueDot />
              </h2>
              <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Metrics ──────────────────────────────────────────────
            Só os números confirmados em 09/09/2026 (docs/PESQUISA-metricas.md).
            Saíram o número de países, sem fonte, e o de disponibilidade rotulado
            como SLA: prazo e SLA ficam na proposta. O selo de certificação saiu
            junto: certificação só vai ao ar com nome, escopo e ano. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/5 pt-16 mt-8 mb-16">
          <Metrica value={anosDeLegado()} label={t('about.metrics.legacy', 'anos de operação')} suffix="+" />
          <Metrica value={500} label={t('about.metrics.projects', 'projetos')} suffix="+" />
          <Metrica value={200} label={t('about.metrics.clients', 'clientes ativos')} suffix="+" />
        </div>

        {/* ── Timeline ─────────────────────────────────────────── */}
        <section>
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-2xl font-display font-medium text-white sticky top-32 tracking-tight lowercase">
                {t('about.history_title')}<BlueDot />
              </h2>
              <p className="mt-4 text-sm text-on-surface-variant font-normal leading-relaxed sticky top-52">
                {anosDeLegado()} {t('about.history_sub', 'anos construindo a base tecnológica de grandes corporações e eventos globais.')}
              </p>
            </div>

            <div className="md:w-2/3 space-y-10">
              {timeline.map((item, i) => (
                <div key={i}
                  className="flex gap-10 group">
                  <div className="w-16 shrink-0 text-primary-container font-mono text-sm font-medium pt-0.5">
                    {item.year}
                  </div>
                  <div className="relative pb-10 border-l border-white/8 pl-10 group-last:border-transparent">
                    <div className="absolute top-2.5 -left-[5px] w-2 h-2 rounded-full bg-primary-container" aria-hidden="true" />
                    <p className="text-sm text-white font-normal leading-relaxed group-hover:text-primary-container transition-colors duration-200">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </div>
    </div>
  );
};

export default About;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    return {
    // Sem a marca no título: ela vem do sufixo, e esta página é servida
    // pelos três domínios.
    title: { pt: 'sobre', en: 'about', es: 'sobre' }[lang],
    description: {
      pt: 'Desde 1991, a ness. entrega engenharia de software, operações de segurança 24×7, infraestrutura crítica, LGPD e perícia digital para empresas no Brasil, Portugal, Chile, Peru, Colômbia e EUA.',
      en: 'Since 1991, ness. has delivered software engineering, 24×7 security operations, critical infrastructure, privacy compliance and digital forensics for companies in Brazil, Portugal, Chile, Peru, Colombia and the US.',
      es: 'Desde 1991, ness. entrega ingeniería de software, operaciones de seguridad 24×7, infraestructura crítica, privacidad y peritaje digital para empresas en Brasil, Portugal, Chile, Perú, Colombia y EE. UU.',
    }[lang],
  };
  });
}
