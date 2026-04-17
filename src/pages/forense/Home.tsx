import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, Fingerprint, HardDrive, Smartphone, Network, Clock, FileCheck, Scale, Activity, ShieldCheck, MessageSquare, Search, Lock, CheckCircle2 } from "lucide-react";
import BlueDot from "../../components/BlueDot";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ForenseHome() {
  usePageTitle('forense.io', 'análise forense digital & incident response');
  
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
          {/* Intense blue glow to contrast with blue dot */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
              forense.io<BlueDot /><br />
              <span className="text-white/90 drop-shadow-[0_0_20px_rgba(0,173,232,0.4)]">cadeia de custódia</span> preservada
            </h1>
            <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
              especialização em forense digital seguindo ISO 27037/27042 — perícia judicial, investigação corporativa e resposta a incidentes.
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link
                to="/contato"
                className="bg-primary-container text-on-primary px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform"
              >
                solicitar perícia
              </Link>
              <a
                href="#resources"
                className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-primary transition-colors group"
              >
                ver recursos forenses<BlueDot />
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
                Evidências digitais são voláteis e podem ser destruídas em minutos. Forense digital é essencial para investigações judiciais, resposta a incidentes e compliance. forense.io realiza perícias com metodologia ISO 27037/27042, preservando cadeia de custódia e produzindo laudos defensáveis em juízo.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'ransomware',
                subtitle: 'Determinar ponto de entrada e escopo do comprometimento',
                description: 'Forense de memória (RAM), discos (clonagem bit-a-bit) e logs para mapear TTPs do atacante e extensão do incidente.',
                icon: ShieldAlert,
                className: 'lg:col-span-2'
              },
              {
                title: 'vazamento de dados',
                subtitle: 'Rastrear como dados sensíveis saíram da empresa',
                description: 'Análise de acesso a BD, logs de rede, e-mails e dispositivos para identificar vetor de exfiltração e autoria.',
                icon: Network,
              },
              {
                title: 'processo judicial',
                subtitle: 'Perícia de dispositivo apreendido (notebook, smartphone)',
                description: 'Perito judicial credenciado realiza exame técnico com relatório estruturado e defesa oral em audiência.',
                icon: Scale,
              },
              {
                title: 'investigação corporativa',
                subtitle: 'Fraude interna ou violação de propriedade intelectual',
                description: 'Forense de endpoints (e-mails, WhatsApp, Drive) com respeito a LGPD e cadeia de custódia preservada.',
                icon: Fingerprint,
                className: 'lg:col-span-2'
              }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-primary-container/30 transition-colors group ${feature.className}`}>
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
      <section id="resources" className="py-24 px-8 bg-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-4xl font-display font-medium text-white lowercase-all tracking-tighter">
                recursos principais<BlueDot />
             </h2>
             <p className="mt-4 text-on-surface-variant max-w-2xl font-light">expertise forense completo seguindo padrões internacionais</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: HardDrive, title: "Análise de Discos", desc: "Clonagem bit-a-bit, recuperação de arquivos deletados, análise de filesystem (NTFS, ext4, APFS)." },
              { icon: Activity, title: "Forense de Memória (RAM)", desc: "Análise de processos, conexões de rede, malware em memória e credenciais voláteis." },
              { icon: Smartphone, title: "Mobile Forensics", desc: "Extração lógica/física de smartphones (iOS/Android), análise de apps, WhatsApp, Telegram." },
              { icon: Network, title: "Network Forensics", desc: "Análise de PCAP, logs de firewall, IDS/IPS, reconstrução de sessões HTTP/HTTPS." },
              { icon: Clock, title: "Timeline Analysis", desc: "Reconstrução cronológica de eventos (file system, registry, logs) para entender sequência do ataque." },
              { icon: ShieldCheck, title: "Cadeia de Custódia", desc: "Documentação completa da preservação, coleta, transporte e análise de evidências (ISO 27037)." },
              { icon: FileCheck, title: "Relatórios Periciais", desc: "Laudos técnicos estruturados com metodologia ISO 27042, reprodutíveis e defensáveis em juízo." },
              { icon: MessageSquare, title: "Testemunho Especializado", desc: "Defesa oral de laudo em audiências judiciais com linguagem acessível ao jurídico." },
              { icon: Search, title: "Contraprova e Reexame", desc: "Análise crítica de laudos de terceiros e identificação de falhas metodológicas." },
              { icon: Lock, title: "Preservação de Evidências", desc: "Coleta on-site ou remota com ferramentas certificadas e hash criptográfico para integridade." },
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

      {/* Métricas Forenses */}
      <section className="py-24 px-8 bg-surface-container border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter mb-8">
                métricas forenses<BlueDot />
              </h2>
              <div className="space-y-6">
                {[
                  "Track record de excelência pericial",
                  "Cadeia de custódia preservada via ISO 27037",
                  "Metodologia ISO 27042 para laudos defensáveis",
                  "Atendimento a incidentes críticos em tempo recorde"
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
                { label: 'perícias', value: '450+' },
                { label: 'laudos aceitos', value: '100%' },
                { label: 'preservação', value: 'ISO' },
                { label: 'resposta', value: '24/7' }
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

      {/* Processo Pericial */}
      <section className="py-24 px-8 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
                processo pericial<BlueDot />
             </h2>
             <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-light">
                De contato inicial a laudo final em 2-4 semanas, seguindo rigorosos protocolos de preservação.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Triagem", desc: "Entendimento do caso, tipo de evidência, urgência e objetivos." },
              { step: "02", title: "Coleta", desc: "Preservação on-site ou remota com ferramentas certificadas." },
              { step: "03", title: "Análise", desc: "Exame técnico seguindo metodologia ISO 27042 e NIST." },
              { step: "04", title: "Laudo", desc: "Relatório técnico estruturado com achados e conclusões." },
              { step: "05", title: "Defesa", desc: "Apresentação executiva ou testemunho especializado em juízo." },
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
            precisa de perícia ou investigação?<BlueDot />
          </h2>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            solicite análise forense especializada para incidentes, processos judiciais ou investigações corporativas.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <Link
              to="/contato"
              className="inline-block bg-primary-container text-on-primary px-12 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              falar com perito
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
