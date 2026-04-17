import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      "nav": {
        "solutions": "soluções",
        "about": "sobre",
        "portfolio": "portfólio",
        "blog": "blog",
        "careers": "carreiras",
        "contact": "contato",
        "services": "serviços"
      },
      "hero": {
        "tag": "engenharia digital de precisão",
        "title": "invisíveis quando tudo funciona. <highlight>presentes</highlight> quando mais importa",
        "subtitle": "elevamos a resiliência digital da sua empresa através de operações precisas e arquiteturas de segurança invisíveis.",
        "explore": "explorar soluções",
        "know_ness": "conheça a ness"
      },
      "presence": {
        "global": "presença global",
        "locations": {
          "brazil": "brasil",
          "portugal": "portugal",
          "chile": "chile",
          "peru": "peru",
          "colombia": "colômbia",
          "usa": "estados unidos"
        }
      },
      "solutions": {
        "title": "nossas soluções",
        "subtitle": "tecnologia de elite para empresas que não aceitam falhas.",
        "technical_view_toggle": "visão para engenharia & ctos",
        "active_resilience": "resiliência ativa",
        "intelligence_flow": "fluxo de inteligência",
        "secops": {
          "title": "n.secops",
          "fullTitle": "resiliência operacional & continuidade",
          "desc": "silenciando alarmes e bloqueando incidentes na fonte com IA e abstração total.",
          "longDesc": "o n.secops não é apenas sobre tecnologia; é sobre a sobrevivência do seu negócio. protegemos sua reputação e sua operação através de um centro de operações de segurança (SOC) de elite que monitora, detecta e neutraliza ameaças antes que causem impacto.",
          "cta": "solicitar diagnóstico de segurança"
        },
        "infraops": {
          "title": "n.infraops",
          "fullTitle": "infraestrutura inteligente & suporte global",
          "desc": "arquitetura finops: nuvem invisível, elástica e com uptime cravado em pedra.",
          "longDesc": "o n.infraops redefine o suporte técnico tradicional. unimos a robustez do framework ITIL à agilidade de um sistema de IA aplicada que atua como copiloto das nossas operações.",
          "cta": "otimizar minha infraestrutura"
        },
        "devarch": {
          "title": "n.devarch",
          "fullTitle": "arquitetura orientada ao desenvolvedor & escala segura",
          "desc": "fim do débito técnico: engenharia hexagonal focada em longevidade sem breaks.",
          "longDesc": "no n.devarch, transformamos o desenvolvimento em uma vantagem competitiva. criamos nossas próprias soluções e capacitamos empresas a alcançarem escala extrema.",
          "cta": "escalar meu desenvolvimento"
        },
        "autoops": {
          "title": "n.autoops",
          "fullTitle": "eficiência operacional & automação estratégica",
          "desc": "agentes neuro-digitais e LLMs privados triturando fluxos corporativos manuais.",
          "longDesc": "o n.autoops é o braço de inteligência da ness. que coloca sua empresa à frente da concorrência. desenvolvemos assistentes personalizados (copilotos) que assumem tarefas repetitivas.",
          "cta": "agendar demo da gabi.os"
        },
        "cirt": {
          "title": "n.cirt",
          "fullTitle": "resposta estratégica a incidentes críticos",
          "desc": "resposta estratégica a incidentes críticos e inteligência avançada de ameaças.",
          "longDesc": "o n.cirt é a elite da resposta a incidentes. quando o impensável acontece, nosso time entra em campo para conter, remediar e reconstruir com precisão cirúrgica.",
          "cta": "falar com time de resposta"
        }
      },
      "services": {
        "title": "serviços profissionais",
        "subtitle": "expertise técnica e estratégica para acelerar sua jornada de transformação e segurança."
      },
      "verticals": {
        "title": "unidades verticais de negócio",
        "subtitle": "ecossistemas dedicados que potencializam a inteligência e confiança digital."
      },
      "blog": {
        "title": "conhecimento técnico",
        "subtitle": "exploramos as fronteiras da tecnologia, segurança e inteligência para manter sua operação resiliente e inovadora."
      },
      "portfolio": {
        "title": "cases de sucesso",
        "subtitle": "demonstramos nossa autoridade através de resultados mensuráveis. cada projeto é um compromisso com a excelência técnica e a resiliência do negócio.",
        "cta_title": "quer resultados como estes?",
        "cta_desc": "estamos prontos para aplicar nossa engenharia de precisão no seu próximo grande desafio."
      },
      "careers": {
        "title": "carreiras",
        "subtitle": "construa o futuro conosco",
        "desc": "estamos em busca de mentes brilhantes e engenheiros de precisão para elevar o nível da tecnologia e segurança global.",
        "apply_title": "candidatar-se à vaga",
        "requirements": "requisitos",
        "benefits": "benefícios ness.",
        "form": {
          "full_name": "nome completo",
          "linkedin": "linkedin / portfólio",
          "attach_cv": "anexar cv (pdf)",
          "drag_drop": "clique ou arraste seu currículo aqui",
          "send_button": "enviar candidatura",
          "success": "Candidatura enviada com sucesso!",
          "error": "Erro ao enviar candidatura. Por favor, tente novamente."
        },
        "benefits_list": {
          "health": "plano de saúde premium",
          "bonus": "bônus por performance",
          "education": "auxílio educação",
          "setup": "setup de alta performance"
        }
      },
      "about": {
        "title": "sobre",
        "subtitle": "invisíveis quando tudo funciona. <highlight>presentes</highlight> quando mais importa",
        "desc": "somos uma empresa de tecnologia especializada em segurança e engenharia, que opera e evolui ambientes de TI de ponta a ponta.",
        "mission": "missão",
        "mission_desc": "ser o parceiro de confiança que garante que sua infraestrutura funcione perfeitamente, permitindo que você se concentre no que realmente importa: seu negócio.",
        "vision": "visão",
        "vision_desc": "ser a plataforma modular líder para transformação digital confiável, reconhecida globalmente pela excelência técnica e inovação constante.",
        "values": "valores",
        "history": "nossa história e legado",
        "history_title": "nossa história e legado"
      },
      "contact": {
        "title": "vamos construir o futuro juntos",
        "subtitle": "entre em contato com nosso time de especialistas para transformar sua operação digital.",
        "info": {
          "email": "email",
          "phone": "telefone",
          "office": "escritório"
        },
        "form": {
          "name": "nome",
          "name_placeholder": "seu nome",
          "name_optional": "nome (opcional)",
          "contact_optional": "contato (opcional)",
          "company": "empresa",
          "company_placeholder": "sua empresa",
          "email": "email corporativo",
          "email_placeholder": "email@empresa.com.br",
          "subject": "assunto",
          "subject_select": "selecione um assunto",
          "message": "mensagem",
          "message_placeholder": "como podemos ajudar?",
          "send": "enviar mensagem",
          "success": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
          "error": "Erro ao enviar mensagem. Por favor, tente novamente."
        },
        "whistleblower": {
          "title": "canal de denúncia",
          "desc": "para reportar condutas antiéticas ou violações de compliance de forma totalmente anônima e segura.",
          "cta": "acessar canal ético",
          "occurrence_type": "tipo de ocorrência",
          "category_select": "selecione uma categoria",
          "description": "descrição dos fatos",
          "last_update": "última atualização: 14 de abril de 2024. para dúvidas adicionais, entre em contato com nosso DPO em dpo@ness.com.br",
          "categories": {
            "ethics": "violação ética",
            "harassment": "assédio / discriminação",
            "fraud": "fraude / corrupção",
            "security": "vazamento de dados / segurança",
            "others": "outros"
          },
          "form": {
            "name_placeholder": "seu nome ou deixe em branco",
            "contact_placeholder": "email ou telefone para retorno",
            "message_placeholder": "detalhe o ocorrido com o máximo de informações possíveis (datas, locais, envolvidos)...",
            "send_button": "enviar denúncia segura",
            "error": "Erro ao enviar denúncia. Por favor, tente novamente."
          }
        }
      },
      "cta": {
        "title": "pronto para o próximo nível?",
        "subtitle": "fale com nossos especialistas e descubra como a ness pode elevar o nível de inteligência, segurança e eficiência da sua operação.",
        "button": "agendar consultoria",
        "support": "atendimento especializado imediato."
      },
      "chatbot": {
        "welcome": "olá! eu sou a Gabi.OS, a inteligência da ness. como posso ajudar sua operação hoje?",
        "status": "ia generativa ativa",
        "error": "desculpe, tive um problema na conexão com o backoffice. tente novamente em instantes.",
        "placeholder": "digite sua mensagem...",
        "preview": {
          "msg1_user": "Gabi, preciso de um resumo dos contratos que vencem este mês.",
          "msg1_bot": "Com certeza. Identifiquei 12 contratos com vencimento em abril. Os 3 principais são: Cliente Alpha (dia 15), Tech Solutions (dia 22) e Global Corp (dia 28). Deseja que eu prepare os termos de renovação?",
          "msg2_user": "Sim, por favor. Use o modelo padrão de 2024.",
          "msg2_bot": "Entendido. Processando minutas... Pronto! As 3 minutas foram geradas e enviadas para sua pasta de rascunhos no Teams. Algo mais?"
        }
      },
      "common": {
        "see_all": "ver tudo",
        "view_all": "ver tudo",
        "start_now": "começar agora",
        "contact_expert": "falar com um especialista",
        "loading": "carregando...",
        "result": "resultado",
        "date": "data",
        "tag": "tag",
        "back": "voltar",
        "all": "todos",
        "privacy_consent": "Eu li e aceito a política de privacidade e os termos de uso."
      },
      "footer": {
        "company": "empresa",
        "legal": "legal",
        "terms": "termos de uso",
        "privacy": "privacidade",
        "compliance": "compliance & ética",
        "newsletter": "insights sobre segurança digital.",
        "rights": "todos os direitos reservados.",
        "updates": "updates",
        "status": "system live status: optimal"
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "solutions": "solutions",
        "about": "about",
        "portfolio": "portfolio",
        "blog": "blog",
        "careers": "careers",
        "contact": "contact",
        "services": "services"
      },
      "hero": {
        "tag": "precision digital engineering",
        "title": "invisible when everything works. <highlight>present</highlight> when it matters most",
        "subtitle": "we elevate your company's digital resilience through precise operations and invisible security architectures.",
        "explore": "explore solutions",
        "know_ness": "know ness"
      },
      "presence": {
        "global": "global presence",
        "locations": {
          "brazil": "brazil",
          "portugal": "portugal",
          "chile": "chile",
          "peru": "peru",
          "colombia": "colombia",
          "usa": "united states"
        }
      },
      "solutions": {
        "title": "our solutions",
        "subtitle": "elite technology for companies that don't accept failure.",
        "technical_view_toggle": "engineering & cto view",
        "active_resilience": "active resilience",
        "intelligence_flow": "intelligence flow",
        "secops": {
          "title": "n.secops",
          "fullTitle": "operational resilience & continuity",
          "desc": "silencing alarms and blocking incidents at the source with AI and total abstraction.",
          "longDesc": "n.secops is not just about technology; it's about the survival of your business. we protect your reputation and your operation through an elite security operations center (SOC) that monitors, detects, and neutralizes threats before they cause impact.",
          "cta": "request security diagnosis"
        },
        "infraops": {
          "title": "n.infraops",
          "fullTitle": "intelligent infrastructure & global support",
          "desc": "finops architecture: invisible, elastic cloud with rock-solid, non-negotiable uptime.",
          "longDesc": "n.infraops redefines traditional technical support. we combine the robustness of the ITIL framework with the agility of an applied AI system that acts as a co-pilot for our operations.",
          "cta": "optimize my infrastructure"
        },
        "devarch": {
          "title": "n.devarch",
          "fullTitle": "developer-oriented architecture & secure scale",
          "desc": "the end of technical debt: hexagonal engineering focused on break-free longevity.",
          "longDesc": "at n.devarch, we transform development into a competitive advantage. we create our own solutions and empower companies to achieve extreme scale.",
          "cta": "scale my development"
        },
        "autoops": {
          "title": "n.autoops",
          "fullTitle": "operational efficiency & strategic automation",
          "desc": "neuro-digital agents and private LLMs crushing manual corporate workflows.",
          "longDesc": "n.autoops is the intelligence arm of ness. that puts your company ahead of the competition. we develop personalized assistants (co-pilots) that take over repetitive tasks.",
          "cta": "schedule gabi.os demo"
        },
        "cirt": {
          "title": "n.cirt",
          "fullTitle": "strategic response to critical incidents",
          "desc": "strategic response to critical incidents and advanced threat intelligence.",
          "longDesc": "n.cirt is the elite of incident response. when the unthinkable happens, our team takes the field to contain, remedy, and rebuild with surgical precision.",
          "cta": "talk to response team"
        }
      },
      "services": {
        "title": "professional services",
        "subtitle": "technical and strategic expertise to accelerate your transformation and security journey."
      },
      "verticals": {
        "title": "vertical business units",
        "subtitle": "dedicated ecosystems that enhance digital intelligence and trust."
      },
      "blog": {
        "title": "technical knowledge",
        "subtitle": "we explore the frontiers of technology, security, and intelligence to keep your operation resilient and innovative."
      },
      "portfolio": {
        "title": "success cases",
        "subtitle": "we demonstrate our authority through measurable results. each project is a commitment to technical excellence and business resilience.",
        "cta_title": "want results like these?",
        "cta_desc": "we are ready to apply our precision engineering to your next big challenge."
      },
      "careers": {
        "title": "careers",
        "subtitle": "build the future with us",
        "desc": "we are looking for brilliant minds and precision engineers to elevate the level of global technology and security.",
        "apply_title": "apply for position",
        "requirements": "requirements",
        "benefits": "ness. benefits",
        "form": {
          "full_name": "full name",
          "linkedin": "linkedin / portfolio",
          "attach_cv": "attach cv (pdf)",
          "drag_drop": "click or drag your resume here",
          "send_button": "submit application",
          "success": "Application submitted successfully!",
          "error": "Error submitting application. Please try again."
        },
        "benefits_list": {
          "health": "premium health plan",
          "bonus": "performance bonus",
          "education": "education allowance",
          "setup": "high performance setup"
        }
      },
      "about": {
        "title": "about",
        "subtitle": "invisible when everything works. <highlight>present</highlight> when it matters most",
        "desc": "we are a technology company specialized in security and engineering, operating and evolving end-to-end IT environments.",
        "mission": "mission",
        "mission_desc": "to be the trusted partner that ensures your infrastructure works perfectly, allowing you to focus on what really matters: your business.",
        "vision": "vision",
        "vision_desc": "to be the leading modular platform for reliable digital transformation, globally recognized for technical excellence and constant innovation.",
        "values": "values",
        "history": "our history and legacy",
        "history_title": "our history and legacy"
      },
      "contact": {
        "title": "let's build the future together",
        "subtitle": "contact our team of experts to transform your digital operation.",
        "info": {
          "email": "email",
          "phone": "phone",
          "office": "office"
        },
        "form": {
          "name": "name",
          "name_placeholder": "your name",
          "name_optional": "name (optional)",
          "contact_optional": "contact (optional)",
          "company": "company",
          "company_placeholder": "your company",
          "email": "corporate email",
          "email_placeholder": "email@company.com",
          "subject": "subject",
          "subject_select": "select a subject",
          "message": "message",
          "message_placeholder": "how can we help?",
          "send": "send message",
          "success": "Message sent successfully! We will contact you soon.",
          "error": "Error sending message. Please try again."
        },
        "whistleblower": {
          "title": "whistleblower channel",
          "desc": "to report unethical conduct or compliance violations completely anonymously and securely.",
          "cta": "access ethical channel",
          "occurrence_type": "occurrence type",
          "category_select": "select a category",
          "description": "description of facts",
          "last_update": "last update: April 14, 2024. for additional questions, contact our DPO at dpo@ness.com.br",
          "categories": {
            "ethics": "ethical violation",
            "harassment": "harassment / discrimination",
            "fraud": "fraud / corruption",
            "security": "data leak / security",
            "others": "others"
          },
          "form": {
            "name_placeholder": "your name or leave blank",
            "contact_placeholder": "email or phone for return",
            "message_placeholder": "detail the occurrence with as much information as possible (dates, locations, involved)...",
            "send_button": "send secure report",
            "error": "Error sending report. Please try again."
          }
        }
      },
      "cta": {
        "title": "ready for the next level?",
        "subtitle": "talk to our experts and discover how ness can elevate the level of intelligence, security, and efficiency of your operation.",
        "button": "schedule consultancy",
        "support": "immediate specialized support."
      },
      "chatbot": {
        "welcome": "hello! I am Gabi.OS, ness. intelligence. how can I help your operation today?",
        "status": "active generative ai",
        "error": "sorry, I had a problem connecting to the backoffice. please try again in a few moments.",
        "placeholder": "type your message...",
        "preview": {
          "msg1_user": "Gabi, I need a summary of the contracts expiring this month.",
          "msg1_bot": "Certainly. I identified 12 contracts expiring in April. The top 3 are: Alpha Client (15th), Tech Solutions (22nd), and Global Corp (28th). Would you like me to prepare the renewal terms?",
          "msg2_user": "Yes, please. Use the 2024 standard template.",
          "msg2_bot": "Understood. Processing drafts... Done! The 3 drafts have been generated and sent to your drafts folder in Teams. Anything else?"
        }
      },
      "common": {
        "see_all": "see all",
        "view_all": "view all",
        "start_now": "start now",
        "contact_expert": "talk to an expert",
        "loading": "loading...",
        "result": "result",
        "date": "date",
        "tag": "tag",
        "back": "back",
        "all": "all",
        "privacy_consent": "I have read and accept the privacy policy and terms of use."
      },
      "footer": {
        "company": "company",
        "legal": "legal",
        "terms": "terms of use",
        "privacy": "privacy",
        "compliance": "compliance & ethics",
        "newsletter": "insights on digital security.",
        "rights": "all rights reserved.",
        "updates": "updates",
        "status": "system live status: optimal"
      }
    }
  },
  es: {
    translation: {
      "nav": {
        "solutions": "soluciones",
        "about": "nosotros",
        "portfolio": "portafolio",
        "blog": "blog",
        "careers": "carreras",
        "contact": "contacto",
        "services": "servicios"
      },
      "hero": {
        "tag": "ingeniería digital de precisión",
        "title": "invisibles cuando todo funciona. <highlight>presentes</highlight> cuando más importa",
        "subtitle": "elevamos la resiliencia digital de su empresa a través de operaciones precisas y arquitecturas de seguridad invisibles.",
        "explore": "explorar soluciones",
        "know_ness": "conozca a ness"
      },
      "presence": {
        "global": "presencia global",
        "locations": {
          "brazil": "brasil",
          "portugal": "portugal",
          "chile": "chile",
          "peru": "perú",
          "colombia": "colombia",
          "usa": "estados unidos"
        }
      },
      "solutions": {
        "title": "nuestras soluciones",
        "subtitle": "tecnología de élite para empresas que no aceptan fallos.",
        "technical_view_toggle": "visión para ingeniería y ctos",
        "active_resilience": "resiliencia activa",
        "intelligence_flow": "flujo de inteligencia",
        "secops": {
          "title": "n.secops",
          "fullTitle": "resiliencia operativa & continuidad",
          "desc": "silenciando alarmas y bloqueando incidentes en la fuente con IA y abstracción total.",
          "longDesc": "n.secops no es solo tecnología; es la supervivencia de su negocio. protegemos su reputación y su operación a través de un centro de operaciones de seguridad (SOC) de élite que monitorea, detecta y neutraliza las amenazas antes de que causen impacto.",
          "cta": "solicitar diagnóstico de seguridad"
        },
        "infraops": {
          "title": "n.infraops",
          "fullTitle": "infraestructura inteligente & soporte global",
          "desc": "arquitectura finops: nube invisible, elástica y con un uptime tallado en piedra.",
          "longDesc": "n.infraops redefine el soporte técnico tradicional. combinamos la robustez del marco ITIL con la agilidad de un sistema de IA aplicada que actúa como copiloto de nuestras operaciones.",
          "cta": "optimizar mi infraestructura"
        },
        "devarch": {
          "title": "n.devarch",
          "fullTitle": "arquitectura orientada al desarrollador & escala segura",
          "desc": "el fin de la deuda técnica: ingeniería hexagonal enfocada en la longevidad sin interrupciones.",
          "longDesc": "en n.devarch, transformamos el desarrollo en una ventaja competitiva. creamos nuestras propias soluciones y capacitamos a las empresas para alcanzar una escala extrema.",
          "cta": "escalar mi desarrollo"
        },
        "autoops": {
          "title": "n.autoops",
          "fullTitle": "eficiencia operativa & automatización estratégica",
          "desc": "agentes neuro-digitales y LLMs privados triturando flujos corporativos manuales.",
          "longDesc": "n.autoops es el brazo de inteligencia de ness. que pone a su empresa por delante de la competencia. desarrollamos asistentes personalizados (copilotos) que se encargan de tareas repetitivas.",
          "cta": "programar demo de gabi.os"
        },
        "cirt": {
          "title": "n.cirt",
          "fullTitle": "respuesta estratégica a incidentes críticos",
          "desc": "respuesta estratégica a incidentes críticos e inteligencia avanzada de amenazas.",
          "longDesc": "n.cirt es la élite de la respuesta a incidentes. cuando ocurre lo impensable, nuestro equipo entra en acción para contener, remediar y reconstruir con precisión quirúrgica.",
          "cta": "hablar con el equipo de respuesta"
        }
      },
      "services": {
        "title": "servicios profesionales",
        "subtitle": "experiencia técnica y estratégica para acelerar su viaje de transformación y seguridad."
      },
      "verticals": {
        "title": "unidades de negocio verticales",
        "subtitle": "ecosistemas dedicados que potencian la inteligencia y la confianza digital."
      },
      "blog": {
        "title": "conocimiento técnico",
        "subtitle": "exploramos las fronteras de la tecnología, seguridad e inteligencia para mantener su operación resiliente e innovadora."
      },
      "portfolio": {
        "title": "casos de éxito",
        "subtitle": "demostramos nuestra autoridad a través de resultados mensurables. cada proyecto es un compromiso con la excelencia técnica y la resiliencia del negocio.",
        "cta_title": "¿quieres resultados como estos?",
        "cta_desc": "estamos listos para aplicar nuestra ingeniería de precisión en su próximo gran desafío."
      },
      "careers": {
        "title": "carreras",
        "subtitle": "construye el futuro con nosotros",
        "desc": "buscamos mentes brillantes e ingenieros de precisión para elevar el nivel de la tecnología y seguridad global.",
        "apply_title": "postularse a la vacante",
        "requirements": "requisitos",
        "benefits": "beneficios ness.",
        "form": {
          "full_name": "nombre completo",
          "linkedin": "linkedin / portafolio",
          "attach_cv": "adjuntar cv (pdf)",
          "drag_drop": "haga clic ou arrastre su currículum aquí",
          "send_button": "enviar candidatura",
          "success": "¡Candidatura enviada con éxito!",
          "error": "Error al enviar la candidatura. Por favor, inténtelo de nuevo."
        },
        "benefits_list": {
          "health": "plan de salud premium",
          "bonus": "bono por desempeño",
          "education": "ayuda para educación",
          "setup": "equipo de alto rendimiento"
        }
      },
      "about": {
        "title": "nosotros",
        "subtitle": "invisibles cuando todo funciona. <highlight>presentes</highlight> cuando más importa",
        "desc": "somos una empresa de tecnología especializada en seguridad e ingeniería, que opera y evoluciona entornos de TI de extremo a extremo.",
        "mission": "misión",
        "mission_desc": "ser el socio de confianza que garantiza que su infraestructura funcione perfectamente, permitiéndole concentrarse en lo que realmente importa: su negocio.",
        "vision": "visión",
        "vision_desc": "ser la plataforma modular líder para la transformación digital confiable, reconocida globalmente por la excelencia técnica y la innovación constante.",
        "values": "valores",
        "history": "nuestra historia y legado",
        "history_title": "nuestra historia y legado"
      },
      "contact": {
        "title": "construyamos el futuro juntos",
        "subtitle": "contacte a nuestro equipo de expertos para transformar su operación digital.",
        "form": {
          "name": "nombre",
          "name_placeholder": "su nombre",
          "company": "empresa",
          "company_placeholder": "su empresa",
          "email": "correo corporativo",
          "email_placeholder": "correo@empresa.com",
          "subject": "asunto",
          "subject_select": "seleccione un asunto",
          "message": "mensaje",
          "message_placeholder": "¿cómo podemos ayudar?",
          "send": "enviar mensaje",
          "success": "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.",
          "error": "Error al enviar el mensaje. Por favor, inténtelo de nuevo."
        },
        "whistleblower": {
          "title": "canal de denuncias",
          "desc": "para informar conductas poco éticas o violaciones de cumplimiento de forma totalmente anónima y segura.",
          "cta": "acceder al canal ético",
          "occurrence_type": "tipo de ocurrencia",
          "category_select": "seleccione una categoría",
          "description": "descripción de los hechos",
          "last_update": "última actualización: 14 de abril de 2024. para dudas adicionales, contacte a nuestro DPO en dpo@ness.com.br",
          "categories": {
            "ethics": "violación ética",
            "harassment": "acoso / discriminación",
            "fraud": "fraude / corrupción",
            "security": "fuga de datos / seguridad",
            "others": "otros"
          },
          "form": {
            "name_placeholder": "su nombre o déjelo en blanco",
            "contact_placeholder": "email o teléfono para respuesta",
            "message_placeholder": "detalle lo ocurrido con la mayor cantidad de información posible (fechas, lugares, involucrados)...",
            "send_button": "enviar denuncia segura",
            "error": "Error al enviar la denuncia. Por favor, inténtelo de nuevo."
          }
        }
      },
      "cta": {
        "title": "¿listo para el siguiente nivel?",
        "subtitle": "hable con nuestros expertos y descubra cómo ness puede elevar el nivel de inteligencia, seguridad y eficiencia de su operación.",
        "button": "programar consultoría",
        "support": "soporte especializado inmediato."
      },
      "chatbot": {
        "welcome": "¡hola! soy Gabi.OS, la inteligencia de ness. ¿cómo puedo ayudar a su operation hoy?",
        "status": "ia generativa activa",
        "error": "lo siento, tuve un problema al conectarme con el backoffice. por favor, inténtelo de nuevo en unos momentos.",
        "placeholder": "escriba su mensaje...",
        "preview": {
          "msg1_user": "Gabi, necesito un resumen de los contratos que vencen este mes.",
          "msg1_bot": "Por supuesto. He identificado 12 contratos que vencen en abril. Los 3 principales son: Cliente Alpha (día 15), Tech Solutions (día 22) y Global Corp (día 28). ¿Desea que prepare los términos de renovación?",
          "msg2_user": "Sí, por favor. Use el modelo estándar de 2024.",
          "msg2_bot": "Entendido. Procesando borradores... ¡Listo! Los 3 borradores han sido generados y enviados a su carpeta de borradores en Teams. ¿Algo más?"
        }
      },
      "common": {
        "see_all": "ver todo",
        "view_all": "ver todo",
        "start_now": "empezar ahora",
        "contact_expert": "hablar con un experto",
        "loading": "cargando...",
        "result": "resultado",
        "date": "fecha",
        "tag": "etiqueta",
        "back": "volver",
        "all": "todos",
        "privacy_consent": "He leído e acepto la política de privacidad y los términos de uso."
      },
      "footer": {
        "company": "empresa",
        "legal": "legal",
        "terms": "términos de uso",
        "privacy": "privacidad",
        "compliance": "cumplimiento y ética",
        "newsletter": "información sobre seguridad digital.",
        "rights": "todos los derechos reservados.",
        "updates": "actualizaciones",
        "status": "system live status: optimal"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    // Only persist manual selections — do NOT auto-detect from browser navigator
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ness_lang',
    },
    // Default to PT if no stored preference exists
    lng: localStorage.getItem('ness_lang') || 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
