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
      },
      "forense": {
        "title": "forense.io",
        "tabTitle": "análise forense digital & incident response",
        "hero": {
          "tag": "cadeia de custódia",
          "tag2": "preservada",
          "subtitle": "especialização em forense digital seguindo ISO 27037/27042 — perícia judicial, investigação corporativa e resposta a incidentes.",
          "cta1": "solicitar perícia",
          "cta2": "ver recursos forenses"
        },
        "why": {
          "title": "por que importa",
          "desc": "Evidências digitais são voláteis e podem ser destruídas em minutos. Forense digital é essencial para investigações judiciais, resposta a incidentes e compliance. forense.io realiza perícias com metodologia ISO 27037/27042, preservando cadeia de custódia e produzindo laudos defensáveis em juízo.",
          "items": {
            "ransomware": {
              "title": "ransomware",
              "subtitle": "Determinar ponto de entrada e escopo do comprometimento",
              "desc": "Forense de memória (RAM), discos (clonagem bit-a-bit) e logs para mapear TTPs do atacante e extensão do incidente."
            },
            "datalen": {
              "title": "vazamento de dados",
              "subtitle": "Rastrear como dados sensíveis saíram da empresa",
              "desc": "Análise de acesso a BD, logs de rede, e-mails e dispositivos para identificar vetor de exfiltração e autoria."
            },
            "judicial": {
              "title": "processo judicial",
              "subtitle": "Perícia de dispositivo apreendido (notebook, smartphone)",
              "desc": "Perito judicial credenciado realiza exame técnico com relatório estruturado e defesa oral em audiência."
            },
            "corp": {
              "title": "investigação corporativa",
              "subtitle": "Fraude interna ou violação de propriedade intelectual",
              "desc": "Forense de endpoints (e-mails, WhatsApp, Drive) com respeito a LGPD e cadeia de custódia preservada."
            }
          }
        },
        "resources": {
          "title": "recursos principais",
          "desc": "expertise forense completo seguindo padrões internacionais",
          "items": {
            "disk": { "title": "Análise de Discos", "desc": "Clonagem bit-a-bit, recuperação de arquivos deletados, análise de filesystem (NTFS, ext4, APFS)." },
            "ram": { "title": "Forense de Memória (RAM)", "desc": "Análise de processos, conexões de rede, malware em memória e credenciais voláteis." },
            "mobile": { "title": "Mobile Forensics", "desc": "Extração lógica/física de smartphones (iOS/Android), análise de apps, WhatsApp, Telegram." },
            "network": { "title": "Network Forensics", "desc": "Análise de PCAP, logs de firewall, IDS/IPS, reconstrução de sessões HTTP/HTTPS." },
            "timeline": { "title": "Timeline Analysis", "desc": "Reconstrução cronológica de eventos (file system, registry, logs) para entender sequência do ataque." },
            "custodian": { "title": "Cadeia de Custódia", "desc": "Documentação completa da preservação, coleta, transporte e análise de evidências (ISO 27037)." },
            "report": { "title": "Relatórios Periciais", "desc": "Laudos técnicos estruturados com metodologia ISO 27042, reprodutíveis e defensáveis em juízo." },
            "testimony": { "title": "Testemunho Especializado", "desc": "Defesa oral de laudo em audiências judiciais com linguagem acessível ao jurídico." },
            "counter": { "title": "Contraprova e Reexame", "desc": "Análise crítica de laudos de terceiros e identificação de falhas metodológicas." },
            "preservation": { "title": "Preservação de Evidências", "desc": "Coleta on-site ou remota com ferramentas certificadas e hash criptográfico para integridade." }
          }
        },
        "metrics": {
          "title": "métricas forenses",
          "checks": [
            "Track record de excelência pericial",
            "Cadeia de custódia preservada via ISO 27037",
            "Metodologia ISO 27042 para laudos defensáveis",
            "Atendimento a incidentes críticos em tempo recorde"
          ],
          "stats": {
            "pericias": { "label": "perícias", "value": "450+" },
            "laudos": { "label": "laudos aceitos", "value": "100%" },
            "iso": { "label": "preservação", "value": "ISO" },
            "assitencia": { "label": "resposta", "value": "24/7" }
          }
        },
        "process": {
          "title": "processo pericial",
          "desc": "De contato inicial a laudo final em 2-4 semanas, seguindo rigorosos protocolos de preservação.",
          "steps": {
            "s1": { "step": "01", "title": "Triagem", "desc": "Entendimento do caso, tipo de evidência, urgência e objetivos." },
            "s2": { "step": "02", "title": "Coleta", "desc": "Preservação on-site ou remota com ferramentas certificadas." },
            "s3": { "step": "03", "title": "Análise", "desc": "Exame técnico seguindo metodologia ISO 27042 e NIST." },
            "s4": { "step": "04", "title": "Laudo", "desc": "Relatório técnico estruturado com achados e conclusões." },
            "s5": { "step": "05", "title": "Defesa", "desc": "Apresentação executiva ou testemunho especializado em juízo." }
          }
        },
        "cta": {
          "title": "precisa de perícia ou investigação?",
          "desc": "solicite análise forense especializada para incidentes, processos judiciais ou investigações corporativas.",
          "btn": "falar com perito"
        }
      },
      "trustness": {
        "title": "trustness",
        "tabTitle": "auditoria e conformidade",
        "hero": {
          "tag": "auditoria e conformidade",
          "subtitle": "auditorias independentes, assessments de segurança e consultoria em conformidade (ISO 27001, LGPD, SOC 2) — com relatórios executivos e roadmaps acionáveis.",
          "cta1": "solicitar assessment",
          "cta2": "falar com especialista"
        },
        "why": {
          "title": "por que importa",
          "desc": "Clientes B2B, investidores e reguladores exigem evidências de conformidade. ISO 27001 e SOC 2 viraram pré-requisitos para fechar grandes contratos. trustness. realiza auditorias independentes com metodologia reconhecida, relatórios executivos e roadmaps priorizados — entregando confiança demonstrável.",
          "items": {
            "sgsi": {
              "title": "SGSI estruturado",
              "subtitle": "Startup quer ISO 27001 mas não tem SGSI estruturado",
              "desc": "Implementamos SGSI completo: políticas, procedimentos, avaliação de riscos, controles técnicos e organizacionais — pronto para auditoria."
            },
            "lgpd": {
              "title": "adequação LGPD",
              "subtitle": "Empresa precisa auditoria LGPD independente antes da ANPD",
              "desc": "Gap analysis LGPD, ROPA, DPIAs, políticas e relatório executivo com roadmap de adequação priorizado."
            },
            "exec": {
              "title": "visibilidade executiva",
              "subtitle": "Board quer visibilidade de postura de segurança mas TI só fala técnico",
              "desc": "Assessment executivo com score de maturidade, benchmarks de mercado e roadmap de investimento."
            },
            "gap": {
              "title": "remediação de gaps",
              "subtitle": "Auditoria externa encontrou achados críticos e empresa quer remediação",
              "desc": "Consultoria para implementação de controles, remediação de gaps e preparação para re-auditoria."
            },
            "dpo": {
              "title": "DPOaaS.online",
              "subtitle": "Conformidade demonstrável para LGPD/GDPR/CCPA",
              "desc": "DPO certificado dedicado + plataforma n.privacy incluída para gestão contínua de privacidade."
            }
          }
        },
        "resources": {
          "title": "recursos principais",
          "desc": "suite completo de auditoria e consultoria em conformidade",
          "items": {
            "ass": { "title": "Assessments de Segurança", "desc": "Avaliação de maturidade em cibersegurança com frameworks reconhecidos (NIST CSF, CIS, ISO 27001)." },
            "audit": { "title": "Auditorias de Conformidade", "desc": "Auditorias independentes ISO 27001, ISO 27701, SOC 2, PCI-DSS, LGPD com relatórios executivos." },
            "iso": { "title": "Implementação ISO 27001", "desc": "Projeto estruturado para certificação ISO 27001: SGSI, políticas, controles e preparação para auditoria." },
            "pen": { "title": "Penetration Testing", "desc": "Pentest externo/interno, web apps, APIs, infraestrutura e social engineering com relatórios técnicos." },
            "vuln": { "title": "Vulnerability Assessment", "desc": "Varredura e análise de vulnerabilidades com priorização por criticidade e impacto no negócio." },
            "gov": { "title": "Governança de Segurança", "desc": "Estruturação de comitês de segurança, políticas, procedimentos e frameworks de governança." },
            "due": { "title": "Due Diligence de Fornecedores", "desc": "Avaliação de segurança e privacidade de vendors críticos com questionários e evidências." },
            "train": { "title": "Treinamentos e Awareness", "desc": "Programas de conscientização em segurança e privacidade customizados para diferentes públicos." },
            "reg": { "title": "Assessoria Regulatória", "desc": "Consultoria para conformidade com regulamentações setoriais (BACEN, SUSEP, ANS, ANATEL)." }
          }
        },
        "metrics": {
          "title": "métricas de excelência",
          "checks": [
            "Track record de auditorias e certificações",
            "Metodologia reconhecida internacionalmente",
            "Relatórios executivos e roadmaps priorizados",
            "Foco em confiança demonstrável para stakeholders"
          ],
          "stats": {
            "fw": { "label": "frameworks", "value": "15+" },
            "cert": { "label": "certificações", "value": "100%" },
            "comp": { "label": "compliance score", "value": "A+" },
            "stake": { "label": "stakeholders", "value": "800+" }
          }
        },
        "process": {
          "title": "processo de auditoria",
          "desc": "De kickoff a relatório final em 4–8 semanas, garantindo conformidade e confiança.",
          "steps": {
            "s1": { "step": "01", "title": "Kickoff e Escopo", "desc": "Alinhamento de objetivos, escopo e timeline do projeto." },
            "s2": { "step": "02", "title": "Coleta de Evidências", "desc": "Questionários, entrevistas e análise documental rigorosa." },
            "s3": { "step": "03", "title": "Análise e Gap Analysis", "desc": "Comparação com frameworks e identificação de riscos." },
            "s4": { "step": "04", "title": "Relatório e Apresentação", "desc": "Score de maturidade e roadmap de recomendações." },
            "s5": { "step": "05", "title": "Plano de Remediação", "desc": "Acompanhamento até a certificação ou adequação total." }
          }
        },
        "cta": {
          "title": "precisa de auditoria ou certificação?",
          "desc": "solicite assessment de segurança, auditoria de conformidade ou consultoria especializada para certificação ISO ou SOC 2.",
          "btn1": "solicitar assessment",
          "btn2": "falar com consultor"
        }
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
      },
      "forense": {
        "title": "forense.io",
        "tabTitle": "digital forensics & incident response",
        "hero": {
          "tag": "chain of custody",
          "tag2": "preserved",
          "subtitle": "specialization in digital forensics following ISO 27037/27042 — judicial expertise, corporate investigation, and incident response.",
          "cta1": "request forensics",
          "cta2": "view forensic resources"
        },
        "why": {
          "title": "why it matters",
          "desc": "Digital evidence is volatile and can be destroyed in minutes. Digital forensics is essential for judicial investigations, incident response, and compliance. forense.io conducts expertise with ISO 27037/27042 methodology, preserving the chain of custody and producing defensible reports in court.",
          "items": {
            "ransomware": {
              "title": "ransomware",
              "subtitle": "Determine entry point and scope of compromise",
              "desc": "Memory forensics (RAM), disks (bit-by-bit cloning), and logs to map attacker TTPs and incident extent."
            },
            "datalen": {
              "title": "data leak",
              "subtitle": "Track how sensitive data left the company",
              "desc": "Analysis of DB access, network logs, emails, and devices to identify exfiltration vector and authorship."
            },
            "judicial": {
              "title": "judicial process",
              "subtitle": "Expertise of seized device (notebook, smartphone)",
              "desc": "Accredited judicial expert performs technical examination with structured report and oral defense in hearing."
            },
            "corp": {
              "title": "corporate investigation",
              "subtitle": "Internal fraud or intellectual property violation",
              "desc": "Endpoint forensics (emails, WhatsApp, Drive) with respect to LGPD/GDPR and preserved chain of custody."
            }
          }
        },
        "resources": {
          "title": "core resources",
          "desc": "complete forensic expertise following international standards",
          "items": {
            "disk": { "title": "Disk Analysis", "desc": "Bit-by-bit cloning, deleted file recovery, filesystem analysis (NTFS, ext4, APFS)." },
            "ram": { "title": "Memory Forensics (RAM)", "desc": "Analysis of processes, network connections, malware in memory, and volatile credentials." },
            "mobile": { "title": "Mobile Forensics", "desc": "Logical/physical extraction of smartphones (iOS/Android), app analysis, WhatsApp, Telegram." },
            "network": { "title": "Network Forensics", "desc": "PCAP analysis, firewall logs, IDS/IPS, HTTP/HTTPS session reconstruction." },
            "timeline": { "title": "Timeline Analysis", "desc": "Chronological reconstruction of events (file system, registry, logs) to understand the attack sequence." },
            "custodian": { "title": "Chain of Custody", "desc": "Complete documentation of evidence preservation, collection, transport, and analysis (ISO 27037)." },
            "report": { "title": "Expert Reports", "desc": "Structured technical reports with ISO 27042 methodology, reproducible and defensible in court." },
            "testimony": { "title": "Expert Testimony", "desc": "Oral defense of report in judicial hearings with language accessible to legal professionals." },
            "counter": { "title": "Counterproof and Re-examination", "desc": "Critical analysis of third-party reports and identification of methodological flaws." },
            "preservation": { "title": "Evidence Preservation", "desc": "On-site or remote collection with certified tools and cryptographic hash for integrity." }
          }
        },
        "metrics": {
          "title": "forensic metrics",
          "checks": [
            "Track record of forensic excellence",
            "Chain of custody preserved via ISO 27037",
            "ISO 27042 methodology for defensible reports",
            "Critical incident response in record time"
          ],
          "stats": {
            "pericias": { "label": "expertises", "value": "450+" },
            "laudos": { "label": "reports accepted", "value": "100%" },
            "iso": { "label": "preservation", "value": "ISO" },
            "assitencia": { "label": "response", "value": "24/7" }
          }
        },
        "process": {
          "title": "forensic process",
          "desc": "From initial contact to final report in 2-4 weeks, following rigorous preservation protocols.",
          "steps": {
             "s1": { "step": "01", "title": "Triage", "desc": "Understanding the case, type of evidence, urgency, and objectives." },
             "s2": { "step": "02", "title": "Collection", "desc": "On-site or remote preservation with certified tools." },
             "s3": { "step": "03", "title": "Analysis", "desc": "Technical examination following ISO 27042 and NIST methodology." },
             "s4": { "step": "04", "title": "Report", "desc": "Structured technical report with findings and conclusions." },
             "s5": { "step": "05", "title": "Defense", "desc": "Executive presentation or expert testimony in court." }
          }
        },
        "cta": {
          "title": "need forensics or investigation?",
          "desc": "request specialized forensic analysis for incidents, judicial processes, or corporate investigations.",
          "btn": "talk to an expert"
        }
      },
      "trustness": {
        "title": "trustness",
        "tabTitle": "audit and compliance",
        "hero": {
          "tag": "audit and compliance",
          "subtitle": "independent audits, security assessments, and compliance consulting (ISO 27001, GDPR, SOC 2) — with executive reports and actionable roadmaps.",
          "cta1": "request assessment",
          "cta2": "talk to a specialist"
        },
        "why": {
          "title": "why it matters",
          "desc": "B2B customers, investors, and regulators demand evidence of compliance. ISO 27001 and SOC 2 have become prerequisites for closing large contracts. trustness. performs independent audits with recognized methodology, executive reports, and prioritized roadmaps — delivering demonstrable trust.",
          "items": {
            "sgsi": {
              "title": "structured ISMS",
              "subtitle": "Startup wants ISO 27001 but lacks structured ISMS",
              "desc": "We implement a complete ISMS: policies, procedures, risk assessment, technical and organizational controls — ready for audit."
            },
            "lgpd": {
              "title": "GDPR adequacy",
              "subtitle": "Company needs independent GDPR audit before regulators",
              "desc": "GDPR gap analysis, ROPA, DPIAs, policies, and executive report with prioritized adequacy roadmap."
            },
            "exec": {
              "title": "executive visibility",
              "subtitle": "Board wants visibility of security posture but IT is too technical",
              "desc": "Executive assessment with maturity score, market benchmarks, and investment roadmap."
            },
            "gap": {
              "title": "gap remediation",
              "subtitle": "External audit found critical findings and company needs remediation",
              "desc": "Consulting for control implementation, gap remediation, and preparation for re-audit."
            },
            "dpo": {
              "title": "DPOaaS.online",
              "subtitle": "Demonstrable compliance for LGPD/GDPR/CCPA",
              "desc": "Dedicated certified DPO + included n.privacy platform for continuous privacy management."
            }
          }
        },
        "resources": {
          "title": "core resources",
          "desc": "complete suite of audit and compliance consulting",
          "items": {
            "ass": { "title": "Security Assessments", "desc": "Cybersecurity maturity assessment with recognized frameworks (NIST CSF, CIS, ISO 27001)." },
            "audit": { "title": "Compliance Audits", "desc": "Independent audits ISO 27001, ISO 27701, SOC 2, PCI-DSS, GDPR with executive reports." },
            "iso": { "title": "ISO 27001 Implementation", "desc": "Structured project for ISO 27001 certification: ISMS, policies, controls, and audit preparation." },
            "pen": { "title": "Penetration Testing", "desc": "External/internal pentest, web apps, APIs, infrastructure, and social engineering with technical reports." },
            "vuln": { "title": "Vulnerability Assessment", "desc": "Scanning and analysis of vulnerabilities prioritized by criticality and business impact." },
            "gov": { "title": "Security Governance", "desc": "Structuring of security committees, policies, procedures, and governance frameworks." },
            "due": { "title": "Vendor Due Diligence", "desc": "Security and privacy assessment of critical vendors via questionnaires and evidence." },
            "train": { "title": "Training & Awareness", "desc": "Security and privacy awareness programs customized for different audiences." },
            "reg": { "title": "Regulatory Advisory", "desc": "Consulting for compliance with sector-specific financial and telecom regulations." }
          }
        },
        "metrics": {
          "title": "metrics of excellence",
          "checks": [
            "Track record of audits and certifications",
            "Internationally recognized methodology",
            "Executive reports and prioritized roadmaps",
            "Focus on demonstrable trust for stakeholders"
          ],
          "stats": {
            "fw": { "label": "frameworks", "value": "15+" },
            "cert": { "label": "certifications", "value": "100%" },
            "comp": { "label": "compliance score", "value": "A+" },
            "stake": { "label": "stakeholders", "value": "800+" }
          }
        },
        "process": {
          "title": "audit process",
          "desc": "From kickoff to final report in 4–8 weeks, ensuring compliance and trust.",
          "steps": {
             "s1": { "step": "01", "title": "Kickoff and Scope", "desc": "Alignment of project objectives, scope, and timeline." },
             "s2": { "step": "02", "title": "Evidence Collection", "desc": "Questionnaires, interviews, and rigorous document analysis." },
             "s3": { "step": "03", "title": "Analysis and Gap Analysis", "desc": "Comparison with frameworks and risk identification." },
             "s4": { "step": "04", "title": "Report and Presentation", "desc": "Maturity score and roadmap of recommendations." },
             "s5": { "step": "05", "title": "Remediation Plan", "desc": "Follow-up until certification or full compliance." }
          }
        },
        "cta": {
          "title": "need an audit or certification?",
          "desc": "request a security assessment, compliance audit, or specialized consulting for ISO or SOC 2 certification.",
          "btn1": "request assessment",
          "btn2": "talk to a consultant"
        }
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
      },
      "forense": {
        "title": "forense.io",
        "tabTitle": "análisis forense digital & respuesta a incidentes",
        "hero": {
          "tag": "cadena de custodia",
          "tag2": "preservada",
          "subtitle": "especialización en auditoría forense digital bajo la norma ISO 27037/27042 — peritaje judicial, investigación corporativa y respuesta a incidentes.",
          "cta1": "solicitar peritaje",
          "cta2": "ver recursos forenses"
        },
        "why": {
          "title": "por qué importa",
          "desc": "La evidencia digital es volátil y puede destruirse en minutos. El análisis forense es vital para el cumplimiento, juicios o investigaciones corporativas. forense.io sigue marcos internacionales meticulosamente para preservar la evidencia legal.",
          "items": {
            "ransomware": {
              "title": "ransomware",
              "subtitle": "Determinar punto de entrada y alcance de brecha",
              "desc": "Análisis forense de RAM y clonación de disco (bit a bit) para mapear el alcance."
            },
            "datalen": {
              "title": "fuga de datos",
              "subtitle": "Rastrear extracción de datos",
              "desc": "Análisis de accesos a BD, red y e-mails para identificar la fuente de exfiltración material."
            },
            "judicial": {
              "title": "proceso judicial",
              "subtitle": "Peritaje de dispositivos confiscados (laptops, smartphones)",
              "desc": "Apoyo a investigadores generando dictámenes técnicos verificados para cortes legales."
            },
            "corp": {
              "title": "investigación corporativa",
              "subtitle": "Fraude interno",
              "desc": "Trazabilidad completa con privacidad a través de revisiones e-mail/endpoints."
            }
          }
        },
        "resources": {
          "title": "recursos principales",
          "desc": "peritaje forense completo bajo estándares internacionales",
          "items": {
             "disk": { "title": "Análisis de Discos", "desc": "Clonación bit a bit, recuperación de archivos, sistemas (NTFS, ext4, APFS)." },
             "ram": { "title": "Forense de Memoria (RAM)", "desc": "Análisis de procesos, red, malware residente en memoria y credenciales." },
             "mobile": { "title": "Mobile Forensics", "desc": "Extracción lógica/física de iOS/Android, análisis SMS, WhatsApp, Telegram." },
             "network": { "title": "Network Forensics", "desc": "Análisis PCAP, logs de cortafuegos, IDS, reconstrucción web HTTP." },
             "timeline": { "title": "Timeline Analysis", "desc": "Reconstrucción cronológica de sistemas de archivo y registros de la máquina." },
             "custodian": { "title": "Cadena de Custodia", "desc": "Documentación validada de la custodia legal desde recolección (ISO 27037)." },
             "report": { "title": "Dictámenes Periciales", "desc": "Laudos estructurados aptos para la defensa legal." },
             "testimony": { "title": "Testimonio Especializado", "desc": "Apoyo y exposición oral validada por expertos del sector." },
             "counter": { "title": "Contraprueba", "desc": "Reevaluación meticulosa para hallar falencias en análisis ajenos." },
             "preservation": { "title": "Preservación Legal", "desc": "Criptografía y aseguramiento pericial en toma de datos física/remota." }
          }
        },
        "metrics": {
          "title": "métricas forenses",
          "checks": [
            "Casos verificados mundialmente",
            "Preservación certificada ISO",
            "Meticuloso reporte defensible judicialmente",
            "Tiempos de acción de élite"
          ],
          "stats": {
             "pericias": { "label": "peritajes", "value": "450+" },
             "laudos": { "label": "aceptos judicialmente", "value": "100%" },
             "iso": { "label": "preservación", "value": "ISO" },
             "assitencia": { "label": "asistencia", "value": "24/7" }
          }
        },
        "process": {
          "title": "proceso pericial",
          "desc": "Atención técnica especializada completada y reporte en 2 a 4 semanas.",
          "steps": {
             "s1": { "step": "01", "title": "Triaje", "desc": "Visión y recolección analítica." },
             "s2": { "step": "02", "title": "Recolecta", "desc": "Asegurar integridad de datos forense." },
             "s3": { "step": "03", "title": "Análisis", "desc": "Rastrear bajo normativas NIST, ISO." },
             "s4": { "step": "04", "title": "Laudo", "desc": "Firma del informe de pruebas digitales." },
             "s5": { "step": "05", "title": "Defensa", "desc": "Soporte de evidencias final en mesa corporativa/legal." }
          }
        },
        "cta": {
          "title": "¿necesita investigación pericial?",
          "desc": "solicite análisis forense especializado o apoyo en incidentes corporativos y penales.",
          "btn": "hablar con perito"
        }
      },
      "trustness": {
        "title": "trustness",
        "tabTitle": "auditoría y cumplimiento",
        "hero": {
          "tag": "auditoría y cumplimiento",
          "subtitle": "auditorías independientes, assessments de seguridad y consultoría en conformidad (ISO 27001, GDPR, SOC 2) — informes ejecutivos.",
          "cta1": "solicitar assessment",
          "cta2": "hablar con especialista"
        },
        "why": {
          "title": "por qué importa",
          "desc": "¿Busca confianza demostrable? ISO y acreditaciones reguladoras son exigidas para cierres empresariales B2B y gubernamentales. trustness. audita independientemente el estado de su plataforma frente a marcos top globales.",
          "items": {
             "sgsi": {
              "title": "marco ISO 27001",
              "subtitle": "SGSI estructurado en despliegue",
              "desc": "Diseñamos un mapa SGSI global de controles y roles para auditorías de éxito."
            },
             "lgpd": {
              "title": "adequación LGPD/GDPR",
              "subtitle": "Cumplimiento normativo transfronterizo",
              "desc": "Brechas resueltas con diseño de privacidad: PIA, ROPA y flujos protegidos."
            },
             "exec": {
              "title": "gobernanza ejecutiva",
              "subtitle": "Roadmap de seguridad corporativa para C-Levels",
              "desc": "Informes estratégicos sin tecnicismos en la comprensión de los presupuestos y la rentabilidad (ROI)."
            },
             "gap": {
              "title": "evaluación y remediación",
              "subtitle": "Soporte tras hallazgos externos",
              "desc": "Consultoría continua para revertir no-conformidades y sellarlas a futuro."
            },
             "dpo": {
              "title": "DPOaaS",
              "subtitle": "Gestión continua unificada de privacidad",
              "desc": "Soporte Data Protection Officer bajo demanda avalado corporativamente."
            }
          }
        },
        "resources": {
          "title": "recursos principales",
          "desc": "plataforma auditora para su madurez estructural y tecnológica",
          "items": {
             "ass": { "title": "Asesorías", "desc": "Maturity assessments y brechas comparadas base ISO/NIST." },
             "audit": { "title": "Auditorías de Conformidad", "desc": "Auditoría formal como contraparte independiente." },
             "iso": { "title": "ISO 27001 Readiness", "desc": "Preparación proactiva y estructuración SGSI de primer nivel." },
             "pen": { "title": "Pentesting Validado", "desc": "Evaluación web, red perimetral, ingeniería y caja negra (Blackbox)." },
             "vuln": { "title": "Gestión de Vulnerabilidades", "desc": "Detección recurrente con CVSS enfocado en impacto comercial crítico." },
             "gov": { "title": "Risk & Governance", "desc": "Creación de comités operacionales de Ciberseguridad." },
             "due": { "title": "Due Diligence Externa", "desc": "Evaluación de cadena de suministros y sus normativas." },
             "train": { "title": "Entrenamiento Interno", "desc": "Educación corporativa anti-phishing con test en vivo." },
             "reg": { "title": "Asistencia Reguladora Regional", "desc": "Atender normativos locales BACEN, finanzas, entre otros." }
          }
        },
        "metrics": {
          "title": "métricas de excelencia",
          "checks": [
            "Track record internacional validado",
            "Roadmaps priorizados según criticidad de negocio",
            "Mapeo con reportes visuales al directorio",
            "Garantía de confianza entre proveedores globales"
          ],
          "stats": {
             "fw": { "label": "frameworks", "value": "15+" },
             "cert": { "label": "certificaciones", "value": "100%" },
             "comp": { "label": "compliance score", "value": "A+" },
             "stake": { "label": "stakeholders", "value": "800+" }
          }
        },
        "process": {
          "title": "proceso de auditoría",
          "desc": "Mapeo a validación en tan solo 4-8 semanas.",
          "steps": {
             "s1": { "step": "01", "title": "Visión Inicial", "desc": "Cronograma y metas integrales." },
             "s2": { "step": "02", "title": "Evidencias", "desc": "Investigación, documentaciones e IA validada." },
             "s3": { "step": "03", "title": "Brechas de Seguridad", "desc": "Detección de irregularidades de control." },
             "s4": { "step": "04", "title": "Recomendaciones Técnicas", "desc": "Cierre detallado propuesto operativamente." },
             "s5": { "step": "05", "title": "Certificación Asistida", "desc": "Acompañamiento a logro incesante." }
          }
        },
        "cta": {
          "title": "¿necesita una re-auditoría o certificación?",
          "desc": "hable con nuestros CISO y auditores especializados en certificaciones tecnológicas de élite.",
          "btn1": "solicitar assessment",
          "btn2": "hablar con consultor"
        }
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
