---
name: executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints. Adapted from obra/superpowers.
---

# Executing Plans (Ness Antigravity Edition)

## CORE BEHAVIOR
This skill is **MANDATORY** whenever you are executing an implementation plan (usually named `PLAN-*.md` or `task.md` inside the `brain` directory) that contains checklist items.

Your job is to strictly follow the pre-approved plan. You are the Executor. You do not re-plan. You do not stray out of scope. You systematically burn down the task list.

## THE ANTIGRAVITY EXECUTION PROTOCOL

When executing an existing plan:

1. **Locate the Plan:** First, `view_file` on the corresponding `PLAN-*.md` or `task.md`.
2. **State Your Current Focus:** Inform the user exactly which checklist item you are tackling.
3. **Mark Progress (The Checkbox Rule):** 
   - As soon as you begin an item, use the `replace_file_content` tool to update the plan list from `[ ]` to `[/]` (In Progress).
   - Once completed and **verified** (via `verification-before-completion`), update it to `[x]` (Completed).
4. **Follow PREVC constraints:** Ensure that your execution phase moves cleanly through Execution (E) and Verification (V) before Completion (C). 
5. **No Blind Deviations:** If an implementation step in the plan proves technically impossible or breaks existing architecture, STOP. Halt execution and request user feedback (`Socratic Gate`) before deciding on an alternate path.

## CHECKPOINTS & USER COMMUNICATION
- Do not execute 15 files at once silently. Batch your work according to logical milestones.
- Update the `task.md` checkmarks continuously.
- Provide concise, github-flavored markdown updates to the user whenever a major section is completed.

## ANTI-PATTERNS (NEVER DO THIS)
- ❌ Reading a multi-step plan and skipping steps 2 and 3 because you "think step 4 is all that matters".
- ❌ Finishing code changes but leaving the `task.md` un-checked.
- ❌ Creating new architectural decisions during the execution phase without consulting the user.
