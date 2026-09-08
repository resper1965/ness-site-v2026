import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ptResources = {
  "pt": {
    "translation": {
      "nav": {
        "solutions": "soluções",
        "about": "sobre",
        "portfolio": "portfólio",
        "blog": "blog",
        "careers": "carreiras",
        "contact": "contato",
        "services": "serviços",
        "cta": "começar agora",
        "celebration": {
          "label": "{{years}} Anos",
          "title": "Celebrando {{years}} Anos",
          "message": "Há {{years}} anos construindo o futuro da tecnologia e segurança digital com precisão."
        },
        "home": "início"
      },
      "hero": {
        "tag": "tecnologia digital de precisão",
        "title": "invisíveis quando tudo funciona. <highlight>presentes</highlight> quando mais importa",
        "subtitle": "elevamos a resiliência digital da sua empresa através de operações precisas e arquiteturas de segurança invisíveis.",
        "explore": "explorar soluções",
        "know_ness": "conheça a ness",
        "since": "desde {{year}}",
        "subtitle_clear": "operações de segurança 24×7, infraestrutura, engenharia de software, LGPD e perícia digital para empresas que não podem parar. {{years}} anos entregando com precisão.",
        "cta_primary": "falar com um especialista",
        "pillars": {
          "label": "frentes de atuação",
          "secops": "segurança 24×7",
          "infra": "infraestrutura & cloud",
          "software": "engenharia de software",
          "privacy": "LGPD & compliance",
          "forensics": "perícia digital"
        }
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
        "intelligence_flow": "o fluxo de inteligência",
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
        },
        "strategic_solutions": "soluções estratégicas",
        "use_cases": "casos de uso reais",
        "business_value": "valor para o negócio",
        "technical_arsenal": "o arsenal em operação",
        "onboarding_journey": "jornada de ativação",
        "cta_title": "sua empresa em um novo nível",
        "cta_desc": "descubra como a ness pode transformar sua operação com inteligência e segurança de elite.",
        "tech_engine": "o motor da resiliência",
        "tech_desc": "para os interessados na engenharia por trás da proteção, aqui estão os pilares técnicos que sustentam nossa entrega de valor.",
        "impact_portfolio": "portfólio de impacto"
      },
      "services": {
        "title": "serviços profissionais",
        "subtitle": "expertise técnica e estratégica para acelerar sua jornada de transformação e segurança.",
        "items": [
          {
            "title": "Consultoria em IA & Dados",
            "desc": "Estratégia para implementação de copilotos e orquestração de conhecimento corporativo.",
            "tags": [
              "RAG",
              "LLM Ops",
              "Data Strategy"
            ]
          },
          {
            "title": "Resposta a Incidentes (IR)",
            "desc": "Atuação tática em crises cibernéticas, contenção de danos e recuperação de ambientes.",
            "tags": [
              "War Room",
              "Forensics",
              "Crisis Mgmt"
            ]
          },
          {
            "title": "Engenharia de Plataforma",
            "desc": "Design de arquiteturas escaláveis e pipelines de entrega contínua de alta performance.",
            "tags": [
              "Cloud Native",
              "DevOps",
              "Scalability"
            ]
          },
          {
            "title": "Governança & Compliance",
            "desc": "Automação de GRC e adequação dinâmica a normas globais e regulamentações.",
            "tags": [
              "ISO 27001",
              "LGPD",
              "Risk Audit"
            ]
          }
        ]
      },
      "verticals": {
        "title": "unidades verticais de negócio",
        "subtitle": "ecossistemas dedicados que potencializam a inteligência e confiança digital.",
        "forense": {
          "desc": "líder em investigação digital e resposta a incidentes complexos. unimos tecnologia proprietária e expertise humana para desvendar o invisível."
        },
        "trustness": {
          "desc": "consultoria estratégica em governança, riscos e conformidade. criando alicerces sólidos para que sua empresa cresça com segurança e ética."
        },
        "cta": "explorar unidade"
      },
      "blog": {
        "title": "conhecimento técnico",
        "subtitle": "exploramos as fronteiras da tecnologia, segurança e inteligência para manter sua operação resiliente e inovadora.",
        "badge": "blog — ness. insights",
        "empty_title": "nenhum insight encontrado.",
        "empty_subtitle": "novos conteúdos em breve. fique de olho.",
        "read_article": "ler artigo completo",
        "back": "blog",
        "all_insights": "todos os insights",
        "talk_expert": "falar com especialista"
      },
      "portfolio": {
        "title": "cases de sucesso",
        "subtitle": "demonstramos nossa autoridade através de resultados mensuráveis. cada projeto é um compromisso com a excelência técnica e a resiliência do negócio.",
        "cta_title": "quer resultados como estes?",
        "cta_desc": "estamos prontos para aplicar nossa tecnologia de precisão no seu próximo grande desafio.",
        "badge": "portfólio de impacto — ness. precision",
        "empty": {
          "title": "nenhum case encontrado.",
          "subtitle": "nosso time está preparando novos cases. volte em breve."
        },
        "confidentiality": "100% de confidencialidade",
        "case": {
          "back": "portfolio",
          "all": "todos os cases",
          "talk": "falar com especialista"
        }
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
        "history_title": "nossa história e legado",
        "timeline": {
          "1991": "ness. é fundada como terceirização da área de tecnologia de um grande grupo econômico.",
          "1992": "Início das atividades de infraestrutura crítica, processamento de dados e BPO em larga escala.",
          "2004": "Expansão global: infraestrutura em grandes eventos por diversos países da Europa, Américas, África e Ásia.",
          "2012": "Pioneirismo no início de serviços especializados de privacidade e segurança digital avançada.",
          "2015": "Lançamento da divisão de software e processos, focada em engenharia digital de alta performance.",
          "2016": "Incubação da NESS Technology Healthcare (que viria a se tornar a IONIC Health).",
          "2017": "Incubação da Trustness como unidade de negócios estratégica para GRC.",
          "2022": "Incubação da forense.io como unidade de negócios líder em investigação digital.",
          "2024": "Estabelecida como uma plataforma modular para transformação digital confiável e segura.",
          "2026": "Início da operação de IA e Agentes, consolidando a ness. como líder em orquestração de conhecimento inteligente."
        },
        "values_desc": "Excelência técnica inegociável, inovação constante e aplicada, parceria verdadeira e transparente, resultados reais e mensuráveis.",
        "cred": {
          "global": "Presença global",
          "security": "Seg. & Privacidade",
          "ai": "IA & Agentes"
        },
        "years_label": "anos de excelência",
        "metrics": {
          "legacy": "anos de operação",
          "countries": "países atendidos",
          "projects": "projetos globais",
          "uptime": "sla / uptime"
        },
        "history_sub": "anos construindo a base tecnológica de grandes corporações e eventos globais."
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
          "name_placeholder": "seu nome ou deixe em branco",
          "name_optional": "nome (opcional)",
          "contact_optional": "contato (opcional)",
          "company": "empresa",
          "company_placeholder": "sua empresa",
          "email": "email corporativo",
          "email_placeholder": "email ou telefone para retorno",
          "subject": "assunto",
          "subject_select": "selecione um assunto",
          "message": "mensagem",
          "message_placeholder": "como podemos ajudar?",
          "send": "enviar mensagem",
          "success": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
          "error": "Erro ao enviar mensagem. Por favor, tente novamente.",
          "email_placeholder_v2": "nome@empresa.com.br",
          "sla": "respondemos em até 1 dia útil. incidente em andamento? ligue +55 (11) 2504-7650."
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
          },
          "desc_placeholder": "detalhe o ocorrido com o máximo de informações possíveis (datas, locais, envolvidos)..."
        },
        "badge": "get in touch — ness. precision",
        "meta_title": "contato — fale com um especialista",
        "meta_description": "Fale com a ness.: diagnóstico de segurança, infraestrutura, engenharia de software, LGPD e perícia digital. Resposta em até 1 dia útil. +55 (11) 2504-7650."
      },
      "cta": {
        "title": "pronto para o próximo nível?",
        "subtitle": "fale com nossos especialistas e descubra como a ness pode elevar o nível de inteligência, segurança e eficiência da sua operação.",
        "button": "agendar consultoria",
        "support": "atendimento especializado imediato."
      },
      "chatbot": {
        "welcome": "olá! eu sou a Gabi, a inteligência da ness. como posso ajudar sua operação hoje?",
        "status": "ia da ness.",
        "error": "desculpe, tive um problema na conexão com o backoffice. tente novamente em instantes.",
        "placeholder": "digite sua mensagem...",
        "quick_specialist": "Falar com Especialista",
        "quick_incident": "Incidente (n.cirt)",
        "quick_dpo": "Ouvidoria DPO",
        "preview": {
          "msg1_user": "Gabi, preciso de um resumo dos contratos que vencem este mês.",
          "msg1_bot": "Com certeza. Identifiquei 12 contratos com vencimento em abril. Os 3 principais são: Cliente Alpha (dia 15), Tech Solutions (dia 22) e Global Corp (dia 28). Deseja que eu prepare os termos de renovação?",
          "msg2_user": "Sim, por favor. Use o modelo padrão de 2024.",
          "msg2_bot": "Entendido. Processando minutas... Pronto! As 3 minutas foram geradas e enviadas para sua pasta de rascunhos no Teams. Algo mais?"
        },
        "open": "abrir chat com a Gabi"
      },
      "common": {
        "see_all": "ver tudo",
        "view_all": "ver tudo",
        "start_now": "começar agora",
        "learn_more": "saiba mais",
        "contact_expert": "falar com um especialista",
        "loading": "carregando...",
        "result": "resultado",
        "date": "data",
        "tag": "tag",
        "back": "voltar",
        "all": "todos",
        "privacy_consent": "Eu li e aceito a política de privacidade e os termos de uso."
      },
      "compliance": {
        "eyebrow": "compliance — ness. precision",
        "terms": {
          "title": "termos de uso",
          "desc": "regras e diretrizes para utilização de nossas plataformas e serviços.",
          "sec1": {
            "h": "1. aceitação",
            "p": "ao acessar nossas soluções, você concorda em cumprir estes termos e todas as leis e regulamentos aplicáveis."
          },
          "sec2": {
            "h": "2. propriedade intelectual",
            "p": "todo o conteúdo, software e metodologias da ness. são protegidos por direitos de propriedade intelectual e não podem ser reproduzidos sem autorização prevía."
          },
          "sec3": {
            "h": "3. responsabilidade",
            "p": "a ness. se compromete com a máxima disponibilidade e segurança, mas não se responsabiliza por danos decorrentes do uso indevido das credenciais por parte do usuário."
          }
        },
        "privacy": {
          "title": "política de privacidade",
          "desc": "como tratamos seus dados com segurança e transparência.",
          "sec1": {
            "h": "1. coleta de dados",
            "p": "coletamos apenas as informações necessárias para fornecer nossos serviços de engenharia e segurança, como dados de contato corporativo e logs técnicos de segurança."
          },
          "sec2": {
            "h": "2. finalidade",
            "p": "seus dados são utilizados exclusivamente para a execução de contratos, suporte técnico, melhoria de nossas soluções e conformidade legal (LGPD)."
          },
          "sec3": {
            "h": "3. segurança",
            "p": "implementamos medidas técnicas e organizacionais de ponta, incluindo criptografia e controle de acesso rigoroso, para proteger suas informações contra acessos não autorizados."
          },
          "sec4": {
            "h": "4. seus direitos",
            "p": "você tem o direito de acessar, corrigir, excluir ou solicitar a portabilidade de seus dados a qualquer momento através do nosso canal de privacidade."
          }
        },
        "ethics": {
          "title": "compliance & ética",
          "desc": "nosso compromisso com a integridade e conduta ética global.",
          "sec1": {
            "h": "1. código de conduta",
            "p": "operamos sob os mais altos padrões de ética profissional, combatendo qualquer forma de corrupção, discriminação ou conduta antiética."
          },
          "sec2": {
            "h": "2. canal de denúncias",
            "p": "mantemos um canal independente e anônimo para relato de violacões ao nosso código de conduta ou legislações vigentes."
          },
          "sec3": {
            "h": "3. certificações",
            "p": "nossas operações são auditadas e seguem frameworks internacionais como ISO 27001 e SOC2, garantindo governança de classe mundial."
          }
        }
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
        "status": "system live status: optimal",
        "ecosystem": "ecossistema",
        "email_placeholder": "seu e-mail",
        "locations": [
          "brasil",
          "portugal",
          "chile",
          "peru",
          "colômbia",
          "estados unidos"
        ]
      },
      "a11y": {
        "close": "fechar",
        "subscribe": "inscrever",
        "send": "enviar",
        "language": "idioma"
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
            "disk": {
              "title": "Análise de Discos",
              "desc": "Clonagem bit-a-bit, recuperação de arquivos deletados, análise de filesystem (NTFS, ext4, APFS)."
            },
            "ram": {
              "title": "Forense de Memória (RAM)",
              "desc": "Análise de processos, conexões de rede, malware em memória e credenciais voláteis."
            },
            "mobile": {
              "title": "Mobile Forensics",
              "desc": "Extração lógica/física de smartphones (iOS/Android), análise de apps, WhatsApp, Telegram."
            },
            "network": {
              "title": "Network Forensics",
              "desc": "Análise de PCAP, logs de firewall, IDS/IPS, reconstrução de sessões HTTP/HTTPS."
            },
            "timeline": {
              "title": "Timeline Analysis",
              "desc": "Reconstrução cronológica de eventos (file system, registry, logs) para entender sequência do ataque."
            },
            "custodian": {
              "title": "Cadeia de Custódia",
              "desc": "Documentação completa da preservação, coleta, transporte e análise de evidências (ISO 27037)."
            },
            "report": {
              "title": "Relatórios Periciais",
              "desc": "Laudos técnicos estruturados com metodologia ISO 27042, reprodutíveis e defensáveis em juízo."
            },
            "testimony": {
              "title": "Testemunho Especializado",
              "desc": "Defesa oral de laudo em audiências judiciais com linguagem acessível ao jurídico."
            },
            "counter": {
              "title": "Contraprova e Reexame",
              "desc": "Análise crítica de laudos de terceiros e identificação de falhas metodológicas."
            },
            "preservation": {
              "title": "Preservação de Evidências",
              "desc": "Coleta on-site ou remota com ferramentas certificadas e hash criptográfico para integridade."
            }
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
            "pericias": {
              "label": "perícias",
              "value": "450+"
            },
            "laudos": {
              "label": "laudos aceitos",
              "value": "100%"
            },
            "iso": {
              "label": "preservação",
              "value": "ISO"
            },
            "assitencia": {
              "label": "resposta",
              "value": "24/7"
            }
          }
        },
        "process": {
          "title": "processo pericial",
          "desc": "De contato inicial a laudo final em 2-4 semanas, seguindo rigorosos protocolos de preservação.",
          "steps": {
            "s1": {
              "step": "01",
              "title": "Triagem",
              "desc": "Entendimento do caso, tipo de evidência, urgência e objetivos."
            },
            "s2": {
              "step": "02",
              "title": "Coleta",
              "desc": "Preservação on-site ou remota com ferramentas certificadas."
            },
            "s3": {
              "step": "03",
              "title": "Análise",
              "desc": "Exame técnico seguindo metodologia ISO 27042 e NIST."
            },
            "s4": {
              "step": "04",
              "title": "Laudo",
              "desc": "Relatório técnico estruturado com achados e conclusões."
            },
            "s5": {
              "step": "05",
              "title": "Defesa",
              "desc": "Apresentação executiva ou testemunho especializado em juízo."
            }
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
            "ass": {
              "title": "Assessments de Segurança",
              "desc": "Avaliação de maturidade em cibersegurança com frameworks reconhecidos (NIST CSF, CIS, ISO 27001)."
            },
            "audit": {
              "title": "Auditorias de Conformidade",
              "desc": "Auditorias independentes ISO 27001, ISO 27701, SOC 2, PCI-DSS, LGPD com relatórios executivos."
            },
            "iso": {
              "title": "Implementação ISO 27001",
              "desc": "Projeto estruturado para certificação ISO 27001: SGSI, políticas, controles e preparação para auditoria."
            },
            "pen": {
              "title": "Penetration Testing",
              "desc": "Pentest externo/interno, web apps, APIs, infraestrutura e social engineering com relatórios técnicos."
            },
            "vuln": {
              "title": "Vulnerability Assessment",
              "desc": "Varredura e análise de vulnerabilidades com priorização por criticidade e impacto no negócio."
            },
            "gov": {
              "title": "Governança de Segurança",
              "desc": "Estruturação de comitês de segurança, políticas, procedimentos e frameworks de governança."
            },
            "due": {
              "title": "Due Diligence de Fornecedores",
              "desc": "Avaliação de segurança e privacidade de vendors críticos com questionários e evidências."
            },
            "train": {
              "title": "Treinamentos e Awareness",
              "desc": "Programas de conscientização em segurança e privacidade customizados para diferentes públicos."
            },
            "reg": {
              "title": "Assessoria Regulatória",
              "desc": "Consultoria para conformidade com regulamentações setoriais (BACEN, SUSEP, ANS, ANATEL)."
            }
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
            "fw": {
              "label": "frameworks",
              "value": "15+"
            },
            "cert": {
              "label": "certificações",
              "value": "100%"
            },
            "comp": {
              "label": "compliance score",
              "value": "A+"
            },
            "stake": {
              "label": "stakeholders",
              "value": "800+"
            }
          }
        },
        "process": {
          "title": "processo de auditoria",
          "desc": "De kickoff a relatório final em 4–8 semanas, garantindo conformidade e confiança.",
          "steps": {
            "s1": {
              "step": "01",
              "title": "Kickoff e Escopo",
              "desc": "Alinhamento de objetivos, escopo e timeline do projeto."
            },
            "s2": {
              "step": "02",
              "title": "Coleta de Evidências",
              "desc": "Questionários, entrevistas e análise documental rigorosa."
            },
            "s3": {
              "step": "03",
              "title": "Análise e Gap Analysis",
              "desc": "Comparação com frameworks e identificação de riscos."
            },
            "s4": {
              "step": "04",
              "title": "Relatório e Apresentação",
              "desc": "Score de maturidade e roadmap de recomendações."
            },
            "s5": {
              "step": "05",
              "title": "Plano de Remediação",
              "desc": "Acompanhamento até a certificação ou adequação total."
            }
          }
        },
        "cta": {
          "title": "precisa de auditoria ou certificação?",
          "desc": "solicite assessment de segurança, auditoria de conformidade ou consultoria especializada para certificação ISO ou SOC 2.",
          "btn1": "solicitar assessment",
          "btn2": "falar com consultor"
        }
      },
      "celebration": {
        "continue_btn": "continuar navegando"
      },
      "notfound": {
        "title": "página não encontrada",
        "desc": "a rota que você buscou não existe ou foi removida.",
        "cta": "voltar ao início"
      },
      "clients": {
        "eyebrow": "quem confia na ness.",
        "title": "empresas que transformamos"
      }
    }
  }
};

