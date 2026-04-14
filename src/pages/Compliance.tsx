import BlueDot from '../components/BlueDot';
import React, {  } from "react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
AlertTriangle} from "lucide-react";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;



const Compliance = () => {
  const { t } = useTranslation();
  const { type } = useParams();

  const content = {
    termos: {
      title: "termos de uso",
      desc: "regras e diretrizes para utilização de nossas plataformas e serviços.",
      sections: [
        {
          h: "1. aceitação",
          p: "ao acessar nossas soluções, você concorda em cumprir estes termos e todas as leis e regulamentos aplicáveis."
        },
        {
          h: "2. propriedade intelectual",
          p: "todo o conteúdo, software e metodologias da ness. são protegidos por direitos de propriedade intelectual e não podem ser reproduzidos sem autorização prevía."
        },
        {
          h: "3. responsabilidade",
          p: "a ness. se compromete com a máxima disponibilidade e segurança, mas não se responsabiliza por danos decorrentes do uso indevido das credenciais por parte do usuário."
        }
      ]
    },
    privacidade: {
      title: "política de privacidade",
      desc: "como tratamos seus dados com segurança e transparência.",
      sections: [
        {
          h: "1. coleta de dados",
          p: "coletamos apenas as informações necessárias para fornecer nossos serviços de engenharia e segurança, como dados de contato corporativo e logs técnicos de segurança."
        },
        {
          h: "2. finalidade",
          p: "seus dados são utilizados exclusivamente para a execução de contratos, suporte técnico, melhoria de nossas soluções e conformidade legal (LGPD)."
        },
        {
          h: "3. segurança",
          p: "implementamos medidas técnicas e organizacionais de ponta, incluindo criptografia e controle de acesso rigoroso, para proteger suas informações contra acessos não autorizados."
        },
        {
          h: "4. seus direitos",
          p: "você tem o direito de acessar, corrigir, excluir ou solicitar a portabilidade de seus dados a qualquer momento através do nosso canal de privacidade."
        }
      ]
    },
    etica: {
      title: "compliance & ética",
      desc: "nosso compromisso com a integridade e conduta ética global.",
      sections: [
        {
          h: "1. código de conduta",
          p: "operamos sob os mais altos padrões de ética profissional, combatendo qualquer forma de corrupção, discriminação ou conduta antiética."
        },
        {
          h: "2. canal de denúncias",
          p: "mantemos um canal independente e anônimo para relato de violações ao nosso código de conduta ou legislações vigentes."
        },
        {
          h: "3. certificações",
          p: "nossas operações são auditadas e seguem frameworks internacionais como ISO 27001 e SOC2, garantindo governança de classe mundial."
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
            compliance — ness. precision
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
                    formType: "whistleblowing",
                    name: formData.get("name") || "Anônimo",
                    email: formData.get("email") || "N/A",
                    subject: formData.get("subject"),
                    message: formData.get("message")
                  };
                  try {
                    const response = await fetch("/api/submit-form", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload)
                    });
                    if (response.ok) {
                      // Success feedback
                      (e.target as HTMLFormElement).reset();
                    } else {
                      throw new Error("Failed to submit");
                    }
                  } catch (error) {
                    alert("Erro ao enviar denúncia. Por favor, tente novamente.");
                  }
                }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.name_optional')}</label>
                    <input name="name" type="text" placeholder="seu nome ou deixe em branco" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.contact_optional')}</label>
                    <input name="email" type="text" placeholder="email ou telefone para retorno" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
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
                  <textarea name="message" required rows={6} placeholder="detalhe o ocorrido com o máximo de informações possíveis (datas, locais, envolvidos)..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all resize-none"></textarea>
                </div>
                <button className="w-full bg-primary-container text-on-primary py-5 rounded-2xl font-display font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl shadow-primary-container/20">
                  enviar denúncia segura
                </button>
              </form>
            </div>
          </motion.div>
          </>
        )}

        <div className="mt-24 p-8 rounded-3xl bg-surface-container-low/30 border border-white/5">
          <p className="text-sm text-on-surface-variant font-light italic">
            última atualização: 14 de abril de 2024. para dúvidas adicionais, entre em contato com nosso DPO em dpo@ness.com.br
          </p>
        </div>
      </div>
    </motion.div>
  );
};


export default Compliance;
