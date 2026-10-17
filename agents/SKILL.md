---
name: brightplan-workflow
description: Coordinate scoped changes in this demo repository from exploration through review, test evidence and a task-branch PR. Use when implementing or publishing a repo change.
---

# Workflow entry point

**Trigger:** a scoped repository task. **Input:** requested behavior, allowed scope/destination, constraints and existing work. **Owner:** Lead.

## Load explicitly

`agents/` is a repo directory, **not a claim of automatic discovery, installation or worker spawning**. In a tool that can read repository files, paste:

> Read AGENTS.md and agents/SKILL.md. Use agents/analyze-plan/SKILL.md for this request: [task]. State the scope and next action, then proceed within the current authorization.

For a specific stage, name its exact `SKILL.md` path. A `$skill-name` shortcut only works if that tool has actually registered the skill; none are installed by this repository. Do not silently add global configuration or third-party skills.

## Steps and handoffs

1. [Analyze and plan](analyze-plan/SKILL.md) — Lead checks the repo and writes acceptance criteria, file ownership and validation scope.
2. [Implement](implement/SKILL.md) — Dev makes the minimal change on a task branch and records assumptions/AI decisions.
3. [Independent review](review/SKILL.md) — Reviewer checks the frozen diff against the request; returns actionable findings, no edits by default.
4. [QC and evidence](qc-evidence/SKILL.md) — QC runs relevant checks and captures expected/observed results at a source snapshot.
5. [Commit, push and PR](ship-pr/SKILL.md) — Lead verifies evidence, publication scope and history, then ships the task branch. Do not merge shared main.

## Roles and parallel work

| Role     | Owns                                                | Handoff                                          |
| -------- | --------------------------------------------------- | ------------------------------------------------ |
| Lead     | scope, acceptance, ownership, integration, shipping | one task brief and final evidence/PR             |
| Dev      | assigned source files                               | changed behavior, diff, checks and known gaps    |
| Reviewer | independent read-only review                        | findings with location, impact and reproduction  |
| QC       | validation/evidence                                 | command, exit code, expected/observed and limits |

Delegate only if the user/task/tool instructions authorize workers and the tool supports them. Parallelize independent exploration or disjoint file ownership; never assign two writers the same file. Review/QC use a frozen snapshot, not a moving target. A solo agent labels sequential self-review honestly; if independent review is required but unavailable, record that gate as pending and stop shipping until resolved. Sending messages to other chats/services requires separate authorization.

## Output and stop conditions

Output the scoped change, review/QC result, evidence location, commit/branch and PR if shipped. Stop the affected operation on missing required authorization, denied permissions, uncertain mutation outcome, unresolved correctness findings or required checks that cannot run. Continue independent work. On uncertainty, inspect state before any retry; no duplicate push/PR creation. Reuse passing evidence when the source/checks are unchanged; fix findings once, rerun only affected checks, and escalate persistent blockers rather than looping.

[Role-filter walkthrough](examples/role-filter.md) is a **template, not executed**. [Evidence template](templates/evidence.md) and [PR template](templates/pr.md) start unfilled. Actual scoped validation is recorded separately in [validation evidence](evidence/validation.md).
