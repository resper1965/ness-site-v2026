# Refatoração da SolutionPage.tsx

## Objetivo:
Quebrar o componente monolítico `SolutionPage.tsx` (~25KB, ~450 linhas) em abstrações menores para otimizar a performance, reduzir a carga do Vite e melhorar a arquitetura técnica da interface.

## Abordagem Arquitetural:
O refactoring envolverá extrair blocos principais (ex: Backgrounds puros com animação, elementos de preview do Dashboard lógico e estruturas condicionais) para componentes dedicados dentro de `src/components/solutions/`.

A página `SolutionPage.tsx` continuará operando como o Controlador/Página principal agregando estes sub-componentes.

## Passo-a-Passo:

**1. Extração do Dashboard (Componente Crítico)**
- Criar `src/components/solutions/SolutionDashboard.tsx`.
- Centralizar a lógica e animações de Dashboard que utiliza a modelagem rígida (`solution.dashboard?.progress.value`, `solution.dashboard?.mainStat`, etc.).
- Extrair o `ChatPreview` ou delegá-lo condicionalmente junto ao Dashboard.

**2. Extração do Background e Identidade Visual**
- Criar `src/components/solutions/SolutionHeroBackground.tsx`.
- Esse componente manterá a imagem de fundo absoluta, overlay gradual com bg-linear-to-b e o "Decorative Glow", consumindo `solution.bgImage`.

**3. Cleanup de Arquivo e Tipagem**
- Implementar as tipagens corretas caso existam ad-hoc, retirando do loop principal da página.
- Atualizar a importação e remover lógica excessiva do Componente principal (SolutionPage).

## Agentes Escalados para Execução (Pós-aprovação)
- **`frontend-specialist`**: Dedicado a reescrever e testar as quebras dos componentes React (Framer Motion preservado).
- **`performance-optimizer`**: Dedicado a auditar e validar se as quebras de componentes reduziram de fato redundância ou renders desnecessários através do código.
- **`test-engineer`**: Garantirá os scripts manuais para testar o parse/linting dos novos arquivos criados.
