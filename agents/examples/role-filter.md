# Worked walkthrough: role filter — TEMPLATE, NOT EXECUTED

This is a concrete prompt chain for future practice, not evidence of a completed feature or successful review. The current app has a name filter; this workflow change does **not** implement role filtering. All example checks below remain NOT RUN for that feature. App validation in [the real evidence record](../evidence/validation.md) covers the existing code only.

## Task brief and acceptance — proposed

Add a role dropdown to the desktop directory only. Match name AND selected role. “All roles” removes only the role restriction. “Clear search” clears the name and preserves the role. Existing mobile behavior stays unchanged. These are example task decisions, not assessment requirements.

Expected test cases: name+role match; mismatch gives empty state; clear preserves role; All roles restores name-only behavior; duplicate names keep stable IDs. Derive the visible list instead of adding a second filtered-data state. Keep the dropdown accessible by label and keyboard.

## Prompt chain

1. **Lead — explore/plan:**
   > Read AGENTS.md, agents/SKILL.md and agents/analyze-plan/SKILL.md. Plan the desktop role-filter task above. Inspect Directory and its tests, identify edge cases, and assign one writer per file. Do not implement yet or touch mobile code.
2. **Dev — scoped implementation:**
   > Use agents/implement/SKILL.md. After the plan is accepted, own apps/desktop/src/Directory.tsx, Directory.test.tsx and Directory.stories.tsx. Add the proposed role dropdown with local UI state and derived results. Do not edit shared/mobile code unless the Lead approves a changed ownership plan. Record tests actually run and unresolved assumptions.
3. **Reviewer — independent:**
   > Use agents/review/SKILL.md. Review the frozen role-filter diff against the brief above. Do not edit. Check clear preserving role, combined filters, stable IDs, accessible controls, and whether the test would catch the old failure. Return findings and limits.
4. **QC — tests/evidence:**
   > Use agents/qc-evidence/SKILL.md. Validate the role-filter snapshot, record command exit codes and expected/observed edge cases. Use the evidence template without prefilled PASS. Run browser checks appropriate to the changed desktop UI; do not claim native or user-readiness coverage.
5. **Lead — ship only after gates:**
   > Use agents/ship-pr/SKILL.md within this task's publication authorization. Stage only the reviewed role-filter files and sanitized evidence explicitly approved for publication, inspect outgoing history, push a task branch and create a PR into main. Do not merge, force push or include local interview guides.

## Ownership and honest handoff

Dev alone writes the listed files. Reviewer reads a frozen snapshot. QC can run existing checks in parallel with read-only review once implementation is frozen; if it must change tests, assign those files explicitly and re-review the new snapshot. If workers are unavailable, label self-review and leave an independent-review gate pending when required.

For Loom: show the accepted task → small diff → one test catching a defect → verification → PR evidence. If a step has not occurred, show the template label rather than narrating it as completed. Stop after a reviewable PR, pending user merge approval.
