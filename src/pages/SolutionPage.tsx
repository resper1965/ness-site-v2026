import BlueDot, { NomeDeProduto } from '../components/BlueDot';
import Abertura, { BOTAO, LINK } from '../components/Abertura';
import EmergencyChatModal from '../components/EmergencyChatModal';
import SolutionHeroBackground from '../components/solutions/SolutionHeroBackground';
import SolutionServicesGrid from '../components/solutions/SolutionServicesGrid';
import FluxoDoEvento from '../components/solutions/FluxoDoEvento';
import RespostaAIncidente from '../components/solutions/RespostaAIncidente';
import Escopo from '../components/solutions/Escopo';
import Entregaveis from '../components/solutions/Entregaveis';
import Operacao from '../components/solutions/Operacao';
import Ativacao from '../components/solutions/Ativacao';
import LeadMagnet from '../components/LeadMagnet';
import NotFound from './NotFound';
import React, { useEffect, useState } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeMeta } from '../utils/meta';
import Breadcrumbs from '../components/Breadcrumbs';
import { solutionsData } from "../data/solutionsData";
import SchemaOrg from '../components/SchemaOrg';
import { useBrand, BRAND_DOMAINS } from '../config/brand';
import { CheckCircle2, ExternalLink, ChevronDown } from "lucide-react";




