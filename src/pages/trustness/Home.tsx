import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, Lock, FileCheck, ShieldCheck, Target, GraduationCap, Scale } from "lucide-react";
import BlueDot from "../../components/BlueDot";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function TrustnessHome() {
  usePageTitle('', 'auditoria e conformidade');
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000"
            alt="Trustness Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/50 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
          {/* Subtle teal glow to distinguish trustness */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-10"
          >
            <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-display text-xs tracking-[0.2em] uppercase max-w-max">
              <ShieldCheck size={14} /> unit: governance & compliance
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
              auditoria e conformidade com confiança <span className="text-teal-400">demonstrável</span><BlueDot />
            </h1>
            <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
              auditorias independentes, assessments de segurança e consultoria (ISO 27001, LGPD, SOC 2) com relatórios executivos e roadmaps acionáveis.
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link
                to="/contato"
                className="bg-linear-to-r from-teal-600 to-teal-900 text-white px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-teal-900/20 hover:scale-105 transition-transform"
              >
                falar com especialista
              </Link>
              <a
                 href="#cases"
                className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-teal-400 transition-colors group"
              >
                solicitar assessment<BlueDot />
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
                Clientes B2B, investidores e reguladores exigem evidências de conformidade. ISO 27001 e SOC 2 viraram pré-requisitos para fechar acordos de magnitude. Fornecemos roadmaps priorizados.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'sgsi estruturado',
                description: 'implementamos políticas, procedimentos e controles para LGPD ou certificação ISO 27001.',
                icon: FileCheck,
                className: 'md:col-span-2'
              },
              {
                title: 'dpo as a service',
                description: 'DPO certificado e dedicado para conduzir DPIAs e reports perante a ANPD.',
                icon: ShieldCheck,
                className: 'md:col-span-1'
              },
              {
                title: 'visibilidade para board',
                description: 'assessment executivo de maturidade (score) convertendo TI puramente técnica em métricas de risco gerencial.',
                icon: Target,
                className: 'md:col-span-1'
              },
              {
                title: 'due diligence de fornecedores',
                description: 'avaliação de segurança e privacidade de vendors críticos com questionários e evidências.',
                icon: Lock,
                className: 'md:col-span-2'
              }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-teal-500/30 transition-colors group ${item.className}`}>
                <item.icon className="text-teal-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
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
                recursos de conformidade<BlueDot />
             </h2>
             <p className="mt-4 text-on-surface-variant max-w-2xl font-light">suite completa de assessoria regulatória</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Assessments Cibersegurança", desc: "Avaliação de maturidade NIST CSF, CIS Controls e ISO 27001." },
              { icon: FileCheck, title: "Auditorias de Conformidade", desc: "ISO 27001, SOC 2, PCI-DSS e LGPD com gap analysis estruturada." },
              { icon: Lock, title: "Penetration Testing (Pentest)", desc: "Ataques éticos externos/internos, infra, web apps e phishing." },
              { icon: Fingerprint, title: "Vulnerability Assessment", desc: "Varredura automatizada com priorização por criticidade." },
              { icon: GraduationCap, title: "Treinamentos Security Awareness", desc: "Conscientização em segurança com trilhas normativas." },
              { icon: Scale, title: "Governança TI", desc: "Consultoria setorial e contínua (ex: BACEN, SUSEP, ANS)." },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-teal-500/30 transition-colors group">
                <feature.icon className="text-teal-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
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
