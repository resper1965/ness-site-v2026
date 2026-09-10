import React, { useState } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { X, Download, CheckCircle2, FileText } from "lucide-react";
import { CANAL_BASE } from "../config/api";
import BlueDot from "./BlueDot";
import { BOTAO } from "./Abertura";

interface LeadMagnetProps {
  slug: string;
  title: string;
  description: string;
  items?: string[];
  ctaLabel?: string;
}

/**
 * Material gratuito em troca de contato. No desenho delicado: moldura de 1 px,
 * título a 17 px e o mesmo botão contido das outras telas. O botão não é mais
 * `whitespace-nowrap` em caixa alta espaçada — era a largura mínima dele que
 * empurrava a página para o lado no celular.
 */
export default function LeadMagnet({
  slug,
  title,
  description,
  items = [],
  ctaLabel = "baixar gratuitamente",
}: LeadMagnetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      formType: "lead-magnet",
      materialSlug: slug,
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
    };

    setError(null);
    try {
      const res = await fetch(`${CANAL_BASE}/api/submit-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setIsSubmitted(true);
    } catch {
      setError("não conseguimos registrar seu pedido agora. tente novamente ou escreva para contato@ness.com.br.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Inline CTA Card */}
      <div className="flex flex-col items-start gap-6 rounded-2xl border border-white/10 p-6 md:flex-row md:items-center md:p-8">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="flex items-center gap-2 text-[12.5px] text-primary-container">
            <FileText size={16} aria-hidden="true" />
            material gratuito
          </p>
          <h3 className="font-display text-[17px] font-medium lowercase tracking-tight text-white">
            {title}
            <BlueDot />
          </h3>
          <p className="max-w-lg text-[13.5px] leading-relaxed text-on-surface-variant">
            {description}
          </p>
        </div>
        <button onClick={() => setIsOpen(true)} className={`${BOTAO} shrink-0 gap-2`}>
          <Download size={15} aria-hidden="true" />
          {ctaLabel}
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-surface-container border border-white/10 rounded-3xl p-8 space-y-6"
            >
              <button
                type="button"
                aria-label="fechar"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {!isSubmitted ? (
                <>
                  <div>
                    <span className="mb-2 block text-[12.5px] text-primary-container">
                      download gratuito
                    </span>
                    <h3 className="mb-2 font-display text-lg font-medium lowercase tracking-tight text-white">
                      {title}
                      <BlueDot />
                    </h3>
                    <p className="text-sm text-on-surface-variant font-normal">
                      {description}
                    </p>
                  </div>

                  {items.length > 0 && (
                    <div className="space-y-2">
                      {items.slice(0, 5).map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm text-white/80"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-primary-container shrink-0"
                          />
                          {item}
                        </div>
                      ))}
                      {items.length > 5 && (
                        <p className="text-xs text-on-surface-variant pl-7">
                          +{items.length - 5} itens
                        </p>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Seu nome"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email corporativo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                    />
                    <input
                      name="company"
                      type="text"
                      required
                      placeholder="Empresa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-xl bg-primary-container py-3 font-display text-[13.5px] font-medium text-on-primary transition-all hover:brightness-110 disabled:opacity-50"
                    >
                      {isLoading ? "enviando..." : "receber material"}
                    </button>
                    {error && (
                      <p role="alert" className="text-xs text-red-400 text-center">{error}</p>
                    )}
                    <p className="text-[11px] text-on-surface-variant/60 text-center">
                      Não compartilhamos seus dados. Política de privacidade
                      LGPD.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto">
                    <CheckCircle2
                      className="text-primary-container"
                      size={32}
                    />
                  </div>
                  <h3 className="text-xl font-display text-white">
                    Material enviado!
                  </h3>
                  <p className="text-sm text-on-surface-variant font-normal">
                    Verifique seu email. O material também estará disponível em
                    breve na sua caixa de entrada.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsSubmitted(false);
                    }}
                    className="font-display text-[13.5px] font-medium text-primary-container hover:brightness-110"
                  >
                    fechar
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
