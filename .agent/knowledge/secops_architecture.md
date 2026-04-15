# Arquitetura Real: n.secops

> Este documento serve como referência de inteligência para agentes e desenvolvedores entenderem o que roda "por baixo do capô" do n.secops. O ecossistema roda de forma invisível.

## O Ecossistema
A entrega da vertical `n.secops` na Ness opera através da integração profunda de ferramentas Open-Source e Proprietárias que garantem a segurança ativa dos ambientes de clientes. A infraestrutura é ancorada nas seguintes plataformas:

### 1. SIEM & XDR
Temos um tenant centralizado que serve como motor principal de detecção de eventos.
- Possuímos agentes instalados direto nos endpoints laborais dos clientes.
- Agentes cobrem os tenants de correio eletrônico (Microsoft 365 e Google Workspace).

### 2. Gestão Remota / RMM
- Integrado na mesma trilha, operamos plataformas RMM corporativas para visibilidade e intervenção gerencial.
- O RMM coleta continuamente os inventários de Hardware, Software, status de Patching e mapeia Vulnerabilidades não patchadas.
- Possui capacidade de desligar/isolar endpoints remotamente em um clique ou via script.

### 3. Orquestração / SOAR
- O SOAR lê regras em tempo real do nosso SIEM.
- Quando uma regra é acionada, o orquestrador executa *playbooks*.
- Dependendo do contrato de nível de serviço com o cliente (e a gravidade do incidente), o SOAR aciona o RMM e o endpoint comprometido é automaticamente desabilitado ("containment" imediato sem ação humana).

### 4. Inteligência Agêntica (Core: Ness AI)
A automação não para no SOC.
- Um modelo agêntico de IA consome o incidente e o playbook gerado.
- Abre imediatamente chamados em nosso sistema de ITSM (tickets).
- Dispara alertas táticos estruturados para canais cadastrados (Grupos do MS Teams, Canais de Slack, WhatsApp de diretores, etc).
- Mantém o Dashboard do SOC atualizado.
- **Integrações de Parceiros:** Essa camada de IA consome não só nosso SIEM, mas integra via APIs com soluções EDR e XDR que os próprios clientes já possam ter, normalizando o tratamento do incidente.

### 5. Governança e Controle de Privacidade (GRC & POAM)
A resposta ao incidente retroalimenta todo o contexto processual corporativo.
- Os agentes de IA acessam o software de GRC para atualizar a Postura de Segurança e registrar no POAM (Plan Of Action and Milestones) todo o rastreamento das mitigações.
- Se no escopo do contrato houver, a aplicação de controle de Privacidade (LGPD) também é automaticamente notificada do incidente/mitigação, protegendo a auditoria legal.

---
**Observação para Mapeamento em Interfaces Web (Páginas C-Level)**
Quando formos falar desse sistema no site (ex: `solutionsData.ts`), traduzimos tudo em fluxos de negócios:
*SIEM -> "Plataforma Centralizada de Anomalias"*
*RMM -> "Gestão Remota & Patching (RMM)"*
*SOAR -> "Orquestração Autônoma (SOAR)"*
*IA & Integração ITSM -> "IA Agêntica de Triagem"*
*GRC -> "Postura de Risco e GRC Ativa"*
