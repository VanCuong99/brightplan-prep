---
name: review
description: Independently review a frozen task diff for correctness, scope, tests and publication leaks before QC and shipping.
---

# Independent review — Reviewer

**Trigger:** implementation ready for review. **Inputs:** user-facing request, criteria, base/head or frozen diff and allowed public paths. No author's suspected answer is needed.

## Steps

1. Inspect the actual diff and relevant callers. Check behavior, state ownership, mutation, accessibility, platform boundaries and tests appropriate to the change.
2. Compare source and documentation claims against evidence. For workflow-only changes, dry-run a realistic request and check path/command correctness, authorization gates and stale/false PASS risks; no app feature is needed to test a workflow.
3. Check the publication allowlist and look for private context or secrets without echoing sensitive values. Inspect commit ancestry when publishing; a clean final tree does not remove sensitive ancestor content.
4. Return findings with file/location, concrete failure/reproduction, impact and suggested correction. If none, state the inspected scope and limits. Do not modify Dev's files unless explicitly assigned ownership.

**Output:** `findings`, `no findings in inspected scope`, or `blocked`, with limits. **Stop:** snapshot changes during review, missing criteria or forbidden resource access. A finding returns once to Dev, followed by focused re-review; persistent blockers go to Lead, not an endless review loop.

**Copy prompt:**

> Use agents/review/SKILL.md. Independently review this frozen diff: [base/head or paths] for [request and criteria]. Do not edit or ship. Report reproducible findings and coverage limits. Check that public workflow claims cannot turn pending checks into PASS or bypass platform permissions.
