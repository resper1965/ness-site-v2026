import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, Fingerprint, HardDrive, Smartphone, Network, Clock, FileCheck, Scale, RefreshCw, Activity } from "lucide-react";
import BlueDot from "../../components/BlueDot";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ForenseHome() {
  usePageTitle('', 'análise forense digital & incident response');
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2000"
            alt="Forense Background"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/50 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
          {/* Intense red glow to contrast with blue dot */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-10"
          >
            <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-display text-xs tracking-[0.2em] uppercase max-w-max">
              <ShieldAlert size={14} /> iso 27037 / 27042 methodology
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
              análise forense digital com <span className="text-white drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]">cadeia de custódia</span> preservada<BlueDot />
            </h1>
            <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
              especialização em forense digital — perícia judicial, investigação corporativa e resposta a incidentes.
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link
                to="/contato"
                className="bg-linear-to-r from-red-700 to-red-950 text-white px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-red-900/20 hover:scale-105 transition-transform"
              >
                solicitar perícia
              </Link>
              <a
                href="#cases"
                className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-red-400 transition-colors group"
              >
                ver casos de uso<BlueDot />
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Por que importa */}
      <section className="py-24 px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
                por que importa<BlueDot />
             </h2>
             <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-light">
                Evidências digitais são voláteis e podem ser destruídas em minutos. Analise técnica e jurídica são essenciais para judiciários e incidentes. Realizamos perícias preservando a cadeia de custódia e produzindo laudos defensáveis em juízo.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'ransomware',
                description: 'empresa precisa determinar ponto de entry e escopo. forense de memória (RAM), discos e logs para mapear TTPs do atacante.',
                icon: ShieldAlert,
                className: 'md:col-span-2'
              },
              {
                title: 'vazamento de dados',
                description: 'rastrear como dados saíram (BD, rede, e-mails) e identificar vetor.',
                icon: Network,
                className: 'md:col-span-1'
              },
              {
                title: 'processo judicial',
                description: 'perícia de dispositivo apreendido (notebook, smartphone). perito credenciado em audiência.',
                icon: Scale,
                className: 'md:col-span-1'
              },
              {
                title: 'investigação corporativa',
                description: 'fraude interna ou violação de IP de endpoints com respeito a LGPD.',
                icon: Fingerprint,
                className: 'md:col-span-2'
              }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-red-500/30 transition-colors group ${item.className}`}>
                <item.icon className="text-red-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-display text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Recursos Principais */}
      <section id="cases" className="py-24 px-8 bg-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-4xl font-display font-medium text-white lowercase-all tracking-tighter">
                recursos forenses<BlueDot />
             </h2>
             <p className="mt-4 text-on-surface-variant max-w-2xl font-light">expertise forense completa seguindo padrões internacionais</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: HardDrive, title: "Análise de Discos", desc: "Clonagem bit-a-bit, recuperação de arquivos deletados, análise de sistemas de arquivos." },
              { icon: Activity, title: "Forense de Memória (RAM)", desc: "Análise de processos e conexões voláteis e malware na RAM." },
              { icon: Smartphone, title: "Mobile Forensics", desc: "Extração de smartphones iOS/Android, e apps como WhatsApp." },
              { icon: Clock, title: "Timeline Analysis", desc: "Reconstrução cronológica de eventos para entender a sequência." },
              { icon: FileCheck, title: "Relatórios Periciais", desc: "Laudos técnicos estruturados (ISO 27042) e defensáveis em juízo." },
              { icon: RefreshCw, title: "Contraprova e Reexame", desc: "Análise crítica e segunda opinião sobre laudos de terceiros." },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-red-500/30 transition-colors group">
                <feature.icon className="text-red-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-display text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
