import BlueDot from '../components/BlueDot';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;



const Portfolio = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState("todos");
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cases?lang=${i18n.language}`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error("Erro ao buscar cases:", error);
        // Fallback mock data if API fails
        setCases([
          {
            client: "Grupo Industrial Global",
            category: "segurança",
            project: "Resposta a Ransomware Global",
            result: "Contenção em 6h com zero pagamento de resgate.",
            desc: "Coordenação de crise em 3 continentes após ataque massivo de ransomware, restaurando operações críticas sem perda de dados.",
            stats: "6h Resposta",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
          },
          {
            client: "Varejo de Larga Escala",
            category: "ia",
            project: "Gabi.OS - Copiloto Logístico",
            result: "Redução de 40% no tempo de resposta logística.",
            desc: "Implementação de IA generativa para orquestração de conhecimento e tomada de decisão em tempo real na cadeia de suprimentos.",
            stats: "-40% Tempo",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
          },
          {
            client: "E-commerce Unicórnio",
            category: "infraestrutura",
            project: "Escala Black Friday",
            result: "99.99% de disponibilidade com tráfego 10x maior.",
            desc: "Modernização de infraestrutura cloud-native para suportar picos extremos de tráfego, garantindo performance e estabilidade.",
            stats: "99.99% Uptime",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
          },
          {
            client: "Instituição Financeira",
            category: "segurança",
            project: "Vazamento de Dados Críticos",
            result: "Mitigação total de multas regulatórias.",
            desc: "Gestão técnica e estratégica de incidente de vazamento, incluindo forense avançada e conformidade com LGPD/BACEN.",
            stats: "Zero Multas",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
          },
          {
            client: "Logística Integrada",
            category: "infraestrutura",
            project: "Orquestração Híbrida",
            result: "Otimização de 25% nos custos operacionais.",
            desc: "Migração e gestão de ambientes híbridos complexos, unificando a governança de TI e reduzindo desperdícios de recursos.",
            stats: "-25% Custos",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
          },
          {
            client: "HealthTech",
            category: "ia",
            project: "Triagem Inteligente",
            result: "Agilidade de 60% no atendimento inicial.",
            desc: "Uso de processamento de linguagem natural para triagem automatizada de pacientes, garantindo precisão e segurança de dados.",
            stats: "+60% Agilidade",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const filteredCases = filter === "todos" ? cases : cases.filter(c => c.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            portfólio de impacto — ness. precision
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-white tracking-tighter mb-8 lowercase-all">
            {t('portfolio.title')}<BlueDot />
          </h1>
          <p className="text-xl text-on-surface-variant font-light max-w-3xl leading-relaxed">
            {t('portfolio.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-16">
          {["todos", "segurança", "ia", "infraestrutura"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                filter === cat 
                  ? "bg-primary-container text-on-primary shadow-lg shadow-primary-container/20" 
                  : "bg-white/5 text-on-surface-variant hover:bg-white/10"
              }`}
            >
              {cat === "todos" ? t('common.all') : cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-[2.5rem] bg-surface-container-low/20 h-96"></div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCases.map((item, i) => (
              <motion.div
                layout
                key={item.project}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative glass rounded-[2.5rem] border border-white/10 overflow-hidden nebula-shadow flex flex-col h-full"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.project} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest to-transparent"></div>
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 rounded-full bg-primary-container/20 border border-primary-container/30 backdrop-blur-md">
                      <span className="text-[10px] text-primary-container font-bold uppercase tracking-widest">{item.stats}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
                    <h3 className="text-2xl text-white font-display font-bold mt-2 lowercase-all">{item.project}<BlueDot /></h3>
                  </div>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">
                    {item.desc}
                  </p>
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">{t('common.result')}</div>
                      <div className="text-xs text-primary-container font-medium">{item.result}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="mt-32 p-12 md:p-24 rounded-[4rem] bg-linear-to-br from-primary-container to-primary text-on-primary text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tighter lowercase-all">{t('portfolio.cta_title')}<BlueDot /></h2>
            <p className="text-xl mb-12 opacity-90 font-light">{t('portfolio.cta_desc')}</p>
            <Link 
              to="/contato"
              className="inline-block bg-white text-primary px-12 py-5 rounded-full font-display font-bold uppercase tracking-widest text-sm hover:shadow-2xl transition-all hover:scale-105"
            >
              {t('common.contact_expert')}
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};


export default Portfolio;
