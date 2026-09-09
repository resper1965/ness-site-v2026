import React from "react";
import { m as motion } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, ShieldCheck, Scale, Activity, Lock, Eye, Settings, BarChart3, Clock, CheckCircle2, Zap, Building2, Handshake } from "lucide-react";
import BlueDot from "../../components/BlueDot";
import SchemaOrg from "../../components/SchemaOrg";
import { routeMeta } from '../../utils/meta';
import HeroPicture from "../../components/HeroPicture";

export default function DpoService() {
  const { t } = useTranslation();

  const phases = [
    {
      step: "01",
      title: "diagnóstico",
      subtitle: "gap analysis & mapeamento",
      desc: "Mapeamento completo dos processos de tratamento de dados pessoais, inventário de bases legais, avaliação de maturidade e gap analysis conforme a LGPD e ISO 27701.",
      icon: Eye,
    },
    {
      step: "02",
      title: "adequação",
      subtitle: "implementação & políticas",
      desc: "Redação de políticas de privacidade, termos de uso, contratos de processamento, treinamento de equipes e implantação dos controles de privacidade exigidos pela ANPD.",
      icon: Settings,
    },
    {
      step: "03",
      title: "manutenção",
      subtitle: "operação contínua",
      desc: "Gestão contínua do programa de privacidade: atendimento a titulares (DSAR), gestão de consentimento, atualização de ROPA, resposta a incidentes e interlocução com ANPD.",
      icon: Activity,
    },
    {
      step: "04",
      title: "auditoria",
      subtitle: "verificação & melhoria",
      desc: "Auditorias periódicas de conformidade, revisão de controles técnicos, análise de impacto (DPIA/RIPD), relatórios executivos e planos de ação corretiva.",
      icon: BarChart3,
    },
  ];

  const differentiators = [
    {
      icon: Zap,
      title: "plataforma aegis",
      desc: "Tecnologia proprietária para gestão do programa de privacidade. ROPA automatizado, findings, dashboards executivos e audit trail. Sem aquisição de ferramentas externas.",
    },
    {
      icon: Settings,
      title: "foco em tecnologia & processos",
      desc: "Atuamos na interseção entre tecnologia e governança. Não somos escritório de advocacia — somos engenheiros de privacidade que implementam controles reais.",
    },
    {
      icon: Handshake,
      title: "parceria com jurídico",
      desc: "Trabalhamos em conjunto com o escritório de advocacia da sua organização, fornecendo os subsídios técnicos necessários para decisões jurídicas informadas.",
    },
    {
      icon: Building2,
      title: "multissetorial",
      desc: "Experiência em saúde, financeiro, indústria, tecnologia e governo. Adaptamos o programa de privacidade ao contexto regulatório do seu setor.",
    },
    {
      icon: Lock,
      title: "zero ferramentas extras",
      desc: "Tudo o que sua organização precisa para operar em conformidade está incluído no serviço. Aegis é a plataforma — não há custos adicionais de licenciamento.",
    },
    {
      icon: Clock,
      title: "SLA com resposta garantida",
      desc: "Nomeação formal junto à ANPD, canal dedicado para titulares, resposta a incidentes em até 72h e relatórios mensais de atividade do DPO.",
    },
  ];

  const aegisFeatures = [
    "Registro de Operações de Tratamento (ROPA) automatizado",
    "Gestão de consentimento e bases legais",
    "Gestão de solicitações de titulares (DSAR)",
    "Avaliação de impacto à proteção de dados (DPIA/RIPD)",
    "Auditorias e findings com pontuação de risco",
    "Dashboards executivos em tempo real",
    "Gestão de incidentes de privacidade",
    "Inventário de fornecedores e contratos DPA",
  ];

  const audiences = [
    {
      icon: BarChart3,
      title: "C-Level / Board",
      desc: "Dashboards executivos, KPIs de conformidade, redução de exposição regulatória e relatórios para conselho.",
    },
    {
      icon: Scale,
      title: "Jurídico",
      desc: "Subsídios técnicos para DPIA, contratos DPA, pareceres de base legal e interlocução com ANPD.",
    },
    {
      icon: ShieldCheck,
      title: "TI / CISO",
      desc: "Integração com controles de segurança existentes, mapeamento de fluxos de dados, privacy by design e testes de conformidade técnica.",
    },
  ];

  return (
    <main>
      <SchemaOrg
        type="service"
        data={{
          name: "DPO as a Service — trustness.",
          description:
            "Serviço de Data Protection Officer terceirizado com tecnologia proprietária Aegis para adequação, manutenção e auditoria de programas de privacidade corporativos conforme LGPD.",
          url: "https://trustness.com.br/dpo-as-a-service",
        }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <HeroPicture brand="trustness" opacity={0.15} grayscale />
          <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-container/15 blur-[120px] rounded-full z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-10"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-display text-xs tracking-[0.2em] uppercase">
              trustness. privacy operations
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
              dpo as a service<BlueDot />
            </h1>
            <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-normal">
              Seu programa de privacidade operado por especialistas. Adequação, manutenção e auditoria contínua da LGPD com a plataforma Aegis — sem investimento em ferramentas adicionais.
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link
                to="/contato?ref=dpo"
                className="bg-primary-container text-on-primary px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform"
              >
                agendar diagnóstico gratuito
              </Link>
              <a
                href="#como-funciona"
                className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-primary transition-colors group"
              >
                como funciona<BlueDot />
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-24 px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
              para quem é<BlueDot />
            </h2>
            <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-normal">
              O DPO as a Service da trustness. atende organizações de todos os portes que precisam de um programa de privacidade profissional, operacional e auditável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-primary-container/30 transition-colors group"
              >
                <a.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-display text-white mb-3 tracking-tight">{a.title}</h3>
                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona — 4 fases */}
      <section id="como-funciona" className="py-24 px-8 bg-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
              como funciona<BlueDot />
            </h2>
            <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-normal">
              Um ciclo contínuo de quatro fases que leva sua organização da análise inicial à maturidade plena em privacidade de dados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-primary-container/30 transition-colors group relative"
              >
                <span className="text-[64px] font-display font-medium text-primary-container/10 absolute top-4 right-6">
                  {phase.step}
                </span>
                <phase.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-[11px] text-primary-container font-medium uppercase tracking-widest block mb-2">
                  fase {phase.step}
                </span>
                <h3 className="text-xl font-display text-white mb-2 tracking-tight">{phase.title}</h3>
                <p className="text-xs text-primary-container/70 font-medium mb-3">{phase.subtitle}</p>
                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
                  {phase.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que trustness. */}
      <section className="py-24 px-8 bg-surface-container border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
              por que a trustness<BlueDot />
            </h2>
            <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-normal">
              Não somos escritório de advocacia. Somos engenheiros de privacidade com ferramentas próprias e visão operacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-3xl bg-surface-container-lowest border border-white/5 hover:border-primary-container/30 transition-colors group"
              >
                <d.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-lg font-display text-white mb-3 tracking-tight">{d.title}</h3>
                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
                  {d.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plataforma Aegis */}
      <section className="py-24 px-8 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-display text-[11px] tracking-[0.3em] uppercase mb-6">
                tecnologia proprietária
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter mb-6">
                plataforma aegis<BlueDot />
              </h2>
              <p className="text-on-surface-variant leading-relaxed font-normal mb-8">
                Toda a operação de privacidade da sua organização em uma única plataforma. O Aegis é o sistema nervoso central do programa de proteção de dados — integrado, auditável e acessível de qualquer lugar.
              </p>
              <p className="text-sm text-primary-container/80 font-medium">
                Incluso no serviço. Sem licenciamento adicional. Sem setup fee.
              </p>
            </div>

            <div className="space-y-3">
              {aegisFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container/50 border border-white/5"
                >
                  <CheckCircle2 size={20} className="text-primary-container shrink-0" />
                  <span className="text-white/90 font-display text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — GEO optimized */}
      <section className="py-24 px-8 bg-surface border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white lowercase-all tracking-tighter mb-12">
            perguntas frequentes<BlueDot />
          </h2>
          <SchemaOrg
            type="faq"
            data={{
              questions: [
                {
                  question: "O que é DPO as a Service?",
                  answer:
                    "É a terceirização da função de Encarregado de Proteção de Dados (DPO) prevista na LGPD. A trustness. assume essa responsabilidade, cuidando de toda a adequação, manutenção e auditoria do programa de privacidade da organização com tecnologia e processos especializados.",
                },
                {
                  question: "Preciso comprar alguma ferramenta adicional?",
                  answer:
                    "Não. A plataforma Aegis está incluída no serviço. É uma ferramenta proprietária da trustness. que cobre todo o ciclo de gestão de privacidade — ROPA, DSAR, DPIA, auditorias, dashboards e gestão de incidentes.",
                },
                {
                  question: "A trustness. substitui meu escritório de advocacia?",
                  answer:
                    "Não. A trustness. foca em tecnologia e processos de privacidade. Trabalhamos em parceria com o departamento jurídico ou escritório de advocacia da sua organização, fornecendo todos os subsídios técnicos necessários.",
                },
                {
                  question: "Como funciona a nomeação junto à ANPD?",
                  answer:
                    "Realizamos a nomeação formal do DPO junto à Autoridade Nacional de Proteção de Dados (ANPD) conforme exigido pela LGPD. Disponibilizamos canal dedicado para titulares de dados e protocolo de resposta a incidentes.",
                },
                {
                  question: "Qual o prazo para adequação inicial?",
                  answer:
                    "O diagnóstico inicial (gap analysis) leva de 2 a 4 semanas. A adequação completa varia conforme o porte e complexidade da organização, mas tipicamente leva de 3 a 6 meses para atingir maturidade operacional.",
                },
              ],
            }}
          />
          <div className="space-y-6">
            {[
              {
                q: "O que é DPO as a Service?",
                a: "É a terceirização da função de Encarregado de Proteção de Dados (DPO) prevista na LGPD. A trustness. assume essa responsabilidade, cuidando de toda a adequação, manutenção e auditoria do programa de privacidade da organização com tecnologia e processos especializados.",
              },
              {
                q: "Preciso comprar alguma ferramenta adicional?",
                a: "Não. A plataforma Aegis está incluída no serviço. É uma ferramenta proprietária da trustness. que cobre todo o ciclo de gestão de privacidade — ROPA, DSAR, DPIA, auditorias, dashboards e gestão de incidentes.",
              },
              {
                q: "A trustness. substitui meu escritório de advocacia?",
                a: "Não. A trustness. foca em tecnologia e processos de privacidade. Trabalhamos em parceria com o departamento jurídico ou escritório de advocacia da sua organização, fornecendo todos os subsídios técnicos necessários.",
              },
              {
                q: "Como funciona a nomeação junto à ANPD?",
                a: "Realizamos a nomeação formal do DPO junto à Autoridade Nacional de Proteção de Dados (ANPD) conforme exigido pela LGPD. Disponibilizamos canal dedicado para titulares de dados e protocolo de resposta a incidentes.",
              },
              {
                q: "Qual o prazo para adequação inicial?",
                a: "O diagnóstico inicial (gap analysis) leva de 2 a 4 semanas. A adequação completa varia conforme o porte e complexidade da organização, mas tipicamente leva de 3 a 6 meses para atingir maturidade operacional.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-6 rounded-2xl bg-surface-container border border-white/5 hover:border-primary-container/20 transition-colors"
              >
                <summary className="font-display text-white cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <ArrowRight size={16} className="text-primary-container group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-sm text-on-surface-variant font-normal leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-8 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-display font-medium text-white lowercase-all tracking-tighter">
            seu programa de privacidade em boas mãos<BlueDot />
          </h2>
          <p className="text-on-surface-variant text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Diagnóstico inicial gratuito. Sem compromisso. Avaliamos a maturidade do seu programa de privacidade e apresentamos um roadmap personalizado.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <Link
              to="/contato?ref=dpo"
              className="bg-primary-container text-on-primary px-12 py-5 rounded-full font-display font-medium text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              agendar diagnóstico gratuito
            </Link>
            <Link
              to="/contato?ref=trustness"
              className="border border-white/10 text-white px-12 py-5 rounded-full font-display font-medium text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              falar com especialista
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, {
    // A marca vem do sufixo; repetir aqui produz o título dobrado.
    title: 'DPO as a Service',
    description:
      'Serviço de DPO terceirizado da trustness. Adequação, manutenção e auditoria contínua dos processos de privacidade da sua organização com tecnologia proprietária Aegis. Sem necessidade de aquisição de ferramentas adicionais.',
  });
}
