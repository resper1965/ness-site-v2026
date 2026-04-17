import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, Lock, FileCheck, ShieldCheck, Target, GraduationCap, Scale, Activity, PieChart, Users, ShieldAlert, CheckCircle2 } from "lucide-react";
import BlueDot from "../../components/BlueDot";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function TrustnessHome() {
  usePageTitle('trustness.', 'auditoria e conformidade');
  
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
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/50 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
          {/* Intense blue glow to distinguish trustness */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
              trustness<BlueDot /><br />
              <span className="text-white/90 drop-shadow-[0_0_20px_rgba(0,173,232,0.4)]">auditoria e conformidade</span>
            </h1>
            <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
              auditorias independentes, assessments de segurança e consultoria em conformidade (ISO 27001, LGPD, SOC 2) — com relatórios executivos e roadmaps acionáveis.
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link
                to="/contato"
                className="bg-primary-container text-on-primary px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform"
              >
                solicitar assessment
              </Link>
              <a
                 href="#cases"
                className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-primary transition-colors group"
              >
                falar com especialista<BlueDot />
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
                Clientes B2B, investidores e reguladores exigem evidências de conformidade. ISO 27001 e SOC 2 viraram pré-requisitos para fechar grandes contratos. trustness. realiza auditorias independentes com metodologia reconhecida, relatórios executivos e roadmaps priorizados — entregando confiança demonstrável.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'SGSI estruturado',
                subtitle: 'Startup quer ISO 27001 mas não tem SGSI estruturado',
                description: 'Implementamos SGSI completo: políticas, procedimentos, avaliação de riscos, controles técnicos e organizacionais — pronto para auditoria.',
                icon: FileCheck,
              },
              {
                title: 'adequação LGPD',
                subtitle: 'Empresa precisa auditoria LGPD independente antes da ANPD',
                description: 'Gap analysis LGPD, ROPA, DPIAs, políticas e relatório executivo com roadmap de adequação priorizado.',
                icon: ShieldCheck,
              },
              {
                title: 'visibilidade executiva',
                subtitle: 'Board quer visibilidade de postura de segurança mas TI só fala técnico',
                description: 'Assessment executivo com score de maturidade, benchmarks de mercado e roadmap de investimento.',
                icon: Target,
              },
              {
                title: 'remediação de gaps',
                subtitle: 'Auditoria externa encontrou achados críticos e empresa quer remediação',
                description: 'Consultoria para implementação de controles, remediação de gaps e preparação para re-auditoria.',
                icon: Lock,
              },
              {
                title: 'DPOaaS.online',
                subtitle: 'Conformidade demonstrável para LGPD/GDPR/CCPA',
                description: 'DPO certificado dedicado + plataforma n.privacy incluída para gestão contínua de privacidade.',
                icon: Users,
                highlight: true
              }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-3xl border transition-colors group ${feature.highlight ? 'bg-primary-container/5 border-primary-container/20' : 'bg-surface-container border-white/5 hover:border-primary-container/30'}`}>
                <feature.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-[10px] text-primary-container font-bold uppercase tracking-widest block mb-2">{feature.title}</span>
                <h3 className="text-lg font-display text-white mb-3 tracking-tight leading-tight">{feature.subtitle}</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">{feature.description}</p>
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
                recursos principais<BlueDot />
             </h2>
             <p className="mt-4 text-on-surface-variant max-w-2xl font-light">suite completo de auditoria e consultoria em conformidade</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Assessments de Segurança", desc: "Avaliação de maturidade em cibersegurança com frameworks reconhecidos (NIST CSF, CIS, ISO 27001)." },
              { icon: FileCheck, title: "Auditorias de Conformidade", desc: "Auditorias independentes ISO 27001, ISO 27701, SOC 2, PCI-DSS, LGPD com relatórios executivos." },
              { icon: ShieldCheck, title: "Implementação ISO 27001", desc: "Projeto estruturado para certificação ISO 27001: SGSI, políticas, controles e preparação para auditoria." },
              { icon: Lock, title: "Penetration Testing", desc: "Pentest externo/interno, web apps, APIs, infraestrutura e social engineering com relatórios técnicos." },
              { icon: ShieldAlert, title: "Vulnerability Assessment", desc: "Varredura e análise de vulnerabilidades com priorização por criticidade e impacto no negócio." },
              { icon: PieChart, title: "Governança de Segurança", desc: "Estruturação de comitês de segurança, políticas, procedimentos e frameworks de governança." },
              { icon: Users, title: "Due Diligence de Fornecedores", desc: "Avaliação de segurança e privacidade de vendors críticos com questionários e evidências." },
              { icon: GraduationCap, title: "Treinamentos e Awareness", desc: "Programas de conscientização em segurança e privacidade customizados para diferentes públicos." },
              { icon: Scale, title: "Assessoria Regulatória", desc: "Consultoria para conformidade com regulamentações setoriais (BACEN, SUSEP, ANS, ANATEL)." },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-primary-container/30 transition-colors group">
                <feature.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-display text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Métricas de Excelência */}
      <section className="py-24 px-8 bg-surface-container border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter mb-8">
                métricas de excelência<BlueDot />
              </h2>
              <div className="space-y-6">
                {[
                  "Track record de auditorias e certificações",
                  "Metodologia reconhecida internacionalmente",
                  "Relatórios executivos e roadmaps priorizados",
                  "Foco em confiança demonstrável para stakeholders"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/80 font-display">
                    <CheckCircle2 size={24} className="text-primary-container" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'frameworks', value: '15+' },
                { label: 'certificações', value: '100%' },
                { label: 'compliance score', value: 'A+' },
                { label: 'stakeholders', value: '800+' }
              ].map((m, i) => (
                <div key={i} className="p-8 rounded-3xl bg-surface-container-lowest border border-white/5 text-center">
                  <div className="text-3xl font-display text-white mb-2">{m.value}</div>
                  <div className="text-[10px] text-primary-container font-bold uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Processo de Auditoria */}
      <section className="py-24 px-8 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
                processo de auditoria<BlueDot />
             </h2>
             <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-light">
                De kickoff a relatório final em 4–8 semanas, garantindo conformidade e confiança.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Kickoff e Escopo", desc: "Alinhamento de objetivos, escopo e timeline do projeto." },
              { step: "02", title: "Coleta de Evidências", desc: "Questionários, entrevistas e análise documental rigorosa." },
              { step: "03", title: "Análise e Gap Analysis", desc: "Comparação com frameworks e identificação de riscos." },
              { step: "04", title: "Relatório e Apresentação", desc: "Score de maturidade e roadmap de recomendações." },
              { step: "05", title: "Plano de Remediação", desc: "Acompanhamento até a certificação ou adequação total." },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-surface-container/50 border border-white/5">
                <span className="text-primary-container font-display text-xs font-bold block mb-4 tracking-widest">{s.step}</span>
                <h3 className="text-lg font-display text-white mb-2 leading-tight">{s.title}</h3>
                <p className="text-xs text-on-surface-variant font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-display font-medium text-white lowercase-all tracking-tighter">
            precisa de auditoria ou certificação?<BlueDot />
          </h2>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            solicite assessment de segurança, auditoria de conformidade ou consultoria especializada para certificação ISO ou SOC 2.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <Link
              to="/contato"
              className="bg-primary-container text-on-primary px-12 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              solicitar assessment
            </Link>
            <Link
              to="/contato"
              className="border border-white/10 text-white px-12 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              falar com consultor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
