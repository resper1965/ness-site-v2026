import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
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
        }
      },
      "hero": {
        "tag": "tecnologia digital de precisão",
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
          },
          "desc_placeholder": "detalhe o ocorrido com o máximo de informações possíveis (datas, locais, envolvidos)..."
        },
        "badge": "get in touch — ness. precision"
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
        "send": "enviar"
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
      }
    }
  },
  "en": {
    "translation": {
      "nav": {
        "solutions": "solutions",
        "about": "about",
        "portfolio": "portfolio",
        "blog": "blog",
        "careers": "careers",
        "contact": "contact",
        "services": "services",
        "cta": "get started",
        "celebration": {
          "label": "{{years}} Years",
          "title": "Celebrating {{years}} Years",
          "message": "For {{years}} years building the future of engineering and digital security with precision."
        }
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
        "technical_view_toggle": "engineering & ctos view",
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
        },
        "strategic_solutions": "strategic solutions",
        "use_cases": "real use cases",
        "business_value": "business value",
        "technical_arsenal": "operational arsenal",
        "onboarding_journey": "activation journey",
        "cta_title": "your company to the next level",
        "cta_desc": "discover how ness can transform your operation with elite intelligence and security.",
        "tech_engine": "resilience engine",
        "tech_desc": "for those interested in the engineering behind our protection, here are the technical pillars of our value delivery.",
        "impact_portfolio": "impact portfolio"
      },
      "services": {
        "title": "professional services",
        "subtitle": "technical and strategic expertise to accelerate your transformation and security journey.",
        "items": [
          {
            "title": "AI & Data Consulting",
            "desc": "Strategy for implementing copilots and corporate knowledge orchestration.",
            "tags": [
              "RAG",
              "LLM Ops",
              "Data Strategy"
            ]
          },
          {
            "title": "Incident Response (IR)",
            "desc": "Tactical response to cyber crises, damage containment, and environment recovery.",
            "tags": [
              "War Room",
              "Forensics",
              "Crisis Mgmt"
            ]
          },
          {
            "title": "Platform Engineering",
            "desc": "Design of scalable architectures and high-performance continuous delivery pipelines.",
            "tags": [
              "Cloud Native",
              "DevOps",
              "Scalability"
            ]
          },
          {
            "title": "Governance & Compliance",
            "desc": "GRC automation and dynamic adaptation to global standards and regulations.",
            "tags": [
              "ISO 27001",
              "GDPR",
              "Risk Audit"
            ]
          }
        ]
      },
      "verticals": {
        "title": "vertical business units",
        "subtitle": "dedicated ecosystems that enhance digital intelligence and trust.",
        "forense": {
          "desc": "leader in digital investigation and response to complex incidents. we combine proprietary technology and human expertise to uncover the invisible."
        },
        "trustness": {
          "desc": "strategic consulting in governance, risk, and compliance. building solid foundations for your company to grow with security and ethics."
        },
        "cta": "explore unit"
      },
      "blog": {
        "title": "technical knowledge",
        "subtitle": "we explore the frontiers of technology, security, and intelligence to keep your operation resilient and innovative.",
        "badge": "blog — ness. insights",
        "empty_title": "no insights found.",
        "empty_subtitle": "new content coming soon. stay tuned.",
        "read_article": "read full article",
        "back": "blog",
        "all_insights": "all insights",
        "talk_expert": "talk to an expert"
      },
      "portfolio": {
        "title": "success cases",
        "subtitle": "we demonstrate our authority through measurable results. each project is a commitment to technical excellence and business resilience.",
        "cta_title": "want results like these?",
        "cta_desc": "we are ready to apply our precision engineering to your next big challenge.",
        "badge": "impact portfolio — ness. precision",
        "empty": {
          "title": "no cases found.",
          "subtitle": "our team is preparing new cases. come back soon."
        },
        "confidentiality": "100% confidentiality",
        "case": {
          "back": "portfolio",
          "all": "all cases",
          "talk": "talk to specialist"
        }
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
        "history_title": "our history and legacy",
        "timeline": {
          "1991": "ness. is founded as an IT outsourcing spin-off of a large business group.",
          "1992": "Beginning of critical infrastructure, high-scale data processing and BPO.",
          "2004": "Global expansion: infrastructure in major events across Europe, Americas, Africa and Asia.",
          "2012": "Pioneer in specialized privacy and advanced digital security services.",
          "2015": "Launch of software and processes division, focusing on high performance digital engineering.",
          "2016": "Incubation of NESS Technology Healthcare (which would later become IONIC Health).",
          "2017": "Incubation of Trustness as a strategic business unit for GRC.",
          "2022": "Incubation of forense.io as a leader in digital investigation.",
          "2024": "Established as a modular platform for reliable and secure digital transformation.",
          "2026": "Launch of AI and Agents operation, consolidating ness. as a leader in intelligent knowledge orchestration."
        },
        "values_desc": "Non-negotiable technical excellence, constant applied innovation, true and transparent partnership, real and measurable results.",
        "cred": {
          "global": "Global presence",
          "security": "Security & Privacy",
          "ai": "AI & Agents"
        },
        "years_label": "years of excellence",
        "metrics": {
          "legacy": "years in operation",
          "countries": "countries served",
          "projects": "global projects",
          "uptime": "sla / uptime"
        },
        "history_sub": "years building the technological foundation of large corporations and global events."
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
          "name_placeholder": "your name or leave blank",
          "name_optional": "name (optional)",
          "contact_optional": "contact (optional)",
          "company": "company",
          "company_placeholder": "your company",
          "email": "corporate email",
          "email_placeholder": "email or phone for return",
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
          },
          "desc_placeholder": "detail the occurrence with as much information as possible (dates, locations, involved)..."
        },
        "badge": "get in touch — ness. precision"
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
        "learn_more": "learn more",
        "contact_expert": "talk to an expert",
        "loading": "loading...",
        "result": "result",
        "date": "date",
        "tag": "tag",
        "back": "back",
        "all": "all",
        "privacy_consent": "I have read and accept the privacy policy and terms of use."
      },
      "compliance": {
        "eyebrow": "compliance — ness. precision",
        "terms": {
          "title": "terms of use",
          "desc": "rules and guidelines for using our platforms and services.",
          "sec1": {
            "h": "1. acceptance",
            "p": "by accessing our solutions, you agree to comply with these terms and all applicable laws and regulations."
          },
          "sec2": {
            "h": "2. intellectual property",
            "p": "all content, software and methodologies by ness. are protected by intellectual property rights and cannot be reproduced without prior authorization."
          },
          "sec3": {
            "h": "3. responsibility",
            "p": "ness. commits to maximum availability and security, but is not responsible for damages resulting from user credential misuse."
          }
        },
        "privacy": {
          "title": "privacy policy",
          "desc": "how we handle your data with security and transparency.",
          "sec1": {
            "h": "1. data collection",
            "p": "we collect only the necessary information to provide our engineering and security services, such as corporate contact data and security logs."
          },
          "sec2": {
            "h": "2. purpose",
            "p": "your data is used exclusively for contract execution, technical support, improving solutions and legal compliance (GDPR)."
          },
          "sec3": {
            "h": "3. security",
            "p": "we implement cutting-edge technical and organizational measures, including encryption and strict access control, to protect your info."
          },
          "sec4": {
            "h": "4. your rights",
            "p": "you have the right to access, correct, delete or request data portability anytime through our privacy channel."
          }
        },
        "ethics": {
          "title": "compliance & ethics",
          "desc": "our commitment to integrity and global ethical conduct.",
          "sec1": {
            "h": "1. code of conduct",
            "p": "we operate under the highest standards of professional ethics, fighting any form of corruption, discrimination or unethical conduct."
          },
          "sec2": {
            "h": "2. whistleblower channel",
            "p": "we maintain an independent and anonymous channel for reporting violations of our code of conduct or current laws."
          },
          "sec3": {
            "h": "3. certifications",
            "p": "our operations are audited and follow international frameworks such as ISO 27001 and SOC2, ensuring world-class governance."
          }
        }
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
        "status": "system live status: optimal",
        "ecosystem": "ecosystem",
        "email_placeholder": "your email",
        "locations": [
          "brazil",
          "portugal",
          "chile",
          "peru",
          "colombia",
          "united states"
        ]
      },
      "a11y": {
        "close": "close",
        "subscribe": "subscribe",
        "send": "send"
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
            "disk": {
              "title": "Disk Analysis",
              "desc": "Bit-by-bit cloning, deleted file recovery, filesystem analysis (NTFS, ext4, APFS)."
            },
            "ram": {
              "title": "Memory Forensics (RAM)",
              "desc": "Analysis of processes, network connections, malware in memory, and volatile credentials."
            },
            "mobile": {
              "title": "Mobile Forensics",
              "desc": "Logical/physical extraction of smartphones (iOS/Android), app analysis, WhatsApp, Telegram."
            },
            "network": {
              "title": "Network Forensics",
              "desc": "PCAP analysis, firewall logs, IDS/IPS, HTTP/HTTPS session reconstruction."
            },
            "timeline": {
              "title": "Timeline Analysis",
              "desc": "Chronological reconstruction of events (file system, registry, logs) to understand the attack sequence."
            },
            "custodian": {
              "title": "Chain of Custody",
              "desc": "Complete documentation of evidence preservation, collection, transport, and analysis (ISO 27037)."
            },
            "report": {
              "title": "Expert Reports",
              "desc": "Structured technical reports with ISO 27042 methodology, reproducible and defensible in court."
            },
            "testimony": {
              "title": "Expert Testimony",
              "desc": "Oral defense of report in judicial hearings with language accessible to legal professionals."
            },
            "counter": {
              "title": "Counterproof and Re-examination",
              "desc": "Critical analysis of third-party reports and identification of methodological flaws."
            },
            "preservation": {
              "title": "Evidence Preservation",
              "desc": "On-site or remote collection with certified tools and cryptographic hash for integrity."
            }
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
            "pericias": {
              "label": "expertises",
              "value": "450+"
            },
            "laudos": {
              "label": "reports accepted",
              "value": "100%"
            },
            "iso": {
              "label": "preservation",
              "value": "ISO"
            },
            "assitencia": {
              "label": "response",
              "value": "24/7"
            }
          }
        },
        "process": {
          "title": "forensic process",
          "desc": "From initial contact to final report in 2-4 weeks, following rigorous preservation protocols.",
          "steps": {
            "s1": {
              "step": "01",
              "title": "Triage",
              "desc": "Understanding the case, type of evidence, urgency, and objectives."
            },
            "s2": {
              "step": "02",
              "title": "Collection",
              "desc": "On-site or remote preservation with certified tools."
            },
            "s3": {
              "step": "03",
              "title": "Analysis",
              "desc": "Technical examination following ISO 27042 and NIST methodology."
            },
            "s4": {
              "step": "04",
              "title": "Report",
              "desc": "Structured technical report with findings and conclusions."
            },
            "s5": {
              "step": "05",
              "title": "Defense",
              "desc": "Executive presentation or expert testimony in court."
            }
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
            "ass": {
              "title": "Security Assessments",
              "desc": "Cybersecurity maturity assessment with recognized frameworks (NIST CSF, CIS, ISO 27001)."
            },
            "audit": {
              "title": "Compliance Audits",
              "desc": "Independent audits ISO 27001, ISO 27701, SOC 2, PCI-DSS, GDPR with executive reports."
            },
            "iso": {
              "title": "ISO 27001 Implementation",
              "desc": "Structured project for ISO 27001 certification: ISMS, policies, controls, and audit preparation."
            },
            "pen": {
              "title": "Penetration Testing",
              "desc": "External/internal pentest, web apps, APIs, infrastructure, and social engineering with technical reports."
            },
            "vuln": {
              "title": "Vulnerability Assessment",
              "desc": "Scanning and analysis of vulnerabilities prioritized by criticality and business impact."
            },
            "gov": {
              "title": "Security Governance",
              "desc": "Structuring of security committees, policies, procedures, and governance frameworks."
            },
            "due": {
              "title": "Vendor Due Diligence",
              "desc": "Security and privacy assessment of critical vendors via questionnaires and evidence."
            },
            "train": {
              "title": "Training & Awareness",
              "desc": "Security and privacy awareness programs customized for different audiences."
            },
            "reg": {
              "title": "Regulatory Advisory",
              "desc": "Consulting for compliance with sector-specific financial and telecom regulations."
            }
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
            "fw": {
              "label": "frameworks",
              "value": "15+"
            },
            "cert": {
              "label": "certifications",
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
          "title": "audit process",
          "desc": "From kickoff to final report in 4–8 weeks, ensuring compliance and trust.",
          "steps": {
            "s1": {
              "step": "01",
              "title": "Kickoff and Scope",
              "desc": "Alignment of project objectives, scope, and timeline."
            },
            "s2": {
              "step": "02",
              "title": "Evidence Collection",
              "desc": "Questionnaires, interviews, and rigorous document analysis."
            },
            "s3": {
              "step": "03",
              "title": "Analysis and Gap Analysis",
              "desc": "Comparison with frameworks and risk identification."
            },
            "s4": {
              "step": "04",
              "title": "Report and Presentation",
              "desc": "Maturity score and roadmap of recommendations."
            },
            "s5": {
              "step": "05",
              "title": "Remediation Plan",
              "desc": "Follow-up until certification or full compliance."
            }
          }
        },
        "cta": {
          "title": "need an audit or certification?",
          "desc": "request a security assessment, compliance audit, or specialized consulting for ISO or SOC 2 certification.",
          "btn1": "request assessment",
          "btn2": "talk to a consultant"
        }
      },
      "celebration": {
        "continue_btn": "continue browsing"
      },
      "notfound": {
        "title": "page not found",
        "desc": "the route you're looking for does not exist or has been removed.",
        "cta": "back to home"
      }
    }
  },
  "es": {
    "translation": {
      "nav": {
        "solutions": "soluciones",
        "about": "nosotros",
        "portfolio": "portafolio",
        "blog": "blog",
        "careers": "carreras",
        "contact": "contacto",
        "services": "servicios",
        "cta": "empezar ahora",
        "celebration": {
          "label": "{{years}} Años",
          "title": "Celebrando {{years}} Años",
          "message": "Hace {{years}} años construyendo el futuro de la ingeniería y seguridad digital con precisión."
        }
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
        "technical_view_toggle": "visión de ingeniería",
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
        },
        "strategic_solutions": "soluciones estratégicas",
        "use_cases": "casos de uso",
        "business_value": "valor del negocio",
        "technical_arsenal": "arsenal técnico",
        "onboarding_journey": "jornada de activación",
        "cta_title": "su empresa en un nuevo nivel",
        "cta_desc": "descubra cómo ness transforma su operación con seguridad de élite.",
        "tech_engine": "motor de resiliencia",
        "tech_desc": "los cimientos técnicos detrás de nuestra entrega de valor.",
        "impact_portfolio": "portafolio de impacto"
      },
      "services": {
        "title": "servicios profesionales",
        "subtitle": "experiencia técnica y estratégica para acelerar su viaje de transformación y seguridad.",
        "items": [
          {
            "title": "Consultoría en IA & Datos",
            "desc": "Estrategia para la implementación de copilotos y orquestación del conocimiento corporativo.",
            "tags": [
              "RAG",
              "LLM Ops",
              "Data Strategy"
            ]
          },
          {
            "title": "Respuesta a Incidentes (IR)",
            "desc": "Respuesta táctica a cibercrisis, contención de daños y recuperación de entornos.",
            "tags": [
              "War Room",
              "Forensics",
              "Crisis Mgmt"
            ]
          },
          {
            "title": "Ingeniería de Plataforma",
            "desc": "Diseño de arquitecturas escalables y pipelines de entrega continua de alto rendimiento.",
            "tags": [
              "Cloud Native",
              "DevOps",
              "Scalability"
            ]
          },
          {
            "title": "Gobernanza & Cumplimiento",
            "desc": "Automatización de GRC y adaptación dinámica a normas globales y regulaciones.",
            "tags": [
              "ISO 27001",
              "GDPR",
              "Risk Audit"
            ]
          }
        ]
      },
      "verticals": {
        "title": "unidades de negocio verticales",
        "subtitle": "ecosistemas dedicados que potencian la inteligencia y la confianza digital.",
        "forense": {
          "desc": "líder en investigación digital y respuesta a incidentes complejos. combinamos tecnología propia y experiencia humana para descubrir lo invisible."
        },
        "trustness": {
          "desc": "consultoría estratégica en gobernanza, riesgos y cumplimiento. creando bases sólidas para que su empresa crezca con seguridad y ética."
        },
        "cta": "explorar unidad"
      },
      "blog": {
        "title": "conocimiento técnico",
        "subtitle": "exploramos las fronteras de la tecnología, seguridad e inteligencia para mantener su operación resiliente e innovadora.",
        "badge": "blog — ness. insights",
        "empty_title": "no se encontraron insights.",
        "empty_subtitle": "nuevo contenido pronto. manténgase atento.",
        "read_article": "leer artículo completo",
        "back": "blog",
        "all_insights": "todos los insights",
        "talk_expert": "hablar con experto"
      },
      "portfolio": {
        "title": "casos de éxito",
        "subtitle": "demostramos nuestra autoridad a través de resultados mensurables. cada proyecto es un compromiso con la excelencia técnica y la resiliencia del negocio.",
        "cta_title": "¿quieres resultados como estos?",
        "cta_desc": "estamos listos para aplicar nuestra ingeniería de precisión en su próximo gran desafío.",
        "badge": "portafolio de impacto — ness. precision",
        "empty": {
          "title": "no se hallaron casos.",
          "subtitle": "nuestro equipo prepara nuevos casos."
        },
        "confidentiality": "100% de confidencialidad",
        "case": {
          "back": "portafolio",
          "all": "todos los casos",
          "talk": "hablar con experto"
        }
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
        "history_title": "nuestra historia y legado",
        "timeline": {
          "1991": "ness. se funda como externalización del área técnica de un gran grupo económico.",
          "1992": "Inicio de infraestructura crítica, procesamiento de datos y BPO a gran escala.",
          "2004": "Expansión global: infraestructura en grandes eventos por Europa, América, África y Asia.",
          "2012": "Pioneros en servicios especializados de privacidad y seguridad digital avanzada.",
          "2015": "Lanzamiento de división de software, enfocada en ingeniería de alto rendimiento.",
          "2016": "Incubación de NESS Technology Healthcare (que después sería IONIC Health).",
          "2017": "Incubación de Trustness como unidad de negocios estratégica para GRC.",
          "2022": "Incubación de forense.io como unidad de negocios líder en investigación digital.",
          "2024": "Establecida como una plataforma modular para una transformación digital segura.",
          "2026": "Inicio de operaciones de IA y Agentes, consolidando a ness. como líder en inteligencia."
        },
        "values_desc": "Excelencia técnica innegociable, innovación constante, alianza verdadera y resultados medibles.",
        "cred": {
          "global": "Presencia global",
          "security": "Seg. y Privacidad",
          "ai": "IA y Agentes"
        },
        "years_label": "años de excelencia",
        "metrics": {
          "legacy": "años en operación",
          "countries": "países servidos",
          "projects": "proyectos globales",
          "uptime": "sla / uptime"
        },
        "history_sub": "años construyendo la base tecnológica de grandes corporaciones y eventos globales."
      },
      "contact": {
        "title": "construyamos el futuro juntos",
        "subtitle": "contacte a nuestro equipo de expertos para transformar su operación digital.",
        "form": {
          "name": "nombre",
          "name_placeholder": "su nombre o dejar en blanco",
          "company": "empresa",
          "company_placeholder": "su empresa",
          "email": "correo corporativo",
          "email_placeholder": "email o teléfono de retorno",
          "subject": "asunto",
          "subject_select": "seleccione un asunto",
          "message": "mensaje",
          "message_placeholder": "¿cómo podemos ayudar?",
          "send": "enviar mensaje",
          "success": "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.",
          "error": "Error al enviar el mensaje. Por favor, inténtelo de nuevo.",
          "name_optional": "nombre (opcional)",
          "contact_optional": "contacto (opcional)"
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
          },
          "desc_placeholder": "detalle la ocurrencia con tanta información como sea posible..."
        },
        "badge": "get in touch — ness. precision",
        "info": {
          "email": "email",
          "phone": "teléfono",
          "office": "oficina"
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
        "learn_more": "saber más",
        "contact_expert": "hablar con un experto",
        "loading": "cargando...",
        "result": "resultado",
        "date": "fecha",
        "tag": "etiqueta",
        "back": "volver",
        "all": "todos",
        "privacy_consent": "He leído e acepto la política de privacidad y los términos de uso."
      },
      "compliance": {
        "eyebrow": "compliance — ness. precision",
        "terms": {
          "title": "términos de uso",
          "desc": "reglas y pautas para el uso de nuestras plataformas y servicios.",
          "sec1": {
            "h": "1. aceptación",
            "p": "al acceder a nuestras soluciones, usted acepta cumplir con estos términos y leyes aplicables."
          },
          "sec2": {
            "h": "2. propiedad intelectual",
            "p": "todo  el contenido y software están protegidos y no pueden reproducirse sin autorización."
          },
          "sec3": {
            "h": "3. responsabilidad",
            "p": "ness. se compromete con la máxima seguridad, pero no es responsable del mal uso por parte de los usuarios."
          }
        },
        "privacy": {
          "title": "política de privacidad",
          "desc": "cómo tratamos sus datos con seguridad.",
          "sec1": {
            "h": "1. recopilación de datos",
            "p": "recopilamos la info necesaria para dar servicios, contactos y registros de seguridad."
          },
          "sec2": {
            "h": "2. propósito",
            "p": "sus datos solo se usan para contratos, soporte, mejoras y cumplimiento legal (LGPD/GDPR)."
          },
          "sec3": {
            "h": "3. seguridad",
            "p": "implementamos medidas técnicas de última generación, como cifrado, para proteger datos."
          },
          "sec4": {
            "h": "4. sus derechos",
            "p": "tiene derecho a acceder, corregir o eliminar datos en cualquier momento a través de nuestro canal."
          }
        },
        "ethics": {
          "title": "compliance y ética",
          "desc": "nuestro compromiso con la integridad global.",
          "sec1": {
            "h": "1. código de conducta",
            "p": "operamos bajo los más altos estándares éticos, luchando contra la corrupción y discriminación."
          },
          "sec2": {
            "h": "2. canal de denuncias",
            "p": "mantenemos un canal anónimo y seguro para informar violaciones de leyes o códigos de conducta."
          },
          "sec3": {
            "h": "3. certificaciones",
            "p": "nuestras operaciones están auditadas por frameworks globales como ISO 27001 y SOC2."
          }
        }
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
        "status": "system live status: optimal",
        "ecosystem": "ecosistema",
        "email_placeholder": "su correo",
        "locations": [
          "brasil",
          "portugal",
          "chile",
          "perú",
          "colombia",
          "estados unidos"
        ]
      },
      "a11y": {
        "close": "cerrar",
        "subscribe": "suscribir",
        "send": "enviar"
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
            "disk": {
              "title": "Análisis de Discos",
              "desc": "Clonación bit a bit, recuperación de archivos, sistemas (NTFS, ext4, APFS)."
            },
            "ram": {
              "title": "Forense de Memoria (RAM)",
              "desc": "Análisis de procesos, red, malware residente en memoria y credenciales."
            },
            "mobile": {
              "title": "Mobile Forensics",
              "desc": "Extracción lógica/física de iOS/Android, análisis SMS, WhatsApp, Telegram."
            },
            "network": {
              "title": "Network Forensics",
              "desc": "Análisis PCAP, logs de cortafuegos, IDS, reconstrucción web HTTP."
            },
            "timeline": {
              "title": "Timeline Analysis",
              "desc": "Reconstrucción cronológica de sistemas de archivo y registros de la máquina."
            },
            "custodian": {
              "title": "Cadena de Custodia",
              "desc": "Documentación validada de la custodia legal desde recolección (ISO 27037)."
            },
            "report": {
              "title": "Dictámenes Periciales",
              "desc": "Laudos estructurados aptos para la defensa legal."
            },
            "testimony": {
              "title": "Testimonio Especializado",
              "desc": "Apoyo y exposición oral validada por expertos del sector."
            },
            "counter": {
              "title": "Contraprueba",
              "desc": "Reevaluación meticulosa para hallar falencias en análisis ajenos."
            },
            "preservation": {
              "title": "Preservación Legal",
              "desc": "Criptografía y aseguramiento pericial en toma de datos física/remota."
            }
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
            "pericias": {
              "label": "peritajes",
              "value": "450+"
            },
            "laudos": {
              "label": "aceptos judicialmente",
              "value": "100%"
            },
            "iso": {
              "label": "preservación",
              "value": "ISO"
            },
            "assitencia": {
              "label": "asistencia",
              "value": "24/7"
            }
          }
        },
        "process": {
          "title": "proceso pericial",
          "desc": "Atención técnica especializada completada y reporte en 2 a 4 semanas.",
          "steps": {
            "s1": {
              "step": "01",
              "title": "Triaje",
              "desc": "Visión y recolección analítica."
            },
            "s2": {
              "step": "02",
              "title": "Recolecta",
              "desc": "Asegurar integridad de datos forense."
            },
            "s3": {
              "step": "03",
              "title": "Análisis",
              "desc": "Rastrear bajo normativas NIST, ISO."
            },
            "s4": {
              "step": "04",
              "title": "Laudo",
              "desc": "Firma del informe de pruebas digitales."
            },
            "s5": {
              "step": "05",
              "title": "Defensa",
              "desc": "Soporte de evidencias final en mesa corporativa/legal."
            }
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
            "ass": {
              "title": "Asesorías",
              "desc": "Maturity assessments y brechas comparadas base ISO/NIST."
            },
            "audit": {
              "title": "Auditorías de Conformidad",
              "desc": "Auditoría formal como contraparte independiente."
            },
            "iso": {
              "title": "ISO 27001 Readiness",
              "desc": "Preparación proactiva y estructuración SGSI de primer nivel."
            },
            "pen": {
              "title": "Pentesting Validado",
              "desc": "Evaluación web, red perimetral, ingeniería y caja negra (Blackbox)."
            },
            "vuln": {
              "title": "Gestión de Vulnerabilidades",
              "desc": "Detección recurrente con CVSS enfocado en impacto comercial crítico."
            },
            "gov": {
              "title": "Risk & Governance",
              "desc": "Creación de comités operacionales de Ciberseguridad."
            },
            "due": {
              "title": "Due Diligence Externa",
              "desc": "Evaluación de cadena de suministros y sus normativas."
            },
            "train": {
              "title": "Entrenamiento Interno",
              "desc": "Educación corporativa anti-phishing con test en vivo."
            },
            "reg": {
              "title": "Asistencia Reguladora Regional",
              "desc": "Atender normativos locales BACEN, finanzas, entre otros."
            }
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
            "fw": {
              "label": "frameworks",
              "value": "15+"
            },
            "cert": {
              "label": "certificaciones",
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
          "title": "proceso de auditoría",
          "desc": "Mapeo a validación en tan solo 4-8 semanas.",
          "steps": {
            "s1": {
              "step": "01",
              "title": "Visión Inicial",
              "desc": "Cronograma y metas integrales."
            },
            "s2": {
              "step": "02",
              "title": "Evidencias",
              "desc": "Investigación, documentaciones e IA validada."
            },
            "s3": {
              "step": "03",
              "title": "Brechas de Seguridad",
              "desc": "Detección de irregularidades de control."
            },
            "s4": {
              "step": "04",
              "title": "Recomendaciones Técnicas",
              "desc": "Cierre detallado propuesto operativamente."
            },
            "s5": {
              "step": "05",
              "title": "Certificación Asistida",
              "desc": "Acompañamiento a logro incesante."
            }
          }
        },
        "cta": {
          "title": "¿necesita una re-auditoría o certificación?",
          "desc": "hable con nuestros CISO y auditores especializados en certificaciones tecnológicas de élite.",
          "btn1": "solicitar assessment",
          "btn2": "hablar con consultor"
        }
      },
      "celebration": {
        "continue_btn": "continuar navegando"
      },
      "notfound": {
        "title": "página no encontrada",
        "desc": "la ruta que busca no existe o fue eliminada.",
        "cta": "volver al inicio"
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
