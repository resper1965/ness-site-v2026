import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { m as motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, BarChart3, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { assessments, AssessmentConfig } from "../data/assessments";
import { CANAL_BASE } from "../config/api";
import { canalApi } from "../services/canal";
import BlueDot from "../components/BlueDot";
import SchemaOrg from "../components/SchemaOrg";

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

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-8">
        <div className="text-center">
          <h2 className="text-3xl font-display text-white mb-4">Assessment não encontrado</h2>
          <Link to="/" className="text-primary-container font-display font-bold text-sm uppercase tracking-widest">
            voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = config.questions.length;
  const maxScore = totalQuestions * 10;
  const question = config.questions[currentStep];
  const progress = ((currentStep + (showResult ? 1 : 0)) / totalQuestions) * 100;

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  }, [answers]);

  const scorePercent = Math.round((totalScore / maxScore) * 100);

  const level = useMemo(() => {
    return config.levels.find((l) => scorePercent >= l.min && scorePercent <= l.max) || config.levels[0];
  }, [scorePercent, config.levels]);

  const categoryScores = useMemo(() => {
    const scores: Record<string, { total: number; max: number }> = {};
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

  const handleAnswer = (score: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: score }));
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
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
      });
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest block mb-3">
              assessment gratuito
            </span>
            <h1 className="text-3xl md:text-4xl font-display text-white tracking-tight lowercase mb-2">
              {config.title}<BlueDot />
            </h1>
            <p className="text-on-surface-variant font-light">
              {config.subtitle}
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest">
                {showResult ? "resultado" : `pergunta ${currentStep + 1} de ${totalQuestions}`}
              </span>
              <span className="text-[11px] text-primary-container font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-container rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showResult ? (
              /* Question */
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] text-primary-container/60 font-bold uppercase tracking-widest">
                    {question.category}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-display text-white tracking-tight leading-snug">
                  {question.question}
                </h2>
                <div className="space-y-3">
                  {question.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option.score)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all group hover:border-primary-container/40 hover:bg-primary-container/5 ${
                        answers[question.id] === option.score
                          ? "border-primary-container/40 bg-primary-container/5"
                          : "border-white/5 bg-surface-container"
                      }`}
                    >
                      <span className="text-sm text-white group-hover:text-white font-light">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-on-surface-variant text-sm hover:text-white transition-colors mt-4"
                  >
                    <ArrowLeft size={16} />
                    anterior
                  </button>
                )}
              </motion.div>
            ) : (
              /* Result */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Score Gauge */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
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
                      <span className="text-4xl font-display font-bold text-white">
                        {scorePercent}
                      </span>
                      <span className="text-[11px] text-on-surface-variant uppercase tracking-widest">
                        pontos
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-lg font-display text-white">
                      {level.emoji} {level.label}
                    </span>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-4 p-6 rounded-2xl bg-surface-container border border-white/5">
                  <h3 className="text-xs text-primary-container font-bold uppercase tracking-widest mb-4">
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
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: level.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recommendation */}
                <div className="p-6 rounded-2xl bg-primary-container/5 border border-primary-container/20">
                  <h3 className="text-xs text-primary-container font-bold uppercase tracking-widest mb-3">
                    recomendação
                  </h3>
                  <p className="text-sm text-white/80 font-light leading-relaxed">
                    {level.recommendation}
                  </p>
                </div>

                {/* Email Collection or CTA */}
                {!showEmailForm && !emailSent && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full bg-primary-container text-on-primary py-4 rounded-xl font-display font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      receber relatório completo por email
                    </button>
                    <Link
                      to={`/contato?ref=assessment-${config.slug}&score=${scorePercent}`}
                      className="w-full block text-center border border-white/10 text-white py-4 rounded-xl font-display font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                    >
                      {level.cta}
                    </Link>
                  </div>
                )}

                {showEmailForm && !emailSent && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleEmailSubmit}
                    className="space-y-4 p-6 rounded-2xl bg-surface-container border border-white/5"
                  >
                    <h3 className="text-xs text-primary-container font-bold uppercase tracking-widest mb-2">
                      receba o relatório completo
                    </h3>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Seu nome"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email corporativo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
                    />
                    <input
                      name="company"
                      type="text"
                      required
                      placeholder="Empresa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
                    />
                    {submitError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-xl text-xs font-light flex items-start gap-3">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold mb-1">{submitError}</p>
                          <p className="text-red-400/80">Por favor, verifique sua conexão ou tente novamente em alguns instantes.</p>
                        </div>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-container text-on-primary py-3.5 rounded-xl font-display font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isLoading ? "enviando..." : "enviar relatório"}
                    </button>
                  </motion.form>
                )}

                {emailSent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-6 rounded-2xl bg-primary-container/5 border border-primary-container/20 space-y-3"
                  >
                    <CheckCircle2 className="text-primary-container mx-auto" size={32} />
                    <p className="text-white font-display">Relatório enviado!</p>
                    <Link
                      to={`/contato?ref=assessment-${config.slug}&score=${scorePercent}`}
                      className="text-primary-container font-display font-bold text-sm uppercase tracking-widest hover:brightness-110 inline-flex items-center gap-2"
                    >
                      {level.cta}
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
