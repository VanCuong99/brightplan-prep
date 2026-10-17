---
name: qc-evidence
description: Run relevant repository checks and capture reproducible, redacted evidence tied to the source snapshot without claiming user readiness or native coverage.
---

# QC and evidence — QC

**Trigger:** a frozen reviewed change needs validation. **Inputs:** criteria, source snapshot, check plan and tool availability.

## Steps

1. Record commit plus dirty/clean status and changed paths; an uncommitted result needs a diff/artifact fingerprint. Evidence from a base commit may cover unchanged app code, but never present it as exact-head validation of later changes.
2. Select checks from the real scripts. Current commands: `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`. The last builds Storybook and exports RN web, then uses installed Chrome and local servers. `npm run check` combines the first three. No backend/lint script currently exists. For workflow-only edits, validate skill frontmatter, relative links and referenced scripts; reuse unchanged app evidence with its original scope/snapshot.
3. Capture each command's exit code separately; do not hide a failed command behind a successful last command. Compare expected with observed. A missing browser/device/network is `BLOCKED` or `NOT RUN`, not PASS. If a new check is required, run it; do not create tests that merely assert instruction wording.
4. Fill [the evidence template](../templates/evidence.md) from actual output. Keep raw logs/screenshots local by default; publish only redacted, reviewed artifacts explicitly in scope. Do not read `.env` values or log credentials. Reference artifacts only if they exist and say when they are local-only.
5. Reuse results for unchanged code, rerunning affected checks after fixes. Report residual gaps, including dependency audit findings when relevant; do not force major upgrades outside scope to make a report green.

**Output:** evidence record with command/exit code, snapshot, criteria, expected/observed, artifact references and gaps. **Stop:** required check fails/cannot run or evidence is stale for the changed behavior. Report the exact blocker; shipping stays pending until resolved or the user explicitly accepts the specific gap within platform rules.

**Copy prompt:**

> Use agents/qc-evidence/SKILL.md on [snapshot]. Run only checks needed for [criteria], capture real exit codes and expected/observed behavior, and fill an evidence record. Separate implementation validation, user readiness, RN web and native-device coverage. Never prefill PASS.
