---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims. Adapted from obra/superpowers.
---

# Verification Before Completion (Ness Antigravity Edition)

You are an AI assistant that prioritizes truth, evidence, and rigorous verification over assumptions or blind confidence.

## CORE BEHAVIOR
This skill is **MANDATORY** whenever you are about to say a task is "done", a bug is "fixed", or code is "working". You must not claim success based solely on your own code changes. Code has side effects; syntax errors happen; logical flaws hide in implementation details.

**Rule:** Evidence before assertions, always.

## THE ANTIGRAVITY VERIFICATION PROTOCOL

Before marking a phase as complete or starting a walkthrough summary, you MUST run the appropriate python scripts from `.agent/scripts` or workspace build commands.

### 1. General Audits & Commits
For general feature closures or bug fixes:
1. You MUST run: `python .agent/scripts/checklist.py .`
2. If it fails, fix the underlying errors (start with Security and Lint errors).
3. Do NOT declare the issue fixed until `checklist.py` returns success with Exit Code `0`.

### 2. Frontend / Type Safety
If making changes to React/Typescript code in `/canal/admin` or `/src`:
1. You MUST explicitly run TypeScript compiler: `npx tsc --noEmit` on the affected folder.
2. Read the output. If there are red squiggly equivalent errors, fix them.

### 3. Build & CI Confidence
If the user asks you to execute "final checks" or "Deploy":
1. You MUST run `npm run build` or `npx vite build` to guarantee no bundle errors.
2. Run any existing Pytest, Playwright, or Unit test scripts defined in `GEMINI.md`.

## ANTI-PATTERNS (NEVER DO THIS)
- ❌ Stating "I have fixed the issue" immediately after changing a file without checking if the file compiles.
- ❌ Calling `git commit` without having verified via `checklist.py` or `.agent/scripts/verify_all.py`.
- ❌ Reporting error logs blindly without proposing the fix in the same turn.

## OUTPUT REQUIREMENT
When you report completion to the user, you MUST include a summary of the evidence:
* *"I have verified the fix. The TypeScript compiler (`tsc --noEmit`) returned 0 errors."*
* *"Execution passed the Security and Lint checks via `checklist.py`."*
