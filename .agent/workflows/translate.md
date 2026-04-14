---
description: Run internationalization extraction and translation procedures.
---
# /translate - Translation Workflow

$ARGUMENTS

---

## Purpose
This workflow activates the translation processes to apply `i18n` patterns across the project, extracting hardcoded strings and populating locale files as dictated by the `i18n-localization` skill.

## Behavior
When `/translate` is triggered:
1. **Analyze Context**: Understand what component or folder needs to be translated.
2. **Setup i18n**: If not already present, ensure `react-i18next` and localization JSONs (`en`, `pt-BR`) are configured in `src/`.
3. **Extract Strings**: Replace raw text with `t('namespace.key')`.
4. **Populate Locales**: Add the precise keys and translations to the respective languages.

## Agent Collaboration
- Uses the `translator` agent.
- Prioritizes Portuguese (`pt-BR`) as fallback language.
