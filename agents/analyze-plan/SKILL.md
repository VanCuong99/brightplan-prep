---
name: analyze-plan
description: Explore this repo and turn a requested change into acceptance criteria, file ownership and a minimal validation plan before implementation.
---

# Analyze and plan — Lead

**Trigger:** new behavior or a material scope change. **Inputs:** task, branch/status, relevant source/config and allowed destination.

## Steps

1. Read root guidance, `git status`, current branch and relevant files with `rg`. Preserve existing uncommitted work. Check package scripts and CI if present; do not invent lint/backend commands that do not exist.
2. Trace the current input → state → output path. Record ambiguities that affect behavior; resolve routine implementation choices within scope. Ask only for required missing decisions and continue independent exploration.
3. Write a short plan: acceptance criteria, touched files/owners, dependencies, meaningful edge cases, checks and publication allowlist. Separate core behavior from optional enhancement.
4. Create a task branch before implementation. When authorized, hand off disjoint work with one owner per file; reserve a frozen snapshot for review/QC.

**Output:** task brief, acceptance criteria, file ownership, validation commands and blockers. **Stop:** conflicting requirements, missing required permission or unclear destructive/production scope; do not invent user decisions or collect credentials.

**Copy prompt:**

> Use agents/analyze-plan/SKILL.md. Analyze [change] against the current code. Give acceptance criteria, ambiguous behavior, touched files with one owner each, and the smallest meaningful checks. Keep local interview documents out of publication. Do not implement optional features.
