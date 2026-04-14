import BlueDot from '../components/BlueDot';
import CTA from '../components/CTA';
import React, {  } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
Target,
  Eye,
  Heart} from "lucide-react";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;



const About = () => {
  const { t } = useTranslation();
  const timeline = [
    { year: "1991", desc: t('about.timeline.1991', "ness. é fundada como terceirização da área de tecnologia de um grande grupo econômico.") },
    { year: "1992", desc: t('about.timeline.1992', "Início das atividades de infraestrutura crítica, processamento de dados e BPO em larga escala.") },
    { year: "2004", desc: t('about.timeline.2004', "Expansão global: infraestrutura em grandes eventos por diversos países da Europa, Américas, África e Ásia.") },
    { year: "2012", desc: t('about.timeline.2012', "Pioneirismo no início de serviços especializados de privacidade e segurança digital avançada.") },
    { year: "2015", desc: t('about.timeline.2015', "Lançamento da divisão de software e processos, focada em engenharia digital de alta performance.") },
    { year: "2016", desc: t('about.timeline.2016', "Incubação da NESS Technology healthcare (que viria a se tornar a IONIC Health).") },
    { year: "2017", desc: t('about.timeline.2017', "Incubação da Trustness como unidade de negócios estratégica para GRC.") },
    { year: "2022", desc: t('about.timeline.2022', "Incubação da forense.io como unidade de negócios líder em investigação digital.") },
    { year: "2024", desc: t('about.timeline.2024', "Estabelecida como uma plataforma modular para transformação digital confiável e segura.") },
    { year: "2026", desc: t('about.timeline.2026', "Início da operação de IA e Agentes, consolidando a ness. como líder em orquestração de conhecimento inteligente.") }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Immersive Background for About Page */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
          alt="Ness Office Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-32 relative z-20">
        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-4xl">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
            >
              {YEARS_OF_LEGACY} {t('footer.rights').includes('reservados') ? 'anos de excelência' : 'years of excellence'} — since 1991
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-display font-semibold text-white tracking-tighter leading-[0.9] mb-12 lowercase-all">
              {t('about.subtitle')}<BlueDot />
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl">
              {t('about.desc')}
            </p>
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        </div>

        {/* Mission, Vision, Values Section */}
        <div className="grid md:grid-cols-3 gap-12 border-y border-white/5 py-24">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
              <Target className="text-primary-container" size={24} />
            </div>
            <h3 className="text-2xl font-display font-bold text-white lowercase-all">{t('about.mission')}<BlueDot /></h3>
            <p className="text-on-surface-variant font-light leading-relaxed">
              {t('about.mission_desc')}
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
              <Eye className="text-primary-container" size={24} />
            </div>
            <h3 className="text-2xl font-display font-bold text-white lowercase-all">{t('about.vision')}<BlueDot /></h3>
            <p className="text-on-surface-variant font-light leading-relaxed">
              {t('about.vision_desc')}
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
              <Heart className="text-primary-container" size={24} />
            </div>
            <h3 className="text-2xl font-display font-bold text-white lowercase-all">{t('about.values')}<BlueDot /></h3>
            <ul className="space-y-3 text-on-surface-variant font-light">
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary-container"></div> {t('services.title').includes('profissionais') ? 'excelência técnica inegociável' : 'unnegotiable technical excellence'}</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary-container"></div> {t('services.title').includes('profissionais') ? 'inovação constante e aplicada' : 'constant and applied innovation'}</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary-container"></div> {t('services.title').includes('profissionais') ? 'parceria verdadeira e transparente' : 'true and transparent partnership'}</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary-container"></div> {t('services.title').includes('profissionais') ? 'resultados reais e mensuráveis' : 'real and measurable results'}</li>
            </ul>
          </div>
        </div>

        {/* Values Detail Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Excelência Técnica", desc: "Buscamos sempre a excelência em cada projeto, utilizando as melhores práticas e tecnologias mais avançadas do mercado global." },
            { title: "Inovação Constante", desc: "Estamos sempre à frente das tendências tecnológicas, implementando soluções que antecipam o futuro dos nossos clientes." },
            { title: "Parceria Verdadeira", desc: "Construímos relacionamentos duradouros baseados em confiança mútua, transparência total e resultados excepcionais." },
            { title: "Resultados Mensuráveis", desc: "Focamos em entregar valor real e quantificável, com métricas claras de sucesso para cada desafio superado." }
          ].map((value, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-surface-container-low/30 border border-white/5 hover:bg-surface-container-low/50 transition-all"
            >
              <h3 className="text-primary-container font-bold text-[10px] uppercase tracking-widest mb-4">{value.title}</h3>
              <p className="text-white text-sm font-light leading-relaxed opacity-80">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-4xl font-display font-semibold text-white sticky top-32 tracking-tighter lowercase-all">
                {t('about.history_title')}<BlueDot />
              </h2>
              <p className="mt-6 text-on-surface-variant font-light leading-relaxed sticky top-56">
                {YEARS_OF_LEGACY} anos construindo a base tecnológica de grandes corporações e eventos globais.
              </p>
            </div>
            <div className="md:w-2/3 space-y-12">
              {timeline.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-12 group"
                >
                  <div className="w-20 shrink-0 text-primary-container font-mono text-lg font-bold pt-1">{item.year}</div>
                  <div className="relative pb-12 border-l border-white/10 pl-12 group-last:border-transparent">
                    <div className="absolute top-3 -left-[5px] w-2 h-2 rounded-full bg-primary-container shadow-[0_0_10px_rgba(0,173,232,0.5)]"></div>
                    <p className="text-white text-lg font-light leading-relaxed group-hover:text-primary-container transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </div>
    </motion.div>
  );
};


export default About;
