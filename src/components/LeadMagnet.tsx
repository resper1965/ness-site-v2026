import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Download, CheckCircle2, FileText } from "lucide-react";
import { CANAL_BASE } from "../config/api";
import BlueDot from "./BlueDot";
import { BOTAO } from "./Abertura";
import Dialogo from "./Dialogo";
import Turnstile from "./Turnstile";

interface LeadMagnetProps {
  slug: string;
  title: string;
  description: string;
  items?: string[];
  ctaLabel?: string;
}

const CAMPO =
  "w-full rounded-xl border border-white/35 bg-white/5 px-5 py-3 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container";
const ROTULO = "mb-1.5 block text-[12.5px] text-on-surface-variant";

/**
 * Material gratuito em troca de contato. No desenho delicado: moldura de 1 px,
 * título a 17 px e o mesmo botão contido das outras telas. O botão não é mais
 * `whitespace-nowrap` em caixa alta espaçada — era a largura mínima dele que
 * empurrava a página para o lado no celular.
 *
 * O envio vai para `/submit-form`, que exige o token do Turnstile quando a
 * chave está instalada: sem o widget aqui, todo pedido era recusado.
 */
export default function LeadMagnet({ slug, title, description, items = [], ctaLabel }: LeadMagnetProps) {
  const { t } = useTranslation();
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fechar = () => {
    setIsOpen(false);
    setIsSubmitted(false);
  };

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
      website: formData.get("website"),
      turnstileToken: formData.get("cf-turnstile-response"),
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
      setError(
        t(
          "leadmagnet.erro",
          "não conseguimos registrar seu pedido agora. tente novamente ou escreva para contato@ness.com.br.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-6 rounded-2xl border border-white/10 p-6 md:flex-row md:items-center md:p-8">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="flex items-center gap-2 text-[12.5px] text-primary-container">
            <FileText size={16} aria-hidden="true" />
            {t("leadmagnet.rotulo", "material gratuito")}
          </p>
          <h3 className="font-display text-[17px] font-medium lowercase tracking-tight text-white">
            {title}
            <BlueDot />
          </h3>
          <p className="max-w-lg text-[13.5px] leading-relaxed text-on-surface-variant">{description}</p>
        </div>
        <button type="button" onClick={() => setIsOpen(true)} className={`${BOTAO} shrink-0 gap-2`}>
          <Download size={15} aria-hidden="true" />
          {ctaLabel ?? t("leadmagnet.baixar", "baixar gratuitamente")}
        </button>
      </div>

      <Dialogo aberto={isOpen} aoFechar={fechar} rotuloId={`${id}-titulo`} className="max-w-md">
        <div className="relative space-y-6 rounded-3xl border border-white/10 bg-surface-container-low p-8">
          <button
            type="button"
            aria-label={t("a11y.close", "fechar")}
            onClick={fechar}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={20} aria-hidden="true" />
          </button>

          {!isSubmitted ? (
            <>
              <div>
                <h2 id={`${id}-titulo`} className="mb-2 pr-10 font-display text-lg font-medium lowercase tracking-tight text-white">
                  {title}
                  <BlueDot />
                </h2>
                <p className="text-sm text-on-surface-variant">{description}</p>
              </div>

              {items.length > 0 && (
                <ul className="space-y-2">
                  {items.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                      <CheckCircle2 size={14} className="shrink-0 text-primary-container" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                  {items.length > 5 && (
                    <li className="pl-7 text-xs text-on-surface-variant">
                      {t("leadmagnet.mais_itens", { n: items.length - 5, defaultValue: "+{{n}} itens" })}
                    </li>
                  )}
                </ul>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Armadilha: fora da tela e fora do teclado. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor={`${id}-website`}>não preencha</label>
                  <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div>
                  <label htmlFor={`${id}-nome`} className={ROTULO}>{t("leadmagnet.nome", "nome")}</label>
                  <input id={`${id}-nome`} name="name" type="text" required autoComplete="name" className={CAMPO} />
                </div>
                <div>
                  <label htmlFor={`${id}-email`} className={ROTULO}>{t("leadmagnet.email", "e-mail corporativo")}</label>
                  <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className={CAMPO} />
                </div>
                <div>
                  <label htmlFor={`${id}-empresa`} className={ROTULO}>{t("leadmagnet.empresa", "empresa")}</label>
                  <input id={`${id}-empresa`} name="company" type="text" required autoComplete="organization" className={CAMPO} />
                </div>
                <Turnstile action="contato" />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-primary-container py-3 font-display text-[13.5px] font-medium text-on-primary transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {isLoading ? t("common.sending", "enviando...") : t("leadmagnet.enviar", "receber material")}
                </button>
                {error && (
                  <p role="alert" className="text-center text-xs text-red-400">
                    {error}
                  </p>
                )}
                <p className="text-center text-[12px] text-on-surface-variant">
                  {t("leadmagnet.privacidade", "não compartilhamos seus dados.")}
                </p>
              </form>
            </>
          ) : (
            <div role="status" className="space-y-4 py-8 text-center">
              <CheckCircle2 className="mx-auto text-primary-container" size={32} aria-hidden="true" />
              <h2 id={`${id}-titulo`} className="font-display text-xl text-white">
                {t("leadmagnet.enviado", "material enviado")}
                <BlueDot />
              </h2>
              <p className="text-sm text-on-surface-variant">
                {t("leadmagnet.enviado_texto", "confira seu e-mail: o material chega na sua caixa de entrada.")}
              </p>
              <button
                type="button"
                onClick={fechar}
                className="min-h-11 font-display text-[13.5px] font-medium text-primary-container hover:brightness-110"
              >
                {t("a11y.close", "fechar")}
              </button>
            </div>
          )}
        </div>
      </Dialogo>
    </>
  );
}
