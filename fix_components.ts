import fs from 'fs';

let content = fs.readFileSync('src/components/EmergencyChatModal.tsx', 'utf8');
content = content.replace("'ATENÇÃO: Você iniciou o protocolo de acionamento do n.cirt. Este canal tem SLA de atendimento de 15 minutos.'", "t('emergency.warning')");
content = content.replace("'Qual o porte o incidente de segurança atual? (Ex: Ransomware, Vazamento de Dados, Indisponibilidade)'", "t('emergency.botInitial')");
content = content.replace("'Sinal recebido pela central n.cirt. Um coordenador tático da Ness está sendo alocado para a sua sessão emergencial.\\n\\nPor favor, não reinicie os servidores infectados até o início do contato remoto para preservação de evidências forenses.'", "t('emergency.botWait')");
content = content.replace("emergência</span>", "{t('emergency.badge')}</span>");
content = content.replace(">War Room Activation Protocol<", ">{t('emergency.protocol')}<");
content = content.replace("Este canal isolado é exclusivo para incidentes críticos ativos (Cyberbreach, Ransomware). O faturamento emergencial aplicável começa a partir da entrada tática.", "{t('emergency.banner')}");
content = content.replace("placeholder=\"Descreva os primeiros sintomas do pain point atual...\"", "placeholder={t('emergency.placeholder')}");
fs.writeFileSync('src/components/EmergencyChatModal.tsx', content);

let blog = fs.readFileSync('src/pages/BlogPost.tsx', 'utf8');
blog = blog.replace("conteúdo completo em breve.", "{t('blog.comingSoon')}");
fs.writeFileSync('src/pages/BlogPost.tsx', blog);

let c = fs.readFileSync('src/pages/PortfolioCase.tsx', 'utf8');
c = c.replace(">resultado<", ">{t('portfolio.result')}<");
fs.writeFileSync('src/pages/PortfolioCase.tsx', c);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
nav = nav.replace("label: `${YEARS_OF_LEGACY} anos`,", "label: t('nav.celebration.label', { years: YEARS_OF_LEGACY }),");
nav = nav.replace("title: `${YEARS_OF_LEGACY} anos de engenharia de precisão`,", "title: t('nav.celebration.title', { years: YEARS_OF_LEGACY }),");
nav = nav.replace("message: `estamos celebrando ${YEARS_OF_LEGACY} anos de inovação, resiliência e parcerias de sucesso. obrigado por fazer parte da nossa história.`,", "message: t('nav.celebration.message', { years: YEARS_OF_LEGACY }),");
fs.writeFileSync('src/components/Navbar.tsx', nav);
