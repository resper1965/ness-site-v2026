import React, { useState } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { X, Download, CheckCircle2, FileText } from "lucide-react";
import { CANAL_BASE } from "../config/api";
import BlueDot from "./BlueDot";

interface LeadMagnetProps {
  slug: string;
  title: string;
  description: string;
  items?: string[];
  ctaLabel?: string;
}

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
      <div className="p-8 md:p-10 rounded-3xl bg-primary-container/5 border border-primary-container/20 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="text-primary-container" size={24} />
            <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest">
              material gratuito
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-display text-white tracking-tight lowercase">
            {title}
            <BlueDot />
          </h3>
          <p className="text-sm text-on-surface-variant font-light leading-relaxed max-w-lg">
            {description}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-container text-on-primary px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Download size={16} />
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
                    <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest block mb-2">
                      download gratuito
                    </span>
                    <h3 className="text-2xl font-display text-white tracking-tight lowercase mb-2">
                      {title}
                      <BlueDot />
                    </h3>
                    <p className="text-sm text-on-surface-variant font-light">
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
                      className="w-full bg-primary-container text-on-primary py-3.5 rounded-xl font-display font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all disabled:opacity-50"
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
                  <p className="text-sm text-on-surface-variant font-light">
                    Verifique seu email. O material também estará disponível em
                    breve na sua caixa de entrada.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsSubmitted(false);
                    }}
                    className="text-primary-container font-display font-bold text-sm uppercase tracking-widest hover:brightness-110"
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