const SolutionPage = () => {
  const BRAND = useBrand();
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const solution = slug ? solutionsData[slug] : null;
  const PageIcon = (solution?.icon || CheckCircle2) as React.ComponentType<{ className?: string; size?: number }>;
  const [showTech, setShowTech] = useState(false);
  const [isEmergencyChatOpen, setIsEmergencyChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowTech(false);
  }, [slug]);

  if (!solution) return <NotFound />;

  // O n.cirt abre a sala de emergência; os demais levam ao contato.
  const acionar = () => {
    if (slug === 'cirt') {
      setIsEmergencyChatOpen(true);
    } else {
      navigate(`/contato?ref=${slug}`);
    }
  };

  return (
    <>
      <SchemaOrg
        type="service"
        data={{
          name: solution.metaTitle || t(`solutions.${slug}.title`),
          description: solution.apresentacao || solution.overview || '',
          url: `${BRAND_DOMAINS[BRAND]}/solucoes/${slug}`
        }}
      />
      <div className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen overflow-hidden">
      {/* Immersive Background for Solution Page */}
      <SolutionHeroBackground slug={slug!} />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* O schema já sai do shell; aqui é só a trilha visível. */}
        <Breadcrumbs semSchema />

        {/* Com a ficha preenchida, o produto passa ao desenho por diagramas: o h1
            é a promessa, e o nome do produto vira a marca acima dela. */}
        {solution.promessa ? (
          <Abertura
            marca={<NomeDeProduto nome={t(`solutions.${slug}.title`)} />}
            titulo={solution.promessa}
            acoes={
              <>
                <button onClick={acionar} className={BOTAO}>{t(`solutions.${slug}.cta`)}</button>
                <a href="#resposta" className={LINK}>ver quem age em cada nível</a>
              </>
            }
          >
            {solution.apresentacao}
          </Abertura>
        ) : (
        <div className="mb-24 grid items-center gap-16 max-w-3xl">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
                <PageIcon className="text-primary-container" size={32} />
              </div>
              <h1 className="text-2xl font-brand font-medium text-white lowercase-all">
                {t(`solutions.${slug}.title`).split('.')[0]}<span className="text-primary-container">.</span>{t(`solutions.${slug}.title`).split('.')[1]}
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight leading-tight lowercase">
              {t(`solutions.${slug}.fullTitle`)}<BlueDot />
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant font-normal leading-relaxed">
              {solution.overview || t(`solutions.${slug}.longDesc`)}
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={acionar}
                className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-display font-semibold text-sm hover:brightness-110 transition-all">
                {t(`solutions.${slug}.cta`)}
              </button>
            </div>
          </div>
        </div>
        )}

        {/* A ordem é a das perguntas do comprador: como funciona, quem age,
            até onde vai, quem é chamado, o que recebo, como começa. */}
        <FluxoDoEvento fontes={solution.fontes} />

        <RespostaAIncidente severidade={solution.severidade} workflow={solution.workflow} />

        <Escopo escopo={solution.escopo} />

        <Operacao operacao={solution.operacao} onboarding={solution.onboarding} />

        <Entregaveis entregaveis={solution.entregaveis} />

        <Ativacao produto={t(`solutions.${slug}.title`)} etapas={solution.operacao?.ativacao} nota={solution.operacao?.ativacaoNota} />

        {/* NEW Soluções Estratégicas (Full Width SaaS Modules) */}
        <SolutionServicesGrid services={solution.services} icon={PageIcon} />

        {solution.features && solution.features.length > 0 && (
          <div className="mb-24 -mt-8">
            {/* Era uma nuvem de pilulas escalonadas com opacidade decrescente:
                sugeria hierarquia que ninguem decidiu, e o item de baixo
                parecia menos importante sem motivo. Lista, para conferir. */}
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {solution.features.map((feat) => (
                <li key={feat.name} className="flex items-baseline gap-3 border-b border-white/5 py-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-container" aria-hidden="true" />
                  <span className="text-sm text-white">{feat.name}</span>
                  <span className="ml-auto text-[11px] uppercase tracking-widest text-on-surface-variant/70">
                    {feat.category}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quatro situações (Casos de Uso, renomeado) */}
        {solution.useCases && (
          <section id="situacoes" className="mb-24">
            <div className="mb-12">
              <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase">
                {t('solutions.use_cases', 'quatro situações')}<BlueDot />
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solution.useCases.map((useCase: { title: string; desc: string }, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 lg:p-10 rounded-4xl bg-surface-container-low/10 border border-white/5 hover:bg-surface-container-low/30 hover:border-primary/20 transition-all group flex flex-col justify-between"
                >
                  <h4 className="text-white font-medium text-lg lg:text-xl leading-tight mb-4 group-hover:text-primary-container transition-colors pr-6">{useCase.title}</h4>
                  <p className="text-on-surface-variant font-normal text-sm">{useCase.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Lead Magnet — DevSecOps */}
        {(slug === 'secops' || slug === 'devsecops' || slug === 'devarch') && (
          <div className="mb-24">
            <LeadMagnet
              slug="devsecops-checklist"
              title="checklist devsecops — pipeline seguro em 15 passos"
              description="Guia prático para implementar segurança em cada etapa do seu pipeline CI/CD. Da análise de código ao deploy em produção."
              items={[
                "SAST/DAST automatizados no pipeline",
                "Gestão de secrets com vault",
                "Container scanning & SBOM",
                "WAF e proteção de runtime",
                "Monitoramento com SIEM/SOAR",
              ]}
            />
          </div>
        )}

        {/* No desenho novo o fecho diz qual é o primeiro passo; no antigo fica o banner. */}
        {solution.fecho ? (
          <section id="fecho" className="mb-24 grid justify-items-start gap-4 border-t border-white/10 pt-16">
            <h2 className="font-display text-xl font-medium lowercase tracking-tight text-white">
              {solution.fecho.titulo}<BlueDot />
            </h2>
            <p className="max-w-[60ch] text-[15px] leading-relaxed text-on-surface-variant">{solution.fecho.texto}</p>
            <button onClick={acionar} className={BOTAO}>{solution.ctaLabel}</button>
          </section>
        ) : (
        <div className="mb-24 p-12 lg:p-16 rounded-[4rem] bg-surface-container-low border border-white/5 nebula-shadow relative overflow-hidden group text-center">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary-container/10 opacity-50 backdrop-blur-md"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 scale-150 group-hover:scale-110 transition-transform duration-1000">
            <PageIcon size={400} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h4 className="text-3xl lg:text-5xl font-display font-medium text-white mb-6 tracking-tight lowercase">{t('solutions.cta_title', 'fale com o time que opera')}<BlueDot /></h4>
            <p className="text-lg text-on-surface-variant font-normal leading-relaxed mb-10">{t('solutions.cta_desc', 'conte o cenário: você sai da conversa sabendo o que entra no escopo e o que fica de fora.')}</p>
            <button
              onClick={acionar}
              className="whitespace-nowrap rounded-full bg-primary-container px-10 py-5 font-display text-sm font-semibold uppercase tracking-widest text-on-primary shadow-lg shadow-primary-container/25 transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,173,232,0.4)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low">
              {solution.ctaLabel}
            </button>
          </div>
        </div>
        )}

        {solution.technicalFeatures && solution.technicalFeatures.length > 0 && (
          <section id="tecnologia" className="mb-24 pt-12 border-t border-white/5">
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowTech(!showTech)}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-surface-container-low border border-white/10 hover:bg-surface-container-low/80 hover:border-primary/20 transition-all text-on-surface-variant text-xs font-medium uppercase tracking-[0.2em] shadow-lg shadow-black/20"
              >
                {t('solutions.technical_view_toggle', 'visão para engenharia & ctos')}
                <motion.div animate={{ rotate: showTech ? 180 : 0 }}>
                  <ChevronDown size={16} className="text-primary" />
                </motion.div>
              </button>
            </div>

            <AnimatePresence>
              {showTech && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 pt-6">
                    <div className="max-w-xl">
                      <h3 className="text-xl md:text-2xl font-display font-semibold text-white tracking-tight lowercase">{t('solutions.tech_engine', 'o motor da resiliência')}<BlueDot /></h3>
                      <p className="text-on-surface-variant mt-4 font-normal">{t('solutions.tech_desc', 'para os interessados na engenharia por trás da proteção, aqui estão os pilares técnicos que sustentam nossa entrega de valor.')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                    {solution.technicalFeatures.map((feat: { title: string; desc: string }, i: number) => (
                      <div key={i} className="p-8 rounded-3xl border border-white/5 bg-surface-container-low/20 hover:border-primary/20 transition-all">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          {feat.title}
                        </h4>
                        <p className="text-on-surface-variant text-xs font-normal leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {solution.portfolio?.length ? (
          <section id="portfolio">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-10 tracking-tight lowercase">{t('solutions.impact_portfolio', 'portfólio de impacto')}<BlueDot /></h3>
            <div className="grid md:grid-cols-2 gap-8">
              {solution.portfolio.map((item: { client: string; project: string; result: string }, i: number) => (
                <div key={i} className="p-8 rounded-4xl border border-white/5 bg-linear-to-br from-surface-container-low to-surface-container-lowest">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-primary font-medium">{item.client}</span>
                      <h4 className="text-xl text-white mt-1 font-medium">{item.project}</h4>
                    </div>
                    <ExternalLink className="text-on-surface-variant/80" size={20} />
                  </div>
                  <div className="p-4 rounded-xl bg-primary-container/5 border border-primary-container/10">
                    <p className="text-primary-container text-sm font-medium">{t('common.result')}: {item.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <EmergencyChatModal
        isOpen={isEmergencyChatOpen}
        onClose={() => setIsEmergencyChatOpen(false)}
      />
    </div>
    </>
  );
};


export default SolutionPage;

// Slug inválido não é página: sai noindex, e o componente já renderiza o 404.
export function meta(args: Parameters<typeof routeMeta>[0] & { params: { slug?: string } }) {
  const solution = args.params.slug ? solutionsData[args.params.slug] : null;
  if (!solution) {
    return routeMeta(args, { title: 'página não encontrada', noindex: true, semAlternates: true });
  }
  // Conteúdo só em português: a página não existe sob /en e /es.
  return routeMeta(args, {
    title: solution.metaTitle,
    description: solution.metaDescription || solution.overview,
    semAlternates: true,
  });
}
