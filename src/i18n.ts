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
        "secops": {
          "title": "n.secops",
          "fullTitle": "resiliência operacional & continuidade",
          "desc": "SOC 24×7: detecção, resposta e gestão de riscos num contrato.",
          "longDesc": "o n.secops não é apenas sobre tecnologia; é sobre a sobrevivência do seu negócio. protegemos sua reputação e sua operação através de um centro de operações de segurança (SOC) de elite que monitora, detecta e neutraliza ameaças antes que causem impacto.",
          "cta": "solicitar diagnóstico de segurança"
        },
        "infraops": {
          "title": "n.infraops",
          "fullTitle": "infraestrutura inteligente & suporte global",
          "desc": "Infraestrutura e cloud: service desk, ITIL, backup e recuperação.",
          "longDesc": "o n.infraops redefine o suporte técnico tradicional. unimos a robustez do framework ITIL à agilidade de um sistema de IA aplicada que atua como copiloto das nossas operações.",
          "cta": "otimizar minha infraestrutura"
        },
        "devarch": {
          "title": "n.devarch",
          "fullTitle": "arquitetura orientada ao desenvolvedor & escala segura",
          "desc": "Engenharia e arquitetura de software, com segurança desde o código.",
          "longDesc": "no n.devarch, transformamos o desenvolvimento em uma vantagem competitiva. criamos nossas próprias soluções e capacitamos empresas a alcançarem escala extrema.",
          "cta": "escalar meu desenvolvimento"
        },
        "autoops": {
          "title": "n.autoops",
          "fullTitle": "eficiência operacional & automação estratégica",
          "desc": "Automação de processos e operações com agentes de IA.",
          "longDesc": "o n.autoops é o braço de inteligência da ness. que coloca sua empresa à frente da concorrência. desenvolvemos assistentes personalizados (copilotos) que assumem tarefas repetitivas.",
          "cta": "agendar demo da gabi.os"
        },
        "cirt": {
          "title": "n.cirt",
          "fullTitle": "resposta estratégica a incidentes críticos",
          "desc": "Coordenação de incidentes críticos, da sala de guerra à retomada.",
          "longDesc": "o n.cirt é a elite da resposta a incidentes. quando o impensável acontece, nosso time entra em campo para conter, remediar e reconstruir com precisão cirúrgica.",
          "cta": "falar com time de resposta"
        },
        "ciclo": {
          "titulo": "cinco soluções e duas marcas, cada uma para um momento do seu ambiente",
          "lede": "Comece pelo momento em que você está. Quando um incidente atravessa esses momentos, o caso passa de uma equipe para a outra com o contexto junto.",
          "estagios": {
            "construir": "construir",
            "operar": "operar",
            "proteger": "proteger",
            "responder": "responder",
            "comprovar": "comprovar"
          },
          "forense": "Perícia digital, com cadeia de custódia preservada.",
          "trustness": "Auditoria, conformidade e DPO como serviço.",
          "legenda": "Onde cada solução atua. As n. são soluções da ness.; forense.io e trustness. são marcas próprias, com equipe e método dedicados.",
          "ver_mapa": "ver o mapa das soluções",
          "passagem": {
            "titulo": "quando um incidente atravessa o ecossistema",
            "intro": "Cada passagem só acontece quando o caso pede. Um incidente sem dado pessoal, por exemplo, não chega à trustness.",
            "secops": "Detecta e contém o que já está autorizado no runbook.",
            "cirt": "Abre a sala de guerra e coordena TI, jurídico e comunicação.",
            "forense": "Preserva e analisa a evidência, com laudo defensável em juízo.",
            "trustness": "Conduz a comunicação à ANPD e aos titulares.",
            "para_cirt": "incidente crítico",
            "para_forense": "precisa de perícia",
            "para_trustness": "envolve dado pessoal"
          }
        },
        "use_cases": "casos de uso reais",
        "cta_title": "sua empresa em um novo nível",
        "cta_desc": "descubra como a ness. pode transformar sua operação com inteligência e segurança de elite.",
        "tech_engine": "o motor da resiliência",
        "tech_desc": "para os interessados na engenharia por trás da proteção, aqui estão os pilares técnicos que sustentam nossa entrega de valor.",
        "impact_portfolio": "portfólio de impacto"
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
          "name_placeholder": "seu nome",
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
        "badge": "fale conosco — ness. precision",
        "meta_title": "contato — fale com um especialista",
        "meta_description": "Fale com a ness.: diagnóstico de segurança, infraestrutura, engenharia de software, LGPD e perícia digital. Resposta em até 1 dia útil. +55 (11) 2504-7650."
      },
      "cta": {
        "title": "pronto para o próximo nível?",
        "subtitle": "fale com nossos especialistas e descubra como a ness. pode elevar o nível de inteligência, segurança e eficiência da sua operação.",
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
        "open": "falar com a Gabi"
      },
      "consentimento": {
        "titulo": "aviso de privacidade",
        "texto": "Medimos audiência para entender como o site é usado. Nada é compartilhado com anunciantes, e você pode recusar sem perder nenhuma função. <politica>Como tratamos seus dados</politica>.",
        "aceitar": "aceitar",
        "recusar": "recusar"
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
        "privacy_consent": "Eu li e aceito a política de privacidade e os termos de uso.",
        "privacy_consent_links": "li e aceito a <privacidade>política de privacidade</privacidade> e os <termos>termos de uso</termos>."
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
          "titulo": "a evidência chega ao processo do jeito que saiu do equipamento",
          "lede": "Perícia em computadores, celulares, redes e contas em nuvem. Cada etapa fica registrada, e o hash da cópia é conferido de ponta a ponta, da coleta ao laudo.",
          "cta": "falar com um perito",
          "link": "ver a cadeia de custódia"
        },
        "cadeia": {
          "titulo": "a cadeia de custódia",
          "intro": "O hash é a impressão digital da cópia. Calculado na coleta, ele é conferido em cada etapa seguinte: se um único bit mudar, o hash muda, e a cadeia mostra onde.",
          "legenda": "O mesmo hash em todas as etapas é o que prova que a evidência não mudou. Hash ilustrativo. Coleta e preservação seguem a ISO/IEC 27037.",
          "etapas": [
            {
              "nome": "coleta",
              "texto": "Cópia bit a bit, com bloqueio de escrita no original.",
              "estado": "calculado"
            },
            {
              "nome": "preservação",
              "texto": "Original lacrado, com registro de quem teve acesso e quando.",
              "estado": "conferido"
            },
            {
              "nome": "análise",
              "texto": "Sempre na cópia. Linha do tempo, arquivos apagados, memória e rede.",
              "estado": "conferido"
            },
            {
              "nome": "laudo",
              "texto": "Método reproduzível, conforme a ISO/IEC 27042.",
              "estado": "conferido"
            },
            {
              "nome": "defesa",
              "texto": "O perito explica o laudo em audiência, em linguagem de juízo.",
              "estado": "conferido"
            }
          ]
        },
        "quando": {
          "titulo": "quando chamar a perícia",
          "itens": [
            {
              "titulo": "ransomware ou invasão",
              "texto": "Descobrir por onde entraram, até onde chegaram e o que levaram."
            },
            {
              "titulo": "vazamento de dados",
              "texto": "Rastrear como a informação saiu da empresa, e por quem."
            },
            {
              "titulo": "processo judicial",
              "texto": "Exame do dispositivo apreendido, com laudo e defesa em audiência."
            },
            {
              "titulo": "fraude interna",
              "texto": "E-mails, mensagens e arquivos analisados com respeito à LGPD."
            },
            {
              "titulo": "laudo da outra parte",
              "texto": "Contraprova: análise crítica do método e das conclusões de um laudo de terceiros."
            },
            {
              "titulo": "antes que a prova suma",
              "texto": "Coleta preventiva, no local ou remota, com o hash calculado na hora."
            }
          ]
        },
        "cta": {
          "title": "precisa de perícia ou investigação?",
          "desc": "Conte o caso: o tipo de evidência, a urgência e para que o laudo vai servir.",
          "btn": "falar com um perito"
        }
      },
      "trustness": {
        "title": "trustness",
        "tabTitle": "auditoria e conformidade",
        "hero": {
          "titulo": "você chega à auditoria sabendo o que ela vai encontrar",
          "lede": "Auditoria independente, implementação da ISO 27001 e programa de privacidade da LGPD, com relatório executivo e um plano de correção em ordem de prioridade.",
          "cta": "solicitar assessment",
          "link": "ver como a auditoria anda"
        },
        "auditoria": {
          "titulo": "a auditoria, semana a semana",
          "intro": "A ordem das fases é fixa. A duração de cada uma depende do escopo.",
          "semanas": "semanas",
          "legenda": "Do kickoff ao plano de correção: 4 semanas no escopo menor, até 8 no maior.",
          "fases": [
            {
              "nome": "kickoff e escopo",
              "texto": "O que entra, com quem falar, que evidência pedir."
            },
            {
              "nome": "coleta de evidências",
              "texto": "Documentos, configurações e entrevistas."
            },
            {
              "nome": "análise de gaps",
              "texto": "Cada controle contra o que o framework exige."
            },
            {
              "nome": "relatório e apresentação",
              "texto": "Para o time técnico e para a diretoria."
            },
            {
              "nome": "plano de correção",
              "texto": "Os achados em ordem de risco e de esforço."
            }
          ]
        },
        "dpo": {
          "titulo": "dpo como serviço",
          "texto": "A trustness. assume o papel de encarregado da LGPD. Diagnóstico e adequação acontecem uma vez, na entrada. Depois, manutenção e auditoria se alternam, e o que a auditoria encontra volta para a operação.",
          "aegis": "A plataforma Aegis, própria, está incluída: ROPA, titulares, DPIA, incidentes e painéis.",
          "link": "conhecer o dpo como serviço",
          "diagrama": {
            "descricao": "Diagnóstico e adequação acontecem uma vez; depois, manutenção e auditoria se alternam num ciclo contínuo.",
            "diagnostico": "diagnóstico",
            "diagnostico_sub": "mapeamento e análise de gaps",
            "adequacao": "adequação",
            "adequacao_sub": "políticas, contratos e controles",
            "entrada": [
              "uma vez,",
              "na entrada"
            ],
            "manutencao": "manutenção",
            "manutencao_sub": [
              "titulares, ROPA",
              "e incidentes"
            ],
            "auditoria": "auditoria",
            "auditoria_sub": "controles e DPIA",
            "ida": "auditoria periódica",
            "volta": "achados voltam para a operação"
          }
        },
        "servicos": {
          "titulo": "serviços",
          "itens": [
            {
              "titulo": "assessment de segurança",
              "texto": "Maturidade em cibersegurança medida contra NIST CSF, CIS ou ISO 27001."
            },
            {
              "titulo": "auditoria de conformidade",
              "texto": "ISO 27001, ISO 27701, SOC 2, PCI-DSS e LGPD, com relatório executivo."
            },
            {
              "titulo": "implementação da ISO 27001",
              "texto": "SGSI, políticas, controles e preparação para a certificação."
            },
            {
              "titulo": "teste de intrusão",
              "texto": "Pentest externo e interno, aplicações web, APIs e engenharia social."
            },
            {
              "titulo": "gestão de vulnerabilidades",
              "texto": "Varredura e análise, priorizadas por criticidade e impacto no negócio."
            },
            {
              "titulo": "governança de segurança",
              "texto": "Comitês, políticas, procedimentos e frameworks de governança."
            },
            {
              "titulo": "due diligence de fornecedores",
              "texto": "Segurança e privacidade dos fornecedores críticos, com questionário e evidência."
            },
            {
              "titulo": "treinamento e conscientização",
              "texto": "Programas de segurança e privacidade para cada público da empresa."
            },
            {
              "titulo": "assessoria regulatória",
              "texto": "Conformidade com BACEN, SUSEP, ANS e ANATEL."
            }
          ]
        },
        "cta": {
          "title": "precisa de auditoria ou certificação?",
          "desc": "Conte o objetivo: certificação, adequação à LGPD ou uma avaliação independente antes da auditoria.",
          "btn1": "solicitar assessment",
          "btn2": "falar com um consultor"
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

/**
 * Garante que o bundle do idioma esteja carregado antes de renderizar. No
 * servidor isso precisa ser aguardado no loader: sem os recursos, a página
 * sairia com as chaves cruas.
 */
export async function ensureLanguage(lng: string) {
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
