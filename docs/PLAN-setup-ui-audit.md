# Plan: Setup Environment & UI Audit

## Overview
This plan outlines the execution of **Option A** (Local Setup & Backend Validation) and **Option B** (UI/UX Audit & Refinement) for the "ness. Institutional Website". The goal is to fully setup the local environment, test backend specific API routes (especially the Generative AI integrations via Gabi.OS), and conduct a thorough analysis of UI aesthetics, animations, and typography conventions.   

## Project Type
**WEB** - React 19, React Router 7, Vite 6, Tailwind CSS 4, Framer Motion, and Hono.

## Success Criteria
1. `npm install` and `npm run dev` complete seamlessly without dependency issues.
2. The Gabi.OS AI proxy is successfully authenticated using `.env` configurations.
3. Dark Mode is fully enforced without Violet/Purple colors, conforming to the "precision engineering" brand aesthetics.
4. `tsc --noEmit` and `npm run lint` show 0 errors or warnings.
5. All verification scripts in Phase X pass validation.

## Tech Stack
- **Frontend Core**: React 19, React Router 7 (`@react-router/node`), Vite 6
- **Styling & Animation**: Tailwind CSS v4, Framer Motion (`motion`)
- **Backend (SSR / Proxy)**: Node.js, Express, Hono
- **AI & Integrations**: `@google/genai`
- **Typing & Validation**: TypeScript, Eslint

## File Structure
```
ness-site2026/
├── package.json         # Dependency resolution
├── server.ts            # SSR and Backend API endpoints
├── docs/                # Planning files
├── .env                 # Environment variables file
└── src/                 # Main frontend application code
```

## Task Breakdown

### Task 1: Environment Diagnostics & Setup
- **Agent**: `devops-engineer`
- **Skill**: `bash-linux`, `nodejs-best-practices`
- **Details**: Execute initial setup commands (`npm install`) to prepare local dependencies. Copy `.env.example` into a local `.env` file and prepare the Google Generative AI API key.
- **Verification**: `node -v` shows compatible version (v18+) and running `npm run dev` serves the application without immediate compilation errors.

### Task 2: Backend Stability & Gabi.OS API Validation
- **Agent**: `backend-specialist`
- **Skill**: `api-patterns`
- **Details**: Test functionality of the routes declared in `server.ts` (`/api/insights`, `/api/jobs`, `/api/submit-form`, and `/api/chat`). Ensure that `@google/genai` instances map securely and handle error boundaries properly (graceful fallback).
- **Verification**: Calling `POST /api/chat` correctly resolves a generative AI completion/stream response via backend proxy.

### Task 3: Comprehensive Frontend Audit (Typing & Accessibility)
- **Agent**: `frontend-specialist`
- **Skill**: `clean-code`, `frontend-design`
- **Details**: Execute `npx tsc --noEmit` and code analysis. Resolve any strict generic type checking.
- **Verification**: `npm run lint` finishes successfully and the repository is proven to be strictly typed.

### Task 4: Immersive UI/UX & Design Audit
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`, `web-design-guidelines`
- **Details**: Perform thorough validation of Tailwind CSS v4 usage and framer motion states in `src/`. Ensure the absolute absence of standard template layouts and "purple/violet/generic" accents in the UI tokens.
- **Verification**: Manual UI visualization confirms visual intent, responsive scale, and precise micro-animations (Lighthouse layout shift ~0%). Run `ux_audit.py` if available to enforce standard UI guidelines.

---

## ✅ PHASE X COMPLETE (Pending Execution)
- Lint: [ ] Pending
- Security: [ ] Pending
- Build: [ ] Pending
- Date: [TBD]
