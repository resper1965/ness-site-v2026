import BlueDot from '../components/BlueDot';
import React, {  } from "react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from '../hooks/usePageTitle';
import { encryptZeroTrustPayload } from '../utils/crypto';
import { CANAL_BASE } from '../config/api';
import { 
AlertTriangle} from "lucide-react";




const Compliance = () => {
  const { t } = useTranslation();
  usePageTitle('compliance.meta_title', 'compliance — ness.');
  const { type } = useParams();

  const content = {
    termos: {
      title: t('compliance.terms.title', "termos de uso"),
      desc: t('compliance.terms.desc', "regras e diretrizes para utilização de nossas plataformas e serviços."),
      sections: [
        {
          h: t('compliance.terms.sec1.h', "1. aceitação"),
          p: t('compliance.terms.sec1.p', "ao acessar nossas soluções, você concorda em cumprir estes termos e todas as leis e regulamentos aplicáveis.")
        },
        {
          h: t('compliance.terms.sec2.h', "2. propriedade intelectual"),
          p: t('compliance.terms.sec2.p', "todo o conteúdo, software e metodologias da ness. são protegidos por direitos de propriedade intelectual e não podem ser reproduzidos sem autorização prevía.")
        },
        {
          h: t('compliance.terms.sec3.h', "3. responsabilidade"),
          p: t('compliance.terms.sec3.p', "a ness. se compromete com a máxima disponibilidade e segurança, mas não se responsabiliza por danos decorrentes do uso indevido das credenciais por parte do usuário.")
        }
      ]
    },
    privacidade: {
      title: t('compliance.privacy.title', "política de privacidade"),
      desc: t('compliance.privacy.desc', "como tratamos seus dados com segurança e transparência."),
      sections: [
        {
          h: t('compliance.privacy.sec1.h', "1. coleta de dados"),
          p: t('compliance.privacy.sec1.p', "coletamos apenas as informações necessárias para fornecer nossos serviços de engenharia e segurança, como dados de contato corporativo e logs técnicos de segurança.")
        },
        {
          h: t('compliance.privacy.sec2.h', "2. finalidade"),
          p: t('compliance.privacy.sec2.p', "seus dados são utilizados exclusivamente para a execução de contratos, suporte técnico, melhoria de nossas soluções e conformidade legal (LGPD).")
        },
        {
          h: t('compliance.privacy.sec3.h', "3. segurança"),
          p: t('compliance.privacy.sec3.p', "implementamos medidas técnicas e organizacionais de ponta, incluindo criptografia e controle de acesso rigoroso, para proteger suas informações contra acessos não autorizados.")
        },
        {
          h: t('compliance.privacy.sec4.h', "4. seus direitos"),
          p: t('compliance.privacy.sec4.p', "você tem o direito de acessar, corrigir, excluir ou solicitar a portabilidade de seus dados a qualquer momento através do nosso canal de privacidade.")
        }
      ]
    },
    etica: {
      title: t('compliance.ethics.title', "compliance & ética"),
      desc: t('compliance.ethics.desc', "nosso compromisso com a integridade e conduta ética global."),
      sections: [
        {
          h: t('compliance.ethics.sec1.h', "1. código de conduta"),
          p: t('compliance.ethics.sec1.p', "operamos sob os mais altos padrões de ética profissional, combatendo qualquer forma de corrupção, discriminação ou conduta antiética.")
        },
        {
          h: t('compliance.ethics.sec2.h', "2. canal de denúncias"),
          p: t('compliance.ethics.sec2.p', "mantemos um canal independente e anônimo para relato de violacões ao nosso código de conduta ou legislações vigentes.")
        },
        {
          h: t('compliance.ethics.sec3.h', "3. certificações"),
          p: t('compliance.ethics.sec3.p', "nossas operações são auditadas e seguem frameworks internacionais como ISO 27001 e SOC2, garantindo governança de classe mundial.")
        }
      ]
    }
  };

  const current = content[type as keyof typeof content] || content.termos;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            {t('compliance.eyebrow')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-white tracking-tighter mb-6 lowercase-all">
            {current.title}<BlueDot />
          </h1>
          <p className="text-xl text-on-surface-variant font-light">
            {current.desc}
          </p>
        </div>

        <div className="flex gap-4 mb-12 border-b border-white/5 pb-4 overflow-x-auto">
          {Object.keys(content).map((key) => (
            <Link
              key={key}
              to={`/compliance/${key}`}
              className={`text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-full transition-all whitespace-nowrap ${
                type === key ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:text-white"
              }`}
            >
              {key === "etica" ? t('footer.compliance') : key === "termos" ? t('footer.terms') : t('footer.privacy')}
            </Link>
          ))}
        </div>

        <div className="space-y-12">
          {current.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-white lowercase-all">{section.h}</h3>
              <p className="text-on-surface-variant font-light leading-relaxed">
                {section.p}
              </p>
            </motion.div>
          ))}
        </div>

        {type === "etica" && (
          <>
            <div className="h-px bg-white/5 w-full mt-24"></div>
            <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 p-12 rounded-[2.5rem] bg-primary-container/5 border border-primary-container/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <AlertTriangle size={120} className="text-primary-container" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-display font-bold text-white mb-4 lowercase-all">{t('contact.whistleblower.title')}<BlueDot /></h3>
              <p className="text-on-surface-variant font-light leading-relaxed mb-8">
                {t('contact.whistleblower.desc')}
              </p>
              
              <form 
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = {
                    formType: "whistleblower",
                    name: formData.get("name") || "Anônimo",
                    email: formData.get("email") || "N/A",
                    subject: formData.get("subject"),
                    message: formData.get("message")
                  };
                  try {
                    // ZERO-TRUST ARCHITECTURE: Encrypt the payload before sending to backend
                    const cipherData = await encryptZeroTrustPayload(payload);
                    const securePayload = {
                      formType: "whistleblower_encrypted",
                      cipherData: cipherData,
                      timestamp: new Date().toISOString()
                    };

                    const response = await fetch(`${CANAL_BASE}/api/submit-form`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(securePayload)
                    });
                    if (response.ok) {
                      // Success feedback
                      (e.target as HTMLFormElement).reset();
                    } else {
                      throw new Error("Failed to submit");
                    }
                  } catch (error) {
                    alert(t('contact.whistleblower.form.error'));
                  }
                }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.name_optional')}</label>
                    <input name="name" type="text" placeholder={t('contact.form.name_placeholder', 'seu nome ou deixe em branco')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"  aria-label="Input field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.contact_optional')}</label>
                    <input name="email" type="text" placeholder={t('contact.form.email_placeholder', 'email ou telefone para retorno')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"  aria-label="Input field" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.whistleblower.occurrence_type')}</label>
                  <select name="subject" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none">
                    <option value="" className="bg-surface">{t('contact.whistleblower.category_select')}</option>
                    <option value="etica" className="bg-surface">{t('contact.whistleblower.categories.ethics')}</option>
                    <option value="assédio" className="bg-surface">{t('contact.whistleblower.categories.harassment')}</option>
                    <option value="fraude" className="bg-surface">{t('contact.whistleblower.categories.fraud')}</option>
                    <option value="segurança" className="bg-surface">{t('contact.whistleblower.categories.security')}</option>
                    <option value="outros" className="bg-surface">{t('contact.whistleblower.categories.others')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.whistleblower.description')}</label>
                  <textarea name="message" required rows={6} placeholder={t('contact.whistleblower.desc_placeholder', 'detalhe o ocorrido com o máximo de informações possíveis (datas, locais, envolvidos)...')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all resize-none"></textarea>
                </div>
                <button className="w-full bg-primary-container text-on-primary py-5 rounded-2xl font-display font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl shadow-primary-container/20">
                  {t('contact.whistleblower.form.send_button')}
                </button>
              </form>
            </div>
          </motion.div>
          </>
        )}

        <div className="mt-24 p-8 rounded-3xl bg-surface-container-low/30 border border-white/5">
          <p className="text-sm text-on-surface-variant font-light italic">
            {t('contact.whistleblower.last_update')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};


export default Compliance;
