# Complete Translation Sweep (Varredura Completa de Traduções)

## Overview
The user requested a complete sweep across all pages and all supported languages to identify missing translations or hardcoded visible texts, and to resolve them. This ensures full internationalization (i18n) compliance across the application.

## Project Type
WEB

## Success Criteria
- [ ] No hardcoded visible texts remain in any `.tsx` or UI files.
- [ ] All keys present in `src/i18n.ts` are translated across all supported languages (PT, EN, ES, etc.).
- [ ] Fallback mechanisms are working properly.
- [ ] UI doesn't break due to missing translation keys.

## Tech Stack
- Frontend: React / Next.js / Vite (React context based on `.tsx`)
- i18n Library: `react-i18next` and `src/i18n.ts`

## File Structure
- `src/pages/**/*.tsx`
- `src/components/**/*.tsx`
- `src/i18n.ts`

## Task Breakdown

### Task 1: Audit Hardcoded Strings
- **Agent**: `frontend-specialist`
- **Skill**: `i18n-localization`
- **Goal**: Scan all `.tsx` components and pages to find strings that are not using the `t()` function.
- **INPUT**: Codebase `.tsx` files.
- **OUTPUT**: A checklist of files with hardcoded strings.
- **VERIFY**: Search for specific text nodes outside of `{t("...")}` elements.

### Task 2: Standardize & Extract Keys
- **Agent**: `frontend-specialist`
- **Skill**: `i18n-localization`
- **Goal**: Replace found hardcoded strings with structured keys (e.g., `brand.page.section.title`).
- **INPUT**: Checklist from Task 1.
- **OUTPUT**: Modified `.tsx` files using translation keys.
- **VERIFY**: Run `npm run lint` and `npm run build` to ensure no syntax errors were introduced.

### Task 3: Audit Translation File (src/i18n.ts)
- **Agent**: `orchestrator` / `content-strategy`
- **Skill**: `i18n-localization`
- **Goal**: Extract missing keys per language. If PT has 1500 keys and ES has 1200, find the 300 missing keys in ES.
- **INPUT**: `src/i18n.ts`
- **OUTPUT**: List of missing translations per language.
- **VERIFY**: Complete intersection check of keys across all locales.

### Task 4: Translate and Update Dictionaries
- **Agent**: `orchestrator`
- **Skill**: `i18n-localization`
- **Goal**: Provide correct translations for all missing keys across all languages (EN, ES, PT, etc.) and save into `src/i18n.ts`.
- **INPUT**: Missing key lists.
- **OUTPUT**: Updated and synchronized `src/i18n.ts`.
- **VERIFY**: Test language switching in the development server to ensure texts appear correctly.

### Task 5: Publish CMS Content in Production
- **Agent**: `backend-specialist`
- **Skill**: `database-design` / `cloudflare`
- **Goal**: Update the `entries` table in the D1 production database (`canal-db`) to ensure all posts (`collectionId = 'posts'`) and cases/portfolios (`collectionId = 'cases'` or similar) have their `status` set to "published".
- **INPUT**: Production D1 Database.
- **OUTPUT**: Execute `wrangler d1 execute canal-db --remote --command="UPDATE entries SET status = 'published' WHERE collectionId IN ('posts', 'cases', 'portfolios');"`
- **VERIFY**: Check the frontend production or run a SELECT to confirm status changes.

## Phase X: Verification
- [ ] **Lint Check**: Run `npm run lint && npx tsc --noEmit`
- [ ] **Build Check**: Run `npm run build`
- [ ] **Runtime Check**: `npm run dev` + visual check switching between languages on complex pages (e.g., Forense, Home, Services).
- [ ] **Compliance Check**: Socratic Gate respected, NO purple/violet hex codes used, NO template layouts.

## Open Questions for the User (Socratic Gate)
1. Are there any specific pages that you already know have missing translations so I can prioritize them?
2. Do you use an external translation service/auto-translator or should I manually translate everything based on the context to EN and ES?
3. Are there dynamic texts coming from APIs (like CMS or DB) that I should be aware of, or are we only focusing on static frontend texts?
