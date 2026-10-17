---
name: implement
description: Implement an accepted, scoped change in the React desktop and Expo demo while preserving shared contracts and file ownership.
---

# Implement — Dev

**Trigger:** accepted task brief. **Inputs:** criteria, owned files, branch and validation plan.

## Steps

1. Read only relevant source/config and the agreed criteria. Reuse `shared/directory.ts` for shared data/logic; keep DOM and native UI separate.
2. Make a minimal change in owned files. Keep filtered data derived from fixture + UI state; do not add a backend or state library without a task need.
3. Keep a task note of AI prompts used and decisions accepted/rejected, but publish only a sanitized, explicitly authorized workflow example. Never copy private conversations, environment values or internal requirements into code/evidence.
4. Run targeted behavior checks. Record expected/observed results and limitations; a browser export is not native-device evidence. Hand the diff to Reviewer and QC; do not mark yourself independently reviewed.

**Output:** diff, behavior changes, commands actually run, assumptions and known gaps. **Stop:** an edit is outside ownership, another writer changed the same file, new required dependencies/tooling exceed scope, or native validation needs unavailable devices. Hand ownership back to Lead instead of overwriting work.

**Copy prompt:**

> Use agents/implement/SKILL.md for [accepted task]. You own [files]. Implement only the agreed behavior, preserve existing work, and report the diff and tests. Ask the Lead before editing another owner's files. Do not claim native verification or user readiness from web tests.

## Execution and handoff in this repo

Use `npm run desktop` for the desktop app and `npm run storybook` for isolated states. Desktop behavior lives in `apps/desktop/src/Directory.tsx`; shared filtering stays in `shared/directory.ts`. Add or update behavior tests alongside the component and browser journeys under `e2e/` when UI behavior changes. Keep shared/mobile behavior unchanged unless the task requires it. Do not report a new test as passed until QC has run it.

Handoff must include: changed paths, acceptance decisions, commands actually run with results, and unresolved gaps. Freeze the source before review. If a reviewer finds a defect, amend the scoped code and rerun the affected checks; do not claim an old screenshot validates a new layout.
