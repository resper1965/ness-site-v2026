import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { assessments } from "../data/assessments";
import { canalApi } from "../services/canal";
import BlueDot from "../components/BlueDot";
import SchemaOrg from "../components/SchemaOrg";
import { routeMeta } from '../utils/meta';
import Turnstile from '../components/Turnstile';
import { evento, eventoUnico } from '../utils/eventos';
import { origemDaVisita } from '../utils/origem';

// Os questionários vivem em `src/data/assessments.ts`, só em português: a
// página não existe sob /en e /es, então não anuncia alternates.
export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, { title: 'assessment', semAlternates: true });
}

const CAMPO = "w-full bg-white/5 border border-white/35 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container";
const ROTULO = "mb-1.5 block text-[12.5px] text-on-surface-variant";

export default function Assessment() {
  const { type } = useParams<{ type: string }>();
  const config = assessments[type || ""];

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const respondeu = useRef(false);

  // Todos os hooks vêm antes do retorno antecipado. Com o `if (!config)` acima
  // deles, ir de um tipo válido para um inválido mudava a ordem dos hooks e
  // quebrava o render.
  const questions = config?.questions ?? [];
  const totalQuestions = questions.length;
  const maxScore = totalQuestions * 10;
  const question = questions[currentStep];
  const progress = totalQuestions ? ((currentStep + (showResult ? 1 : 0)) / totalQuestions) * 100 : 0;

  const totalScore = useMemo(() => Object.values(answers).reduce((sum, val) => sum + val, 0), [answers]);

  const scorePercent = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;

  const level = useMemo(
    () => config?.levels.find((l) => scorePercent >= l.min && scorePercent <= l.max) || config?.levels[0],
    [scorePercent, config],
  );

  const categoryScores = useMemo(() => {
    const scores: Record<string, { total: number; max: number }> = {};
    if (!config) return scores;
    config.categories.forEach((cat) => {
      scores[cat] = { total: 0, max: 0 };
    });
    config.questions.forEach((q) => {
      const cat = q.category;
      if (scores[cat]) {
        scores[cat].max += 10;
        scores[cat].total += answers[q.id] ?? 0;
      }
    });
    return scores;
  }, [answers, config]);

  // A pergunta troca sem recarregar a página. Sem mover o foco, ele caía no
  // body quando o botão respondido sumia, e o leitor de tela perdia a posição.
  useEffect(() => {
    if (respondeu.current) titulo.current?.focus();
  }, [currentStep, showResult]);

  if (!config || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-8">
        <div className="text-center">
          <h1 className="text-3xl font-display text-white mb-4">Assessment não encontrado</h1>
          <Link to="/" className="inline-flex min-h-11 items-center text-primary-container font-display font-medium text-sm uppercase tracking-widest">
            voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswer = (score: number) => {
    // A primeira resposta é o começo real: abrir a página não é começar.
    if (currentStep === 0) {
      eventoUnico(`assessment:${config.slug}`, 'assessment_start', { assessment: config.slug });
    }
    respondeu.current = true;
    setAnswers((prev) => ({ ...prev, [question.id]: score }));
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
      // `scorePercent` ainda não contabilizou esta resposta: soma na hora.
      const pontuacaoFinal = Math.round(((totalScore + score) / maxScore) * 100);
      evento('assessment_complete', { assessment: config.slug, score: pontuacaoFinal });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    setSubmitError(null);
    try {
      await canalApi.submitForm({
        formType: "assessment",
        assessmentType: config.slug,
        score: scorePercent,
        level: level.label,
        categoryScores,
        name: formData.get("name"),
        email: formData.get("email"),
        company: formData.get("company"),
        website: formData.get("website"),
        turnstileToken: formData.get("cf-turnstile-response"),
        ...origemDaVisita(),
      });
      evento('generate_lead', { form_type: 'assessment', assessment: config.slug, score: scorePercent });
      setEmailSent(true);
    } catch (err) {
      console.error("Form error:", err);
      setSubmitError("Erro ao enviar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SchemaOrg
        type="website"
        data={{
          name: `Assessment de ${config.title}`,
          description: config.description,
        }}
      />

      <div className="min-h-screen bg-surface-container-lowest pt-28 pb-20 px-8">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <span className="text-[11px] text-primary-container font-medium uppercase tracking-widest block mb-3">
              assessment gratuito
            </span>
            <h1 className="text-3xl md:text-4xl font-display text-white tracking-tight lowercase mb-2">
              {config.title}<BlueDot />
            </h1>
            <p className="text-on-surface-variant font-normal">
              {config.subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-widest">
                {showResult ? "resultado" : `pergunta ${currentStep + 1} de ${totalQuestions}`}
              </span>
              <span className="text-[11px] text-primary-container font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="progresso do assessment"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              className="h-1 bg-white/5 rounded-full overflow-hidden"
            >
              {/* scaleX, não width: a barra anda sem recalcular o layout. */}
              <div
                className="h-full origin-left rounded-full bg-primary-container transition-transform duration-300"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
          </div>

          {!showResult ? (
            <div key={question.id} className="space-y-6">
              <span className="block text-[11px] text-primary-container font-medium uppercase tracking-widest">
                {question.category}
              </span>
              <h2
                ref={titulo}
                tabIndex={-1}
                className="text-xl md:text-2xl font-display text-white tracking-tight leading-snug focus:outline-none focus-visible:ring-0"
              >
                {question.question}
              </h2>
              <div className="space-y-3">
                {question.options.map((option, i) => {
                  const escolhida = answers[question.id] === option.score;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-pressed={escolhida}
                      onClick={() => handleAnswer(option.score)}
                      className={`w-full text-left p-5 rounded-2xl border transition-colors hover:border-primary-container/60 hover:bg-primary-container/5 ${
                        escolhida
                          ? "border-primary-container/60 bg-primary-container/5"
                          : "border-white/30 bg-surface-container-low"
                      }`}
                    >
                      <span className="text-sm text-white font-normal">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex min-h-11 items-center gap-2 text-on-surface-variant text-sm hover:text-white transition-colors mt-4"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  anterior
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Score Gauge */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={level.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${scorePercent * 3.27} 327`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-medium text-white">
                      {scorePercent}
                    </span>
                    <span className="text-[11px] text-on-surface-variant uppercase tracking-widest">
                      pontos
                    </span>
                  </div>
                </div>
                <h2
                  ref={titulo}
                  tabIndex={-1}
                  className="text-lg font-display text-white focus:outline-none focus-visible:ring-0"
                >
                  {level.emoji} {level.label}
                </h2>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4 p-6 rounded-2xl bg-surface-container-low border border-white/5">
                <h3 className="text-xs text-primary-container font-medium uppercase tracking-widest mb-4">
                  breakdown por área
                </h3>
                {config.categories.map((cat) => {
                  const cs = categoryScores[cat];
                  const pct = cs.max > 0 ? Math.round((cs.total / cs.max) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{cat}</span>
                        <span className="text-xs text-on-surface-variant">{pct}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: level.color, width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendation */}
              <div className="p-6 rounded-2xl bg-primary-container/5 border border-primary-container/20">
                <h3 className="text-xs text-primary-container font-medium uppercase tracking-widest mb-3">
                  recomendação
                </h3>
                <p className="text-sm text-white/80 font-normal leading-relaxed">
                  {level.recommendation}
                </p>
              </div>

              {/* Email Collection or CTA */}
              {!showEmailForm && !emailSent && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(true)}
                    className="w-full bg-primary-container text-on-primary py-4 rounded-xl font-display font-medium uppercase tracking-widest text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} aria-hidden="true" />
                    receber relatório completo por email
                  </button>
                  <Link
                    to={`/contato?ref=assessment-${config.slug}&score=${scorePercent}`}
                    className="w-full block text-center border border-white/10 text-white py-4 rounded-xl font-display font-medium uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                  >
                    {level.cta}
                  </Link>
                </div>
              )}

              {showEmailForm && !emailSent && (
                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-4 p-6 rounded-2xl bg-surface-container-low border border-white/10"
                >
                  <h3 className="text-xs text-primary-container font-medium uppercase tracking-widest mb-2">
                    receba o relatório completo
                  </h3>

                  {/* Armadilha: fora da tela e fora do teclado. */}
                  <div aria-hidden="true" className="absolute w-px h-px overflow-hidden -left-[9999px]">
                    <label htmlFor="assessment-website">não preencha</label>
                    <input id="assessment-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor="assessment-nome" className={ROTULO}>nome</label>
                    <input id="assessment-nome" name="name" type="text" required autoComplete="name" className={CAMPO} />
                  </div>
                  <div>
                    <label htmlFor="assessment-email" className={ROTULO}>e-mail corporativo</label>
                    <input id="assessment-email" name="email" type="email" required autoComplete="email" className={CAMPO} />
                  </div>
                  <div>
                    <label htmlFor="assessment-empresa" className={ROTULO}>empresa</label>
                    <input id="assessment-empresa" name="company" type="text" required autoComplete="organization" className={CAMPO} />
                  </div>
                  <Turnstile action="assessment" />

                  {submitError && (
                    <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-xl text-xs font-normal flex items-start gap-3">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-medium mb-1">{submitError}</p>
                        <p className="text-red-300">Verifique sua conexão ou tente novamente em alguns instantes.</p>
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-container text-on-primary py-3.5 rounded-xl font-display font-medium uppercase tracking-widest text-xs hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isLoading ? "enviando..." : "enviar relatório"}
                  </button>
                </form>
              )}

              {emailSent && (
                <div role="status" className="text-center p-6 rounded-2xl bg-primary-container/5 border border-primary-container/20 space-y-3">
                  <CheckCircle2 className="text-primary-container mx-auto" size={32} aria-hidden="true" />
                  <p className="text-white font-display">Relatório enviado!</p>
                  <Link
                    to={`/contato?ref=assessment-${config.slug}&score=${scorePercent}`}
                    className="text-primary-container font-display font-medium text-sm uppercase tracking-widest hover:brightness-110 inline-flex min-h-11 items-center gap-2"
                  >
                    {level.cta}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