/**
 * en/es são carregados sob demanda por `import()` (chunk próprio, com hash e
 * cache imutável). O pt vem inline: é o idioma padrão e não deve esperar rede.
 */
const loaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('./locales/en.json'),
  es: () => import('./locales/es.json'),
};

async function ensureLanguage(lng: string) {
  const base = lng.split('-')[0];
  const load = loaders[base];
  if (!load || i18n.hasResourceBundle(base, 'translation')) return;
  const mod = await load();
  i18n.addResourceBundle(base, 'translation', mod.default, true, true);
}

/**
 * Preferência salva pelo usuário. No servidor não existe `localStorage`: o
 * HTML da edge sai sempre em pt, e a troca acontece depois da hidratação
 * (abaixo). Iniciar o i18n direto em `storedLng` faria o primeiro render do
 * cliente divergir do HTML do servidor.
 */
const storedLng = (typeof localStorage !== 'undefined' && localStorage.getItem('ness_lang')) || 'pt';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: ptResources,
    partialBundledLanguages: true,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en', 'es'],
    // Only persist manual selections — do NOT auto-detect from browser navigator
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ness_lang',
    },
    // pt é o idioma do primeiro render, no servidor e no cliente
    lng: 'pt',
    interpolation: {
      escapeValue: false
    },
  });

// Carrega o bundle do idioma antes de trocar, para não piscar chaves cruas.
const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = ((lng?: string, cb?: Parameters<typeof originalChangeLanguage>[1]) => {
  if (!lng) return originalChangeLanguage(lng, cb);
  return ensureLanguage(lng).then(() => originalChangeLanguage(lng, cb));
}) as typeof i18n.changeLanguage;

if (storedLng !== 'pt') {
  ensureLanguage(storedLng).then(() => originalChangeLanguage(storedLng));
}

export default i18n;
