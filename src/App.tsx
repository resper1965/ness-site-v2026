/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  ShieldCheck, 
  Cloud, 
  Cpu, 
  Brain, 
  Scale, 
  Lock, 
  Workflow, 
  Fingerprint, 
  FileText, 
  ArrowRight, 
  ArrowUpRight, 
  Globe, 
  LayoutGrid,
  Send,
  ChevronRight,
  Gavel,
  FlaskConical,
  Share2,
  Network,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  Target,
  Eye,
  Heart,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Menu,
  X,
  AlertTriangle,
  Briefcase,
  Clock,
  Building2,
  Upload,
  PartyPopper,
  Sparkles,
  MessageSquare,
  Bot,
  User
} from "lucide-react";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;

const CELEBRATION_CONFIG = {
  active: true, // Set to true to enable celebration
  label: `${YEARS_OF_LEGACY} anos`,
  title: `${YEARS_OF_LEGACY} anos de engenharia de precisão`,
  message: `estamos celebrando ${YEARS_OF_LEGACY} anos de inovação, resiliência e parcerias de sucesso. obrigado por fazer parte da nossa história.`,
  startDate: "2024-04-14", // User will provide the exact date
  durationDays: 7,
  foundationYear: FOUNDATION_YEAR,
  currentYear: CURRENT_YEAR
};

const BlueDot = () => <span className="text-primary-container">.</span>;

const CelebrationPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("ness_35_celebration_seen");
    if (CELEBRATION_CONFIG.active && !hasSeen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setShow(false);
    localStorage.setItem("ness_35_celebration_seen", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-low rounded-[3rem] border border-primary-container/30 nebula-shadow p-12 text-center overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center mx-auto mb-8">
                <PartyPopper className="text-primary-container" size={40} />
              </div>
              
              <div className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-4">
                ness. legacy — {CELEBRATION_CONFIG.foundationYear}-{CELEBRATION_CONFIG.currentYear}
              </div>
              
              <h2 className="text-4xl font-display font-bold text-white mb-6 tracking-tighter lowercase-all">
                {CELEBRATION_CONFIG.title}<BlueDot />
              </h2>
              
              <p className="text-on-surface-variant font-light leading-relaxed mb-10">
                {CELEBRATION_CONFIG.message}
              </p>
              
              <button 
                onClick={closePopup}
                className="bg-primary-container text-on-primary px-12 py-4 rounded-full font-display font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-primary-container/20"
              >
                continuar navegando
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ChatbotWidget = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', content: string}[]>([
    { role: 'bot', content: t('chatbot.welcome') }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useEffect(() => {
    const el = document.getElementById('chat-scroll');
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: t('chatbot.error') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-surface-container-low border border-primary-container/20 rounded-[2.5rem] nebula-shadow flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-primary-container/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <Bot className="text-on-primary" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-display font-bold text-sm lowercase-all">Gabi.OS<BlueDot /></h4>
                  <p className="text-[10px] text-primary-container uppercase tracking-widest font-bold">{t('chatbot.status')}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div id="chat-scroll" className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-light leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary-container text-on-primary rounded-tr-none' 
                      : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-surface-container-high/50 border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="digite sua dúvida..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
              />
              <button type="submit" className="w-12 h-12 bg-primary-container text-on-primary rounded-xl flex items-center justify-center hover:brightness-110 transition-all">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary-container text-on-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-container/40 relative group"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full"></div>
        <MessageSquare className="group-hover:rotate-12 transition-transform" size={28} />
      </motion.button>
    </div>
  );
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const menuItems = [
    { key: "solutions", label: t("nav.solutions") },
    { key: "sobre", label: t("nav.about") },
    { key: "portfólio", label: t("nav.portfolio") },
    { key: "blog", label: t("nav.blog") },
    { key: "carreiras", label: t("nav.careers") },
    { key: "contato", label: t("nav.contact") }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass rounded-full flex justify-between items-center px-6 md:px-8 py-3 z-50 nebula-shadow">
        <Link to="/" className="text-2xl font-display tracking-tighter text-white lowercase-all">
          ness<BlueDot />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {CELEBRATION_CONFIG.active && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 animate-pulse">
              <Sparkles size={12} className="text-primary-container" />
              <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest">{CELEBRATION_CONFIG.label}</span>
            </div>
          )}
          {menuItems.map((item) => (
            isHome ? (
              item.key === "sobre" || item.key === "contato" || item.key === "portfólio" || item.key === "blog" || item.key === "carreiras" ? (
                <Link
                  key={item.key}
                  to={`/${item.key}`}
                  className="text-on-surface-variant tracking-tight text-[10px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  className="text-on-surface-variant tracking-tight text-[10px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold"
                >
                  {item.label}
                </a>
              )
            ) : (
              <Link
                key={item.key}
                to={item.key === "sobre" || item.key === "contato" || item.key === "portfólio" || item.key === "blog" || item.key === "carreiras" ? `/${item.key}` : `/#${item.key}`}
                className="text-on-surface-variant tracking-tight text-[10px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            {['pt', 'en', 'es'].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`px-2 py-1 rounded-full text-[9px] uppercase font-bold transition-all ${
                  i18n.language.startsWith(lng) 
                    ? "bg-primary-container text-on-primary" 
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {lng}
              </button>
            ))}
          </div>

          <button className="hidden lg:flex text-on-surface-variant hover:text-white transition-colors">
            <LayoutGrid size={20} />
          </button>
          <button className="hidden sm:flex bg-primary-container text-on-primary px-6 py-2 rounded-full font-display font-bold text-xs uppercase scale-95 active:scale-90 transition-all hover:brightness-110">
            {t('nav.contact')}
          </button>
          
          {/* Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-4 mb-4">
                {['pt', 'en', 'es'].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      changeLanguage(lng);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition-all ${
                      i18n.language.startsWith(lng) 
                        ? "bg-primary-container text-on-primary" 
                        : "bg-white/5 text-on-surface-variant"
                    }`}
                  >
                    {lng === 'pt' ? 'Português' : lng === 'en' ? 'English' : 'Español'}
                  </button>
                ))}
              </div>

              {menuItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {isHome ? (
                    item.key === "sobre" || item.key === "contato" || item.key === "portfólio" || item.key === "blog" || item.key === "carreiras" ? (
                      <Link
                        to={`/${item.key}`}
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-display font-semibold text-white lowercase-all tracking-tighter"
                      >
                        {item.label}<BlueDot />
                      </Link>
                    ) : (
                      <a
                        href={`#${item.key}`}
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-display font-semibold text-white lowercase-all tracking-tighter"
                      >
                        {item.label}<BlueDot />
                      </a>
                    )
                  ) : (
                    <Link
                      to={item.key === "sobre" || item.key === "contato" || item.key === "portfólio" || item.key === "blog" || item.key === "carreiras" ? `/${item.key}` : `/#${item.key}`}
                      onClick={() => setIsOpen(false)}
                      className="text-3xl font-display font-semibold text-white lowercase-all tracking-tighter"
                    >
                      {item.label}<BlueDot />
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8 border-t border-white/5"
              >
                <button className="w-full bg-primary-container text-on-primary py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-sm">
                  começar agora
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
          alt="Abstract Tech Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/20 via-surface-container-lowest/80 to-surface-container-lowest z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,173,232,0.15),transparent_70%)] z-20"></div>
        
        {/* Floating Glow Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full z-10"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-container/10 blur-[150px] rounded-full z-10"
        />
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-8"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-display text-[10px] tracking-widest uppercase">
            {t('hero.tag')}
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-semibold text-white leading-tight tracking-tighter lowercase-all">
            {t('hero.title')}<BlueDot />
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <button className="bg-gradient-to-r from-primary-container to-primary text-on-primary px-10 py-4 rounded-full font-display font-bold text-lg shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform">
              {t('hero.explore')}
            </button>
            <button className="flex items-center gap-3 text-white font-display font-medium hover:text-primary transition-colors group">
              {t('hero.know_ness')}<BlueDot />
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Presence = () => {
  const { t } = useTranslation();
  const locations = [
    t('presence.locations.brazil'),
    t('presence.locations.portugal'),
    t('presence.locations.chile'),
    t('presence.locations.peru'),
    t('presence.locations.colombia'),
    t('presence.locations.usa')
  ];
  return (
    <section className="py-12 bg-surface border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
          <div className="flex items-center gap-2">
            <Globe className="text-primary-container" size={20} />
            <span className="text-on-surface-variant text-xs tracking-widest uppercase font-bold">{t('presence.global')}</span>
          </div>
          {locations.map((loc) => (
            <div key={loc} className="flex items-center gap-2">
              <Network className="text-on-surface-variant/50" size={14} />
              <span className="text-on-surface-variant text-sm lowercase-all">{loc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const solutionsData: Record<string, any> = {
  "secops": {
    title: "n.secops",
    fullTitle: "resiliência operacional & continuidade",
    desc: "operação contínua de segurança com monitoramento em tempo real e resposta a incidentes.",
    longDesc: "o n.secops não é apenas sobre tecnologia; é sobre a sobrevivência do seu negócio. protegemos sua reputação e sua operação através de um copiloto de inteligência aplicada que antecipa crises antes que elas cheguem à sua mesa. segurança que você não vê, mas cujos resultados você sente na estabilidade do seu crescimento.",
    icon: ShieldCheck,
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
    ctaLabel: "solicitar diagnóstico de segurança",
    dashboard: {
      title: "security posture",
      mainStat: { value: "99.9%", label: "resiliência ativa" },
      metrics: [
        { value: "0", label: "crises críticas", color: "text-primary-container" },
        { value: "1.2k", label: "ameaças contidas", color: "text-white" }
      ],
      progress: { label: "mitigação de risco", value: "98%", subLabel: "secure" }
    },
    benefits: [
      { title: "copiloto de segurança", desc: "inteligência aplicada que auxilia na detecção precoce e resposta rápida, atuando como um braço direito da operação." },
      { title: "governança viva (grc)", desc: "conformidade dinâmica que evolui em tempo real, saindo do papel para a prática contínua." },
      { title: "proteção de reputação", desc: "evite vazamentos e crises que podem destruir a confiança da sua marca." },
      { title: "eficiência financeira", desc: "redução drástica de perdas por paradas operacionais e multas regulatórias." },
      { title: "maturidade demonstrável", desc: "dashboards de conformidade que provam seu nível de adequação a standards globais." }
    ],
    workflow: [
      { step: "01", name: "vigilância invisível", desc: "monitoramento silencioso de cada ponto da sua empresa, garantindo que tudo funcione como deveria." },
      { step: "02", name: "conformidade em tempo real", desc: "alimentação contínua do sistema de GRC com dados vivos da operação, mantendo standards sempre em dia." },
      { step: "03", name: "contenção autônoma", desc: "nossa tecnologia isola problemas em milissegundos, impedindo que uma pequena falha vire uma crise." },
      { step: "04", name: "comunicação executiva", desc: "você é notificado da solução, não do problema. tickets abertos e resolvidos com transparência total." }
    ],
    services: [
      { name: "Centro de Operações de Segurança (SOC)", desc: "monitoramento inteligente e resposta estratégica a incidentes." },
      { name: "Integração GRC Dinâmica", desc: "automação de governança, riscos e conformidade com dados em tempo real." },
      { name: "Gestão de Higiene Digital", desc: "manutenção proativa de sistemas para evitar vulnerabilidades." },
      { name: "Automação de Resposta (SOAR)", desc: "tecnologia que age na velocidade do ataque para proteger seus ativos." }
    ],
    technicalFeatures: [
      { title: "Copiloto de Segurança", desc: "IA aplicada que correlaciona eventos e sugere ações de mitigação instantâneas para o time de SOC." },
      { title: "Conformidade Contínua (GRC)", desc: "integração nativa com plataformas de GRC para monitoramento automático de standards (ISO, NIST, LGPD)." },
      { title: "Mapeamento de Maturidade", desc: "análise dinâmica do nível de adequação aos controles de segurança com relatórios executivos." },
      { title: "FIM (File Integrity Monitoring)", desc: "monitoramento em tempo real de alterações em arquivos críticos, diretórios e chaves de registro." },
      { title: "Detecção de Vulnerabilidades", desc: "identificação automática de softwares desatualizados e vulnerabilidades conhecidas (CVEs)." },
      { title: "Security Configuration Assessment", desc: "verificação contínua de hardening e conformidade com políticas de segurança internas." },
      { title: "Análise de Logs & Eventos", desc: "coleta e indexação massiva de dados para correlação inteligente e busca forense." }
    ],
    portfolio: [
      { client: "Ionic Health", project: "Operação Remota de Diagnóstico por Imagem", result: "Segurança global (+40 países) com certificações FDA, ISO 27001, ISO 27701 e conformidade GDPR/LGPD." },
      { client: "Alupar S/A", project: "Resiliência de Infraestrutura Crítica", result: "Monitoramento 24/7 de ativos de energia com zero downtime operacional." },
      { client: "Leite, Tosto e Barros Advogados", project: "Blindagem de Dados Jurídicos", result: "Garantia de confidencialidade absoluta e integridade em processos de alta complexidade." }
    ]
  },
  "infraops": {
    title: "n.infraops",
    fullTitle: "infraestrutura inteligente & suporte global",
    desc: "gestão moderna de infraestrutura crítica com foco em alta disponibilidade e escala.",
    longDesc: "o n.infraops redefine o suporte técnico tradicional. unimos a robustez do framework ITIL à agilidade de um sistema de IA aplicada que atua como copiloto das nossas operações. mais do que resolver chamados, garantimos a continuidade e a evolução da sua base tecnológica com especialistas de elite em arquitetura, redes e segurança, operando em escala global.",
    icon: Cloud,
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
    ctaLabel: "otimizar minha infraestrutura",
    dashboard: {
      title: "global operations",
      mainStat: { value: "99.99%", label: "uptime global" },
      metrics: [
        { value: "15ms", label: "latência média", color: "text-primary-container" },
        { value: "24/7", label: "suporte ativo", color: "text-white" }
      ],
      progress: { label: "eficiência de rede", value: "95%", subLabel: "optimized" }
    },
    benefits: [
      { title: "copiloto de ia aplicada", desc: "inteligência artificial que acelera diagnósticos e resoluções, funcionando como um braço direito dos nossos técnicos." },
      { title: "expertise multinível", desc: "acesso direto a técnicos N1/N2/N3 e arquitetos de soluções, redes e dados altamente qualificados." },
      { title: "disponibilidade 24x7", desc: "operação ininterrupta para garantir que seu negócio nunca pare, independente do fuso horário ou complexidade." },
      { title: "presença global", desc: "operação direta em 5 países e suporte indireto global, garantindo proximidade e entendimento cultural." },
      { title: "governança itil", desc: "processos padronizados que garantem qualidade, previsibilidade e melhoria contínua da infraestrutura." }
    ],
    workflow: [
      { step: "01", name: "triagem inteligente", desc: "nossa IA analisa e classifica demandas instantaneamente, direcionando-as para o especialista mais adequado." },
      { step: "02", name: "atendimento especializado", desc: "times N1 a N3 atuam em conjunto com arquitetos para resolver desde o suporte básico até arquiteturas complexas." },
      { step: "03", name: "otimização de redes", desc: "aplicação de roteamento, segmentação e segurança para garantir performance e proteção total dos dados." },
      { step: "04", name: "gestão de continuidade", desc: "monitoramento proativo e manutenção preventiva baseada em dados reais e processos ITIL." }
    ],
    services: [
      { name: "Suporte Técnico N1/N2/N3", desc: "atendimento especializado com foco em resolução rápida e alta satisfação do usuário." },
      { name: "Arquitetura de Redes & Dados", desc: "design e implementação de infraestruturas modernas, seguras e escaláveis." },
      { name: "Gestão de Segurança & Segmentação", desc: "blindagem da infraestrutura através de políticas rigorosas de acesso e tráfego." },
      { name: "Operação Global 24x7", desc: "suporte ininterrupto com cobertura internacional e processos de governança ITIL." }
    ],
    technicalFeatures: [
      { title: "IA Aplicada (Copiloto)", desc: "sistema de IA que auxilia técnicos na compreensão de problemas e sugestão de soluções em tempo real." },
      { title: "Arquitetura de Roteamento", desc: "implementação de protocolos de alta performance para tráfego global de dados e baixa latência." },
      { title: "Segmentação Zero Trust", desc: "isolamento de ativos críticos para minimizar superfícies de ataque e garantir privacidade." },
      { title: "Gestão de Patching & Inventário", desc: "controle total sobre ativos de hardware e software com atualizações automatizadas e seguras." },
      { title: "Observabilidade ITIL", desc: "dashboards de performance alinhados aos SLAs e KPIs de governança corporativa." }
    ],
    portfolio: [
      { client: "Alupar S/A", project: "Sustentação de Infraestrutura Crítica", result: "Disponibilidade de 99.9% em ativos de energia e suporte especializado 24x7." },
      { client: "Leite, Tosto e Barros Advogados", project: "Modernização de Operações Digitais", result: "Suporte técnico de alta performance e governança de dados jurídicos." },
      { client: "Target Trading", project: "Infraestrutura de Alta Performance", result: "Otimização de redes e suporte global para operações de comércio exterior." },
      { client: "TBE Energia", project: "Gestão de Ativos e Redes", result: "Continuidade operacional e segurança em infraestrutura de transmissão de energia." },
      { client: "Grupo RZK", project: "Suporte e Evolução Tecnológica", result: "Gestão centralizada de endpoints e suporte multinível para diversas unidades de negócio." }
    ]
  },
  "devarch": {
    title: "n.devarch",
    fullTitle: "arquitetura orientada ao desenvolvedor & escala segura",
    desc: "arquitetura orientada ao desenvolvedor para escala e performance extrema.",
    longDesc: "no n.devarch, transformamos o desenvolvimento em uma vantagem competitiva. criamos nossas próprias soluções e, principalmente, capacitamos empresas e times de tecnologia a alcançarem escala extrema. através de arquiteturas modernas, implementamos S-SDLC e pipelines automatizados que garantem que cada linha de código seja entregue com velocidade, qualidade e segurança inegociável.",
    icon: Cpu,
    bgImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
    ctaLabel: "escalar meu desenvolvimento",
    dashboard: {
      title: "engineering velocity",
      mainStat: { value: "3x", label: "aceleração de deploy" },
      metrics: [
        { value: "0", label: "vulnerabilidades", color: "text-primary-container" },
        { value: "100%", label: "s-sdlc compliance", color: "text-white" }
      ],
      progress: { label: "qualidade de código", value: "92%", subLabel: "high grade" }
    },
    benefits: [
      { title: "velocidade com segurança (s-sdlc)", desc: "integramos segurança desde a primeira linha de código, eliminando gargalos e riscos no ciclo de desenvolvimento." },
      { title: "arquitetura escalável", desc: "design de sistemas preparados para crescer exponencialmente sem perder performance ou estabilidade." },
      { title: "governança de código", desc: "padrões e processos que garantem a qualidade e a manutenibilidade do software a longo prazo." },
      { title: "pipelines ultra-rápidos", desc: "automação total de CI/CD para entregas contínuas, reduzindo o time-to-market de forma drástica." },
      { title: "redução de débito técnico", desc: "identificação e correção proativa de vulnerabilidades e falhas estruturais antes que se tornem problemas." }
    ],
    workflow: [
      { step: "01", name: "design de arquitetura", desc: "planejamento estrutural focado em escala, resiliência e facilidade de desenvolvimento." },
      { step: "02", name: "implementação de s-sdlc", desc: "estabelecimento de processos seguros de desenvolvimento, do planejamento ao deploy." },
      { step: "03", name: "automação de pipelines", desc: "criação de fluxos de CI/CD que automatizam testes, segurança e entrega de software." },
      { step: "04", name: "gestão de vulnerabilidades", desc: "monitoramento contínuo do código e dependências para garantir integridade total." }
    ],
    services: [
      { name: "Consultoria em Arquitetura & Cloud", desc: "modernização de sistemas e migração para arquiteturas de alta performance." },
      { name: "Implementação de S-SDLC / SDLC", desc: "estruturação completa do ciclo de vida de desenvolvimento com foco em segurança." },
      { name: "Automação de CI/CD Pipelines", desc: "desenvolvimento de esteiras automatizadas para entrega contínua e segura." },
      { name: "Gestão de Vulnerabilidades em Código", desc: "análise profunda e remediação de falhas em aplicações e APIs." }
    ],
    technicalFeatures: [
      { title: "S-SDLC (Secure SDLC)", desc: "metodologia que integra verificações de segurança em todas as fases do desenvolvimento." },
      { title: "CI/CD Pipelines Automatizados", desc: "automação de build, teste e deploy com foco em feedback rápido para o desenvolvedor." },
      { title: "Análise SAST & DAST", desc: "ferramentas de análise estática e dinâmica para detecção proativa de falhas de segurança." },
      { title: "Infraestrutura como Código (IaC)", desc: "gerenciamento de ambientes através de código, garantindo paridade e reprodutibilidade." },
      { title: "Governança de Microserviços", desc: "estratégias de desacoplamento e comunicação eficiente para sistemas complexos." }
    ],
    portfolio: [
      { client: "Ionic Health", project: "Governança & Arquitetura Global", result: "Implementação de SDLC e qualidade para operação em escala em +40 países." },
      { client: "Fintech Inovadora", project: "Pipeline Seguro de Transações", result: "Aumento de 300% na velocidade de deploy com conformidade bancária total." }
    ]
  },
  "autoops": {
    title: "n.autoops",
    fullTitle: "eficiência operacional & automação estratégica",
    desc: "transforme sua operação com assistentes inteligentes que resolvem gargalos e aceleram o crescimento.",
    longDesc: "o n.autoops é o braço de inteligência da ness. que coloca sua empresa à frente da concorrência. desenvolvemos assistentes personalizados (copilotos) que assumem tarefas repetitivas, consultam bases de dados complexas e interagem com seus clientes em tempo real. seja para um escritório jurídico ou uma grande indústria, nossa tecnologia libera seu time para focar no que realmente gera lucro, orquestrando processos com precisão absoluta.",
    icon: Brain,
    bgImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=2000",
    ctaLabel: "agendar demo da gabi.os",
    benefits: [
      { title: "lucratividade real", desc: "reduza custos operacionais ao automatizar tarefas que consomem o tempo precioso da sua equipe qualificada." },
      { title: "atendimento em escala", desc: "atenda centenas de clientes simultaneamente com a mesma qualidade e precisão, 24 horas por dia." },
      { title: "inteligência de negócio", desc: "transforme manuais, contratos e dados internos em uma base de conhecimento viva e consultável instantaneamente." },
      { title: "integração sem fricção", desc: "nossos assistentes conversam com seus sistemas atuais, eliminando a necessidade de trocas complexas de software." },
      { title: "decisões baseadas em dados", desc: "tenha acesso a insights em tempo real sobre sua operação, permitindo ajustes rápidos e estratégicos." }
    ],
    workflow: [
      { step: "01", name: "diagnóstico de gargalos", desc: "identificamos onde sua operação perde tempo e dinheiro com processos manuais ou repetitivos." },
      { step: "02", name: "modelagem do assistente", desc: "desenhamos o cérebro da automação, definindo como ele deve agir e quais problemas deve resolver." },
      { step: "03", name: "conexão de inteligência", desc: "integramos o assistente às suas bases de dados e canais de comunicação (WhatsApp, Teams, etc)." },
      { step: "04", name: "ativação & escala", desc: "seu novo braço direito entra em operação, assumindo o trabalho pesado e gerando eficiência imediata." }
    ],
    services: [
      { name: "Criação de Copilotos de Negócio", desc: "assistentes inteligentes que entendem as regras da sua empresa e ajudam na tomada de decisão." },
      { name: "Automação de Atendimento VIP", desc: "experiência de luxo e precisão no atendimento ao cliente via canais digitais." },
      { name: "Modernização de Fluxos Legados", desc: "damos vida nova aos seus sistemas antigos através de interfaces de conversação inteligentes." },
      { name: "Curadoria de Conhecimento Corporativo", desc: "organização e vetorização de dados para que sua empresa nunca perca o conhecimento acumulado." }
    ],
    technicalFeatures: [
      { title: "Orquestração de Tarefas", desc: "capacidade de executar sequências lógicas complexas, como agendamentos, consultas e atualizações de registro." },
      { title: "Busca Semântica Avançada", desc: "encontra a informação exata em segundos, mesmo em bases de dados com milhares de documentos." },
      { title: "Conectividade Universal", desc: "integração nativa com as principais ferramentas de mercado e sistemas proprietários via API." },
      { title: "Segurança de Dados Corporativos", desc: "garantia de que as informações da sua empresa permanecem privadas e protegidas em cada interação." },
      { title: "Monitoramento de Performance", desc: "dashboards claros que mostram o ROI e a eficiência gerada pela automação em tempo real." }
    ],
    portfolio: [
      { client: "Escritório Jurídico de Elite", project: "Assistente de Análise Contratual", result: "Redução de 60% no tempo de revisão de documentos e zero falhas de conformidade." },
      { client: "Rede de Clínicas Especializadas", project: "Gestão Inteligente de Pacientes", result: "Aumento de 40% na conversão de agendamentos via WhatsApp com atendimento 24/7." },
      { client: "Distribuidora Nacional", project: "Automação de Pedidos & Estoque", result: "Integração total com sistema legado, eliminando erros de digitação e acelerando entregas." }
    ]
  },
  "cirt": {
    title: "n.cirt",
    fullTitle: "gestão estratégica de crises cibernéticas",
    desc: "resposta tática e estratégica para empresas em estado de crise cibernética.",
    longDesc: "o n.cirt é a nossa unidade de elite para momentos de alta criticidade. atuamos como o PMO da crise e Trusted Advisors, coordenando equipes técnicas, jurídicas e de comunicação para conter danos e restaurar a operação. nossa atuação é independente: socorremos empresas em crise mesmo que não utilizem outras soluções da ness., garantindo uma resposta coordenada perante stakeholders e autoridades.",
    icon: Gavel,
    bgImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000",
    ctaLabel: "acionar time de resposta",
    dashboard: {
      title: "crisis management",
      mainStat: { value: "4h", label: "mttr médio" },
      metrics: [
        { value: "100%", label: "stakeholders ok", color: "text-primary-container" },
        { value: "0", label: "vazamentos", color: "text-white" }
      ],
      progress: { label: "recuperação de ativos", value: "100%", subLabel: "restored" }
    },
    benefits: [
      { title: "pmo da crise", desc: "assumimos a coordenação central de todas as frentes (TI, Negócio, Jurídico) para garantir uma resposta unificada e eficiente." },
      { title: "trusted advisor", desc: "aconselhamento estratégico para o board e executivos na tomada de decisões críticas sob pressão." },
      { title: "independência tecnológica", desc: "atendimento imediato a qualquer empresa em crise, independente de ser cliente prévio da ness. ou da stack utilizada." },
      { title: "articulação jurídica & regulatória", desc: "suporte na resposta a autoridades e órgãos reguladores em conjunto com o time jurídico." },
      { title: "gestão de stakeholders", desc: "estratégia de comunicação e reporte para acionistas, clientes e parceiros durante o incidente." }
    ],
    workflow: [
      { step: "01", name: "mobilização imediata", desc: "ativação do comitê de crise e estabelecimento do centro de comando (War Room)." },
      { step: "02", name: "diagnóstico & contenção", desc: "análise rápida da extensão do dano e implementação de medidas táticas para estancar a crise." },
      { step: "03", name: "coordenação de frentes", desc: "orquestração dos times técnicos, jurídicos e de comunicação para uma resposta síncrona." },
      { step: "04", name: "recuperação & reporte", desc: "plano de retomada segura das operações e elaboração de relatórios para autoridades e stakeholders." }
    ],
    services: [
      { name: "Coordenação de Comitê de Crise", desc: "gestão centralizada de incidentes cibernéticos com foco em continuidade de negócio." },
      { name: "Aconselhamento Estratégico (C-Level)", desc: "suporte direto à alta gestão para mitigação de riscos reputacionais e financeiros." },
      { name: "Interface com Autoridades", desc: "preparação de evidências e relatórios técnicos para órgãos reguladores e investigativos." },
      { name: "PMO de Recuperação Pós-Incidente", desc: "gestão do projeto de reconstrução e endurecimento da infraestrutura após a crise." }
    ],
    technicalFeatures: [
      { title: "War Room Virtual & Presencial", desc: "infraestrutura de comunicação segura para coordenação ininterrupta da crise." },
      { title: "Preservação de Evidências", desc: "protocolos rigorosos para garantir a integridade de dados para fins jurídicos e forenses." },
      { title: "Análise de Impacto em Tempo Real", desc: "dashboards de situação para visibilidade clara do status de recuperação e riscos remanescentes." },
      { title: "Playbooks de Resposta Rápida", desc: "metodologias testadas para os tipos mais comuns de ataques (Ransomware, Exfiltração, etc)." },
      { title: "Comunicação Criptografada", desc: "canais de comunicação fora da rede afetada para garantir o sigilo das decisões estratégicas." }
    ],
    portfolio: [
      { client: "Grupo Industrial", project: "Resposta a Ransomware Global", result: "Coordenação de crise em 3 continentes com contenção em 6h e zero pagamento de resgate." },
      { client: "Instituição Financeira", project: "Vazamento de Dados Críticos", result: "Gestão de resposta a autoridades e stakeholders com mitigação total de multas regulatórias." }
    ]
  }
};

const ChatPreview = () => {
  const messages = [
    { role: "user", text: "Gabi, preciso de um resumo dos contratos que vencem este mês." },
    { role: "assistant", text: "Com certeza. Identifiquei 12 contratos com vencimento em abril. Os 3 principais são: Cliente Alpha (dia 15), Tech Solutions (dia 22) e Global Corp (dia 28). Deseja que eu prepare os termos de renovação?" },
    { role: "user", text: "Sim, por favor. Use o modelo padrão de 2024." },
    { role: "assistant", text: "Entendido. Processando minutas... Pronto! As 3 minutas foram geradas e enviadas para sua pasta de rascunhos no Teams. Algo mais?" }
  ];

  return (
    <div className="relative glass p-6 md:p-8 rounded-[2.5rem] border border-white/10 nebula-shadow overflow-hidden h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
            <Brain size={20} className="text-primary-container" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Gabi.OS</div>
            <div className="text-[10px] text-green-500 uppercase tracking-widest font-bold flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
              online
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.5 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
              msg.role === "user" 
                ? "bg-primary-container text-on-primary rounded-tr-none" 
                : "bg-white/5 text-white border border-white/10 rounded-tl-none"
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="bg-white/5 rounded-full px-4 py-3 flex items-center justify-between border border-white/10">
          <span className="text-on-surface-variant/40 text-xs">digite sua mensagem...</span>
          <Send size={16} className="text-primary-container" />
        </div>
      </div>
    </div>
  );
};

const SolutionPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const solution = slug ? solutionsData[slug] : null;
  const Icon = solution?.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!solution) return <div className="min-h-screen flex items-center justify-center text-white">{t('common.loading')}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen overflow-hidden"
    >
      {/* Immersive Background for Solution Page */}
      <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.5 }}
            src={solution.bgImage}
            alt={`${solution.title} Background`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 z-10"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-12 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
                <Icon className="text-primary-container" size={32} />
              </div>
              <h1 className="text-2xl font-brand font-medium text-white lowercase-all">
                {t(`solutions.${slug}.title`).split('.')[0]}<span className="text-primary-container">.</span>{t(`solutions.${slug}.title`).split('.')[1]}
              </h1>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-semibold text-white tracking-tighter leading-tight lowercase-all">
              {t(`solutions.${slug}.fullTitle`)}<BlueDot />
            </h2>
            <p className="text-xl text-on-surface-variant font-light leading-relaxed">
              {t(`solutions.${slug}.longDesc`)}
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-primary-container text-on-primary px-8 py-4 rounded-full font-display font-bold text-sm uppercase hover:brightness-110 transition-all">
                {t(`solutions.${slug}.cta`)}
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
            {slug === 'autoops' ? (
              <ChatPreview />
            ) : (
              <div className="relative glass p-8 md:p-12 rounded-[3rem] border border-white/10 nebula-shadow overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">resiliência ativa</span>
                  </div>
                </div>
                
                <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-bold">{solution.dashboard?.title || 'executive dashboard'}</h3>
                    <div className="text-right">
                      <div className="text-3xl font-display font-bold text-white tracking-tighter">{solution.dashboard?.mainStat.value || '99.9%'}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{solution.dashboard?.mainStat.label || 'uptime operacional'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {solution.dashboard?.metrics.map((metric: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <motion.div 
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                          className={`${metric.color} text-xl font-bold mb-1`}
                        >
                          {metric.value}
                        </motion.div>
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{solution.dashboard?.progress.label}</h4>
                      <span className="text-[10px] text-primary font-mono">{solution.dashboard?.progress.value} {solution.dashboard?.progress.subLabel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: solution.dashboard?.progress.value }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-primary-container"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">fluxo de inteligência</h4>
                    <div className="space-y-3">
                      {solution.workflow?.map((w: any) => (
                        <motion.div 
                          key={w.step} 
                          initial={{ opacity: 0.4 }}
                          whileInView={{ opacity: 1 }}
                          className="flex gap-4 group/step items-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-[10px] font-mono text-primary-container">
                            {w.step}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="text-white text-xs font-medium group-hover/step:text-primary transition-colors">{w.name}</h4>
                              <div className="h-px flex-1 mx-4 bg-white/5"></div>
                              <CheckCircle2 size={12} className="text-primary-container" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-24 mb-24">
          <section id="benefícios">
            <h3 className="text-3xl font-display font-semibold text-white mb-12 tracking-tighter lowercase-all">{t('solutions.business_value', 'valor para o negócio')}<BlueDot /></h3>
            <div className="grid grid-cols-1 gap-6">
              {solution.benefits?.map((benefit: any, i: number) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="p-8 rounded-3xl bg-surface-container-low/30 border border-white/5 hover:bg-surface-container-low/50 transition-all"
                >
                  <h4 className="text-primary-container font-bold text-xs uppercase tracking-widest mb-3">{benefit.title}</h4>
                  <p className="text-white text-lg font-light leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="serviços">
            <h3 className="text-3xl font-display font-semibold text-white mb-12 tracking-tighter lowercase-all">{t('solutions.strategic_solutions', 'soluções estratégicas')}<BlueDot /></h3>
            <div className="space-y-6">
              {solution.services.map((service: any, i: number) => (
                <div key={i} className="group p-6 rounded-2xl border border-white/5 bg-surface-container-low/10 hover:bg-surface-container-low/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center shrink-0">
                      <Icon className="text-primary-container" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{service.name}</h4>
                      <p className="text-on-surface-variant text-sm font-light">{service.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-10 rounded-[3rem] bg-gradient-to-br from-primary-container to-primary text-on-primary shadow-2xl shadow-primary-container/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Icon size={120} />
              </div>
              <div className="relative z-10">
                <h4 className="text-3xl font-display font-bold mb-4 tracking-tighter">{t('solutions.cta_title', 'sua empresa em um novo nível.')}</h4>
                <p className="text-lg mb-8 opacity-90 font-light">{t('solutions.cta_desc', 'descubra como a ness pode transformar sua operação com inteligência e segurança de elite.')}</p>
                <button className="bg-white text-primary px-10 py-4 rounded-full font-display font-bold uppercase tracking-widest text-xs hover:shadow-xl transition-all">
                  {solution.ctaLabel}
                </button>
              </div>
            </div>
          </section>
        </div>

        {solution.technicalFeatures && (
          <section id="tecnologia" className="mb-24 pt-24 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
              <div className="max-w-xl">
                <h3 className="text-3xl font-display font-semibold text-white tracking-tighter lowercase-all">{t('solutions.tech_engine', 'o motor da resiliência')}<BlueDot /></h3>
                <p className="text-on-surface-variant mt-4 font-light">{t('solutions.tech_desc', 'para os interessados na engenharia por trás da proteção, aqui estão os pilares técnicos que sustentam nossa entrega de valor.')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.technicalFeatures.map((feat: any, i: number) => (
                <div key={i} className="p-8 rounded-3xl border border-white/5 bg-surface-container-low/20 hover:border-primary/20 transition-all">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {feat.title}
                  </h4>
                  <p className="text-on-surface-variant text-xs font-light leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="portfólio">
          <h3 className="text-3xl font-display font-semibold text-white mb-12 tracking-tighter lowercase-all">{t('solutions.impact_portfolio', 'portfólio de impacto')}<BlueDot /></h3>
          <div className="grid md:grid-cols-2 gap-8">
            {solution.portfolio.map((item: any, i: number) => (
              <div key={i} className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-surface-container-low to-surface-container-lowest">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
                    <h4 className="text-xl text-white mt-1 font-medium">{item.project}</h4>
                  </div>
                  <ExternalLink className="text-on-surface-variant/40" size={20} />
                </div>
                <div className="p-4 rounded-xl bg-primary-container/5 border border-primary-container/10">
                  <p className="text-primary-container text-sm font-medium">{t('common.result')}: {item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

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
                  {s.title.split('.')[0]}<span className="text-primary-container">.</span>{s.title.split('.')[1]}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                  {s.desc}
                </p>
                <div className="mt-8 flex items-center gap-2 text-[10px] text-primary-container uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
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

const Services = () => {
  const { t } = useTranslation();
  const services = [
    {
      title: "Consultoria em IA & Dados",
      desc: "Estratégia para implementação de copilotos e orquestração de conhecimento corporativo.",
      icon: Brain,
      tags: ["RAG", "LLM Ops", "Data Strategy"]
    },
    {
      title: "Resposta a Incidentes (IR)",
      desc: "Atuação tática em crises cibernéticas, contenção de danos e recuperação de ambientes.",
      icon: ShieldCheck,
      tags: ["War Room", "Forensics", "Crisis Mgmt"]
    },
    {
      title: "Engenharia de Plataforma",
      desc: "Design de arquiteturas escaláveis e pipelines de entrega contínua de alta performance.",
      icon: Network,
      tags: ["Cloud Native", "DevOps", "Scalability"]
    },
    {
      title: "Governança & Compliance",
      desc: "Automação de GRC e adequação dinâmica a normas globais e regulamentações.",
      icon: Scale,
      tags: ["ISO 27001", "LGPD", "Risk Audit"]
    }
  ];

  return (
    <section id="serviços" className="py-24 bg-surface-container-lowest px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Services */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000"
          alt="Professional Services Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-display font-semibold tracking-tighter mb-6 text-white lowercase-all">
              {t('nav.services')}<BlueDot />
            </h2>
            <p className="text-on-surface-variant text-lg font-light">
              {t('services.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2.5rem] bg-surface-container-low/30 border border-white/5 hover:bg-surface-container-low/50 transition-all flex flex-col h-full group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="text-primary-container" size={24} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">{service.title}</h3>
              <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">
                {service.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-primary-container/60 font-bold px-3 py-1 rounded-full bg-primary-container/5 border border-primary-container/10">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Verticals = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-surface px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Verticals */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
          alt="Corporate Verticals Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-surface/90 to-surface z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-display font-semibold tracking-tighter mb-6 text-white lowercase-all">
              {t('verticals.title')}<BlueDot />
            </h2>
            <p className="text-on-surface-variant text-lg font-light">
              {t('verticals.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer border border-white/5 p-12 rounded-[3rem] bg-surface-container-low/20 hover:bg-surface-container-low/40 transition-all"
          >
            <div className="mb-8 w-16 h-16 rounded-2xl bg-primary-container/5 border border-primary-container/10 flex items-center justify-center">
              <Fingerprint className="text-primary-container" size={40} />
            </div>
            <h3 className="text-3xl mb-4 text-white font-brand font-medium lowercase-all">
              forense<span className="text-primary-container">.</span>io
            </h3>
            <p className="text-on-surface-variant leading-relaxed font-light">
              líder em investigação digital e resposta a incidentes complexos. unimos tecnologia proprietária e expertise humana para desvendar o invisível.
            </p>
            <div className="mt-8 flex items-center gap-2 text-[10px] text-primary-container uppercase tracking-widest font-bold">
              explorar unidade <ArrowUpRight size={14} />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer border border-white/5 p-12 rounded-[3rem] bg-surface-container-low/20 hover:bg-surface-container-low/40 transition-all"
          >
            <div className="mb-8 w-16 h-16 rounded-2xl bg-primary-container/5 border border-primary-container/10 flex items-center justify-center">
              <ShieldCheck className="text-primary-container" size={40} />
            </div>
            <h3 className="text-3xl mb-4 text-white font-brand font-medium lowercase-all">
              trustness<BlueDot />
            </h3>
            <p className="text-on-surface-variant leading-relaxed font-light">
              consultoria estratégica em governança, riscos e conformidade. criando alicerces sólidos para que sua empresa cresça com segurança e ética.
            </p>
            <div className="mt-8 flex items-center gap-2 text-[10px] text-primary-container uppercase tracking-widest font-bold">
              explorar unidade <ArrowUpRight size={14} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Insights = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/insights?lang=${i18n.language}`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        // Show only the 3 most recent
        setArticles(data.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar insights:", error);
        // Fallback mock data if API fails
        setArticles([
          {
            title: "A Nova Era da Resiliência Cibernética",
            tag: "Segurança",
            date: "12 Abr 2026",
            icon: "ShieldCheck",
            desc: "Como as empresas estão se preparando para ameaças invisíveis em 2026."
          },
          {
            title: "IA Generativa em Operações Críticas",
            tag: "IA",
            date: "10 Abr 2026",
            icon: "Brain",
            desc: "O papel dos agentes autônomos na eficiência operacional moderna."
          },
          {
            title: "Arquiteturas Serverless e Escalabilidade",
            tag: "Cloud",
            date: "08 Abr 2026",
            icon: "Cloud",
            desc: "Maximizando a performance com infraestrutura sob demanda."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [i18n.language]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck": return ShieldCheck;
      case "Cloud": return Cloud;
      case "Lock": return Lock;
      case "Cpu": return Cpu;
      case "Brain": return Brain;
      case "Workflow": return Workflow;
      default: return FileText;
    }
  };

  return (
    <section id="insights" className="py-24 bg-surface px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Insights */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000"
          alt="Digital Insights Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-surface/90 to-surface z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-display font-semibold tracking-tighter text-white lowercase-all">
            {t('nav.blog')}<BlueDot />
          </h2>
          <Link className="text-primary-container flex items-center gap-2 hover:gap-4 transition-all font-medium" to="/blog">
            {t('common.view_all')} <ChevronRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-3xl bg-surface-container-low/20 h-64"></div>
            ))
          ) : (
            articles.map((art, i) => {
              const Icon = getIcon(art.icon);
              return (
                <motion.article 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer border border-white/5 p-8 rounded-3xl hover:bg-surface-container-low/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-6">
                    <Icon className="text-primary-container" size={24} />
                  </div>
                  <span className="text-primary-container text-[10px] uppercase tracking-widest font-bold">{art.tag}</span>
                  <h3 className="text-xl mt-2 mb-4 text-white group-hover:text-primary transition-colors lowercase-all">
                    {art.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm font-light line-clamp-2">
                    {art.desc}
                  </p>
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/insights?lang=${i18n.language}`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Erro ao buscar insights:", error);
        // Fallback mock data if API fails
        setArticles([
          {
            title: "A Nova Era da Resiliência Cibernética",
            tag: "Segurança",
            date: "12 Abr 2026",
            icon: "ShieldCheck",
            desc: "Como as empresas estão se preparando para ameaças invisíveis em 2026."
          },
          {
            title: "IA Generativa em Operações Críticas",
            tag: "IA",
            date: "10 Abr 2026",
            icon: "Brain",
            desc: "O papel dos agentes autônomos na eficiência operacional moderna."
          },
          {
            title: "Arquiteturas Serverless e Escalabilidade",
            tag: "Cloud",
            date: "08 Abr 2026",
            icon: "Cloud",
            desc: "Maximizando a performance com infraestrutura sob demanda."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck": return ShieldCheck;
      case "Cloud": return Cloud;
      case "Lock": return Lock;
      case "Cpu": return Cpu;
      case "Brain": return Brain;
      case "Workflow": return Workflow;
      default: return FileText;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            blog — ness. insights
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-display font-semibold text-white tracking-tighter mb-8 lowercase-all">
            {t('blog.title')}<BlueDot />
          </h1>
          <p className="text-xl text-on-surface-variant font-light max-w-3xl leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-3xl bg-surface-container-low/20 h-80"></div>
            ))
          ) : (
            articles.map((art, i) => {
              const Icon = getIcon(art.icon);
              return (
                <motion.article 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer border border-white/5 p-8 rounded-3xl bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-all flex flex-col h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-6">
                    <Icon className="text-primary-container" size={24} />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary-container text-[10px] uppercase tracking-widest font-bold">{art.tag}</span>
                    <span className="text-on-surface-variant/40 text-[10px] font-mono">{art.date}</span>
                  </div>
                  <h3 className="text-2xl mb-4 text-white group-hover:text-primary transition-colors lowercase-all leading-tight">
                    {art.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">
                    {art.desc}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-primary-container uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ler artigo completo <ArrowUpRight size={14} />
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Careers = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/jobs?lang=${i18n.language}`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        // Fallback mock data if API fails
        setJobs([
          {
            id: "1",
            title: "Engenheiro de Software Sênior (Fullstack)",
            vertical: "engenharia",
            location: "Remoto / São Paulo",
            type: "Full-time",
            desc: "Buscamos especialistas em React e Node.js para atuar em projetos de alta escala e resiliência.",
            requirements: ["5+ anos de experiência", "Domínio de TypeScript", "Vivência com arquiteturas distribuídas"]
          },
          {
            id: "2",
            title: "Analista de Segurança Ofensiva (Red Team)",
            vertical: "segurança",
            location: "Remoto / Portugal",
            type: "Full-time",
            desc: "Foco em testes de intrusão, análise de vulnerabilidades e fortalecimento de perímetros digitais.",
            requirements: ["Experiência com Pentest", "Certificações OSCP/CEH", "Conhecimento em Cloud Security"]
          },
          {
            id: "3",
            title: "Arquiteto de Soluções Cloud",
            vertical: "infraestrutura",
            location: "Híbrido / Chile",
            type: "Full-time",
            desc: "Desenho e implementação de infraestruturas resilientes e escaláveis em ambientes multi-cloud.",
            requirements: ["Domínio de AWS/Azure/GCP", "Experiência com IaC (Terraform)", "Foco em FinOps"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const filteredJobs = filter === "todos" ? jobs : jobs.filter(j => j.vertical === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            {t('careers.title')} — ness. talent
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-display font-semibold text-white tracking-tighter mb-8 lowercase-all">
            {t('careers.subtitle')}<BlueDot />
          </h1>
          <p className="text-xl text-on-surface-variant font-light max-w-3xl leading-relaxed">
            {t('careers.desc')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-16">
          {["todos", "n.secops", "n.autoops", "n.infraops", "n.devarch"].map((cat) => (
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

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-3xl bg-surface-container-low/20 h-64"></div>
            ))
          ) : (
            filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-[2.5rem] bg-surface-container-low/30 border border-white/5 hover:bg-surface-container-low/50 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
                    <Briefcase className="text-primary-container" size={24} />
                  </div>
                  <span className="text-primary-container text-[10px] uppercase tracking-widest font-bold px-4 py-1 rounded-full bg-primary-container/5 border border-primary-container/10">
                    {job.vertical}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4 lowercase-all">{job.title}<BlueDot /></h3>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-on-surface-variant/60 text-xs">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant/60 text-xs">
                    <Clock size={14} />
                    {job.type}
                  </div>
                </div>

                <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">
                  {job.desc}
                </p>

                <button 
                  onClick={() => setSelectedJob(job)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-xs transition-all border border-white/10"
                >
                  saiba mais
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Application Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
                className="absolute inset-0 bg-surface/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface-container-low rounded-[3rem] border border-white/10 nebula-shadow p-8 md:p-12 custom-scrollbar"
              >
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-8 right-8 text-on-surface-variant hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <span className="text-primary-container text-[10px] uppercase tracking-widest font-bold">{selectedJob.vertical}</span>
                      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-2 lowercase-all">{selectedJob.title}<BlueDot /></h2>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-bold text-xs uppercase tracking-widest">requisitos</h4>
                      <ul className="space-y-3">
                        {selectedJob.requirements.map((req: string, i: number) => (
                          <li key={i} className="flex gap-3 text-on-surface-variant text-sm font-light">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                      <h4 className="text-white font-bold text-xs uppercase tracking-widest">benefícios ness.</h4>
                      <div className="grid grid-cols-2 gap-4 text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">
                        <div>• plano de saúde premium</div>
                        <div>• bônus por performance</div>
                        <div>• auxílio educação</div>
                        <div>• setup de alta performance</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-high/50 p-8 rounded-[2rem] border border-white/5">
                    <h3 className="text-xl font-display font-bold text-white mb-8 lowercase-all">candidatar-se à vaga<BlueDot /></h3>
                    <form 
                      className="space-y-4" 
                      onSubmit={async (e) => { 
                        e.preventDefault(); 
                        const formData = new FormData(e.currentTarget);
                        const payload = {
                          formType: "career",
                          jobId: selectedJob.id,
                          jobTitle: selectedJob.title,
                          name: formData.get("name"),
                          email: formData.get("email"),
                          linkedin: formData.get("linkedin"),
                          // Note: File upload handling would typically require multipart/form-data
                          // For this proxy, we'll send the metadata and assume the backoffice handles the file separately or via a different flow
                          hasAttachment: !!formData.get("cv")
                        };
                        try {
                          const response = await fetch("/api/submit-form", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                          });
                          if (response.ok) {
                            alert('Candidatura enviada com sucesso!'); 
                            setSelectedJob(null); 
                          } else {
                            throw new Error("Failed to submit");
                          }
                        } catch (error) {
                          alert("Erro ao enviar candidatura. Por favor, tente novamente.");
                        }
                      }}
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">nome completo</label>
                        <input name="name" type="text" required placeholder="seu nome" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">email corporativo</label>
                        <input name="email" type="email" required placeholder="email@exemplo.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">linkedin / portfólio</label>
                        <input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">anexar cv (pdf)</label>
                        <div className="relative group/upload">
                          <input name="cv" type="file" accept=".pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl px-6 py-8 text-center group-hover/upload:border-primary-container/50 transition-all">
                            <Upload className="mx-auto text-on-surface-variant/40 mb-2 group-hover/upload:text-primary-container transition-colors" size={24} />
                            <p className="text-xs text-on-surface-variant/60">clique ou arraste seu currículo aqui</p>
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-primary-container text-on-primary py-5 rounded-2xl font-display font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl shadow-primary-container/20 mt-4">
                        enviar candidatura
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-8 bg-surface">
      <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative bg-surface-container-low p-12 md:p-24 border border-white/5 nebula-shadow">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-container/10 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-display font-semibold text-white tracking-tighter leading-tight mb-6 lowercase-all">
              {t('cta.title')}
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed font-light">
              {t('cta.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button className="bg-white text-surface px-12 py-5 rounded-full font-display font-bold text-xl hover:bg-primary-container hover:text-on-primary transition-all shadow-2xl shadow-primary-container/20">
              {t('cta.button')}
            </button>
            <p className="text-on-surface-variant/50 text-center text-sm font-light">{t('cta.support')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-surface py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs space-y-6">
          <div className="text-xl text-white font-display lowercase-all">ness<BlueDot /></div>
          <p className="text-sm text-on-surface-variant/60 leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4">
            {[
              { Icon: Linkedin, url: "https://www.linkedin.com/company/ness-tecnologia/" },
              { Icon: Instagram, url: "https://www.instagram.com/ness.tecnologia/" },
              { Icon: Facebook, url: "https://www.facebook.com/nesstecnologia" }
            ].map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant/50 hover:text-primary transition-all">
                <social.Icon size={20} />
              </a>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white font-bold">{t('footer.company')}</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant/60 font-light">
              <li><Link className="hover:text-white transition-all" to="/sobre">{t('nav.about')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/portfólio">{t('nav.portfolio')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/blog">{t('nav.blog')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/carreiras">{t('nav.careers')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/contato">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white font-bold">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant/60 font-light">
              <li><Link className="hover:text-white transition-all" to="/compliance/termos">{t('footer.terms')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/compliance/privacidade">{t('footer.privacy')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/compliance/etica">{t('footer.compliance')}</Link></li>
              <li><Link className="hover:text-white transition-all text-primary-container font-medium" to="/compliance/etica">{t('contact.whistleblower.title')}</Link></li>
            </ul>
          </div>
          <div className="hidden lg:block space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white font-bold">updates</h4>
            <p className="text-sm text-on-surface-variant/60 font-light">{t('footer.newsletter')}</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="email" 
                className="bg-surface-container-low border border-white/10 rounded-full px-4 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary text-white"
              />
              <button className="bg-primary-container text-on-primary rounded-full p-2 flex items-center justify-center hover:brightness-110 transition-all">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5">
        <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold">
          {["brasil", "portugal", "chile", "peru", "colômbia", "estados unidos"].map((loc, i, arr) => (
            <span key={loc}>
              {loc}
              {i < arr.length - 1 && <span className="text-primary-container ml-4">/</span>}
            </span>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-on-surface-variant/40 font-light">© 2026 ness. precision digital engineering. {t('footer.rights')}</p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant/40 font-bold">system live status: optimal</span>
        </div>
      </div>
    </footer>
  );
};

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
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
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
                nossa história<br />e legado<BlueDot />
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

const Contact = () => {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Immersive Background for Contact Page */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
          alt="Contact Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="grid lg:grid-cols-2 gap-24">
          {/* Left Side: Info */}
          <div className="space-y-12">
            <div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
              >
                get in touch — ness. precision
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-display font-semibold text-white tracking-tighter leading-tight mb-8 lowercase-all">
                {t('contact.title')}<BlueDot />
              </h1>
              <p className="text-xl text-on-surface-variant font-light leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <Mail className="text-primary-container" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">email</h4>
                  <p className="text-on-surface-variant font-light">contato@ness.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <Phone className="text-primary-container" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">telefone</h4>
                  <p className="text-on-surface-variant font-light">+55 (11) 2504-7650</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <MapPin className="text-primary-container" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">escritório</h4>
                  <p className="text-on-surface-variant font-light leading-relaxed">
                    Rua George Ohm 230 Torre A Cj 82<br />
                    Brooklin Paulista - São Paulo/SP<br />
                    CEP 04576-020
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              {[
                { Icon: Linkedin, url: "https://www.linkedin.com/company/ness-tecnologia/" },
                { Icon: Instagram, url: "https://www.instagram.com/ness.tecnologia/" },
                { Icon: Facebook, url: "https://www.facebook.com/nesstecnologia" }
              ].map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container transition-all">
                  <social.Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-surface-container-low/30 border border-white/5 p-8 md:p-12 rounded-[3rem] nebula-shadow">
            <form 
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  formType: "contact",
                  name: formData.get("name"),
                  company: formData.get("company"),
                  email: formData.get("email"),
                  subject: formData.get("subject"),
                  message: formData.get("message")
                };
                try {
                  const response = await fetch("/api/submit-form", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });
                  if (response.ok) {
                    alert(t('contact.form.success'));
                    (e.target as HTMLFormElement).reset();
                  } else {
                    throw new Error("Failed to submit");
                  }
                } catch (error) {
                  alert(t('contact.form.error'));
                }
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.name')}</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder={t('contact.form.name_placeholder')} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.company')}</label>
                  <input 
                    name="company"
                    type="text" 
                    required
                    placeholder={t('contact.form.company_placeholder')} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.email')}</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder={t('contact.form.email_placeholder')} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.subject')}</label>
                <select name="subject" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none">
                  <option value="" className="bg-surface">{t('contact.form.subject_select')}</option>
                  <option value="n.secops" className="bg-surface">n.secops</option>
                  <option value="n.autoops" className="bg-surface">n.autoops</option>
                  <option value="n.infraops" className="bg-surface">n.infraops</option>
                  <option value="outros" className="bg-surface">{t('nav.services')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.message')}</label>
                <textarea 
                  name="message"
                  rows={4}
                  required
                  placeholder={t('contact.form.message_placeholder')} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all resize-none"
                ></textarea>
              </div>
              <button className="w-full bg-primary-container text-on-primary py-5 rounded-2xl font-display font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl shadow-primary-container/20">
                {t('contact.form.send')}
              </button>
            </form>
          </div>
        </div>

        {/* Whistleblowing Callout on Contact Page */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-24 p-8 md:p-12 rounded-[3rem] bg-surface-container-low/20 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-primary-container/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="text-primary-container" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2 lowercase-all">{t('contact.whistleblower.title')}<BlueDot /></h3>
              <p className="text-on-surface-variant font-light text-sm max-w-md">
                {t('contact.whistleblower.desc')}
              </p>
            </div>
          </div>
          <Link 
            to="/compliance/etica"
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-xs transition-all border border-white/10"
          >
            {t('contact.whistleblower.cta')}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Compliance = () => {
  const { t } = useTranslation();
  const { type } = useParams();
  const location = useLocation();

  const content = {
    termos: {
      title: "termos de uso",
      desc: "regras e diretrizes para utilização de nossas plataformas e serviços.",
      sections: [
        {
          h: "1. aceitação",
          p: "ao acessar nossas soluções, você concorda em cumprir estes termos e todas as leis e regulamentos aplicáveis."
        },
        {
          h: "2. propriedade intelectual",
          p: "todo o conteúdo, software e metodologias da ness. são protegidos por direitos de propriedade intelectual e não podem ser reproduzidos sem autorização prevía."
        },
        {
          h: "3. responsabilidade",
          p: "a ness. se compromete com a máxima disponibilidade e segurança, mas não se responsabiliza por danos decorrentes do uso indevido das credenciais por parte do usuário."
        }
      ]
    },
    privacidade: {
      title: "política de privacidade",
      desc: "como tratamos seus dados com segurança e transparência.",
      sections: [
        {
          h: "1. coleta de dados",
          p: "coletamos apenas as informações necessárias para fornecer nossos serviços de engenharia e segurança, como dados de contato corporativo e logs técnicos de segurança."
        },
        {
          h: "2. finalidade",
          p: "seus dados são utilizados exclusivamente para a execução de contratos, suporte técnico, melhoria de nossas soluções e conformidade legal (LGPD)."
        },
        {
          h: "3. segurança",
          p: "implementamos medidas técnicas e organizacionais de ponta, incluindo criptografia e controle de acesso rigoroso, para proteger suas informações contra acessos não autorizados."
        },
        {
          h: "4. seus direitos",
          p: "você tem o direito de acessar, corrigir, excluir ou solicitar a portabilidade de seus dados a qualquer momento através do nosso canal de privacidade."
        }
      ]
    },
    etica: {
      title: "compliance & ética",
      desc: "nosso compromisso com a integridade e conduta ética global.",
      sections: [
        {
          h: "1. código de conduta",
          p: "operamos sob os mais altos padrões de ética profissional, combatendo qualquer forma de corrupção, discriminação ou conduta antiética."
        },
        {
          h: "2. canal de denúncias",
          p: "mantemos um canal independente e anônimo para relato de violações ao nosso código de conduta ou legislações vigentes."
        },
        {
          h: "3. certificações",
          p: "nossas operações são auditadas e seguem frameworks internacionais como ISO 27001 e SOC2, garantindo governança de classe mundial."
        }
      ]
    }
  };

  const current = content[type as keyof typeof content] || content.termos;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            compliance — ness. precision
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-white tracking-tighter mb-6 lowercase-all">
            {current.title}<BlueDot />
          </h1>
          <p className="text-xl text-on-surface-variant font-light">
            {current.desc}
          </p>
        </div>

        <div className="flex gap-4 mb-12 border-b border-white/5 pb-4 overflow-x-auto">
          {Object.keys(content).map((key) => (
            <Link
              key={key}
              to={`/compliance/${key}`}
              className={`text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-full transition-all whitespace-nowrap ${
                type === key ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:text-white"
              }`}
            >
              {key === "etica" ? t('footer.compliance') : key === "termos" ? t('footer.terms') : t('footer.privacy')}
            </Link>
          ))}
        </div>

        <div className="space-y-12">
          {current.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-white lowercase-all">{section.h}</h3>
              <p className="text-on-surface-variant font-light leading-relaxed">
                {section.p}
              </p>
            </motion.div>
          ))}
        </div>

        {type === "etica" && (
          <>
            <div className="h-px bg-white/5 w-full mt-24"></div>
            <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 p-12 rounded-[2.5rem] bg-primary-container/5 border border-primary-container/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <AlertTriangle size={120} className="text-primary-container" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-display font-bold text-white mb-4 lowercase-all">{t('contact.whistleblower.title')}<BlueDot /></h3>
              <p className="text-on-surface-variant font-light leading-relaxed mb-8">
                {t('contact.whistleblower.desc')}
              </p>
              
              <form 
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = {
                    formType: "whistleblowing",
                    name: formData.get("name") || "Anônimo",
                    email: formData.get("email") || "N/A",
                    subject: formData.get("subject"),
                    message: formData.get("message")
                  };
                  try {
                    const response = await fetch("/api/submit-form", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload)
                    });
                    if (response.ok) {
                      // Success feedback
                      (e.target as HTMLFormElement).reset();
                    } else {
                      throw new Error("Failed to submit");
                    }
                  } catch (error) {
                    alert("Erro ao enviar denúncia. Por favor, tente novamente.");
                  }
                }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">nome (opcional)</label>
                    <input name="name" type="text" placeholder="seu nome ou deixe em branco" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">contato (opcional)</label>
                    <input name="email" type="text" placeholder="email ou telefone para retorno" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">tipo de ocorrência</label>
                  <select name="subject" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none">
                    <option value="" className="bg-surface">selecione uma categoria</option>
                    <option value="etica" className="bg-surface">violação ética</option>
                    <option value="assédio" className="bg-surface">assédio / discriminação</option>
                    <option value="fraude" className="bg-surface">fraude / corrupção</option>
                    <option value="segurança" className="bg-surface">vazamento de dados / segurança</option>
                    <option value="outros" className="bg-surface">outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">descrição dos fatos</label>
                  <textarea name="message" required rows={6} placeholder="detalhe o ocorrido com o máximo de informações possíveis (datas, locais, envolvidos)..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all resize-none"></textarea>
                </div>
                <button className="w-full bg-primary-container text-on-primary py-5 rounded-2xl font-display font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl shadow-primary-container/20">
                  enviar denúncia segura
                </button>
              </form>
            </div>
          </motion.div>
          </>
        )}

        <div className="mt-24 p-8 rounded-3xl bg-surface-container-low/30 border border-white/5">
          <p className="text-sm text-on-surface-variant font-light italic">
            última atualização: 14 de abril de 2024. para dúvidas adicionais, entre em contato com nosso DPO em dpo@ness.com.br
          </p>
        </div>
      </div>
    </motion.div>
  );
};

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
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
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
          <h1 className="text-5xl md:text-8xl font-display font-semibold text-white tracking-tighter mb-8 lowercase-all">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
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
          className="mt-32 p-12 md:p-24 rounded-[4rem] bg-gradient-to-br from-primary-container to-primary text-on-primary text-center relative overflow-hidden group"
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

const Home = () => {
  return (
    <>
      <Hero />
      <Presence />
      <Solutions />
      <Services />
      <Verticals />
      <Insights />
      <CTA />
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <CelebrationPopup />
      <ChatbotWidget />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solucoes/:slug" element={<SolutionPage />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/portfólio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/carreiras" element={<Careers />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/compliance/:type" element={<Compliance />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
