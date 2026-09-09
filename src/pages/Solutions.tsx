import BlueDot, { NomeDeProduto } from '../components/BlueDot';
import { m as motion } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeMeta, traduzir } from '../utils/meta';
import { ShieldCheck, Cloud, Cpu, Brain, ArrowRight, Gavel } from "lucide-react";




const Solutions = () => {
  const { t } = useTranslation();
  const solutions = [
    {
      slug: "secops",
      title: "n.secops",
      desc: t('solutions.secops.desc'),
      icon: ShieldCheck,
      highlight: true,
      colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
      slug: "infraops",
      title: "n.infraops",
      desc: t('solutions.infraops.desc'),
      icon: Cloud,
      colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
      slug: "devarch",
      title: "n.devarch",
      desc: t('solutions.devarch.desc'),
      icon: Cpu,
      colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
      slug: "autoops",
      title: "n.autoops",
      desc: t('solutions.autoops.desc'),
      icon: Brain,
      colSpan: "md:col-span-2 lg:col-span-3"
    },
    {
      slug: "cirt",
      title: "n.cirt",
      desc: t('solutions.cirt.desc'),
      icon: Gavel,
      accent: true,
      colSpan: "md:col-span-2 lg:col-span-3"
    }
  ];

  return (
    <section id="soluções" className="py-24 bg-surface px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-display font-semibold text-white tracking-tighter lowercase-all">
            {t('nav.solutions')}<BlueDot />
          </h2>
          <div className="w-16 h-px bg-primary-container mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {solutions.map((s, i) => (
            <Link
              key={i}
              to={`/solucoes/${s.slug}`}
              className={`${s.colSpan} ${s.highlight ? 'border-l-2 border-primary-container' : 'border-white/5'} ${s.accent ? 'bg-primary-container/5 border-primary-container/20' : 'bg-surface-container-low/50 border-white/5'} p-8 rounded-3xl border flex flex-col justify-between hover:bg-surface-container-high transition-all group cursor-pointer`}
            >
              <motion.div whileHover={{ y: -5 }}>
                <s.icon className="text-primary-container mb-6" size={32} />
                <h3 className="text-2xl mb-4 text-white font-brand font-medium lowercase-all">
                  <NomeDeProduto nome={s.title} />
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-normal">
                  {s.desc}
                </p>
                <div className="mt-8 flex items-center gap-2 text-[11px] text-primary-container uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  ver detalhes <ArrowRight size={14} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Solutions;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    const t = traduzir(lang);
    return {
    title: t('nav.solutions', 'soluções'),
    description: {
      pt: 'As cinco soluções da ness.: SOC 24×7, infraestrutura e cloud, engenharia de software, automação de operações e resposta a incidentes.',
      en: "ness.'s five solutions: 24×7 SOC, infrastructure and cloud, software engineering, operations automation and incident response.",
      es: 'Las cinco soluciones de ness.: SOC 24×7, infraestructura y cloud, ingeniería de software, automatización de operaciones y respuesta a incidentes.',
    }[lang],
  };
  });
}
