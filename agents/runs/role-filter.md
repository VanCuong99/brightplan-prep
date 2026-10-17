# Role filter — executed workflow

Implementation, independent review, QC and image inspection have run. Code commit: `e7febc1f697124054b938fc24fec461989c4f136`. At record-capture time, publishing the new evidence and remote image verification were pending. [The existing PR #1](https://github.com/VanCuong99/brightplan-prep/pull/1) is the post-push record, updated after those checks are observed. No new PR or shared-branch merge is part of this run.

## 1. Intake / explore / plan

Inspected the existing Directory component, its tests/stories, CSS, shared fixture, browser journeys, package scripts and current task branch. Chose desktop-only name AND role filtering; All roles preserves the name; Clear search preserves role. Planned accessible select, stable IDs, unique role options and narrow layout. Planned baseline, success, empty, clear-policy and narrow screenshots before edits.

## 2. Implement

Lead, Dev and QC were sequential roles of the implementing agent; one independent Reviewer handled read-only review. A single writer owned Directory.tsx/CSS/tests/stories, the role-filter browser journey, package script and workflow/evidence files. No second writer touched them. Mobile/shared behavior was unchanged.

Added selected-role UI state and derived visible data, a labeled native HTML select, unique role choices and responsive layout. Added combined-filter, clear-policy and duplicate-name/role tests. Added `npm run test:evidence` for repeatable real-browser captures. No backend or new library was introduced.

## 3. Independent review / QC

Reviewer inspected the frozen feature/workflow diff and all five screenshots, returning no findings in scope; independently reran 8 unit tests. QC also found a test typing mistake missed by runtime tests, corrected it and reran typecheck/tests. A rejected narrow full-page capture was replaced by a real visible-panel screenshot and the affected browser journey was rerun. These were actual corrections, not invented review failures.

Observed results: typecheck exit 0; 8 tests passed; desktop build exit 0; full browser suite 5 passed; final affected evidence journey 1 passed. [Evidence and safe logs](../evidence/role-filter.md) explain source snapshots, expected/observed states and limits. Skills/frontmatter, relative links, repo script names and formatting were checked before publication.

## 4. Evidence / commit / push / PR

Captured a real baseline before edits and four post-change states after assertions. Opened each PNG; images contain fictional UI data only. Recorded dimensions, SHA256 and source commits. Publish only allowlisted source/workflow/images/logs, scan the staged diff and outgoing history, push the existing task branch and update PR #1 with immutable embedded images. Verify the read-back PR body, remote image content and rendered image dimensions before reporting completion; the final PR records that post-push result. Never merge main implicitly.

## Reuse on the next real task

Read `AGENTS.md` and `agents/SKILL.md`, then the relevant stage skill. Supply task/criteria/owned paths/source snapshot and obtain diff → independent findings → command exits → inspected UI images → reviewable PR. This record shows the actual run; templates remain blank starting points and cannot be reused as PASS evidence for future changes.
