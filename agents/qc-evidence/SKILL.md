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

## UI capture and safe publication

For this directory, `npm run test:evidence` builds the prerequisites and runs `e2e/role-filter.spec.ts`; real Chrome screenshots are written to `test-results/role-filter/` after assertions. `npm run test:e2e` runs all browser journeys and includes these screenshots. Do not fabricate screenshots or use a terminal-log image as UI evidence.

1. Record the source commit (or base plus a source fingerprint while uncommitted). Capture baseline before changing the UI when useful; label its own source separately.
2. Assert expected visible behavior, then capture success, empty/edge and narrow states. Record viewport, browser, reproduction inputs, expected and observed result for each image.
3. Open every image and inspect it for correctness, legibility and private content. Do not screenshot private windows, credentials, notifications or real people/data. Recapture a safe view if necessary.
4. After user-authorized publication, copy only reviewed images to an explicit public path such as `agents/evidence/role-filter/`. Keep other `test-results/` artifacts ignored. Record image hashes and paths. Capture files must exist; never synthesize PASS or links.
5. After the source commit exists, verify the tested/captured files still match it. A later evidence-only commit may reference the earlier source commit when code is unchanged. Include actual command exit codes and safe logs.
6. Hand off the images and captions to the shipping skill. Until GitHub URLs are fetched and their rendering in the PR is checked, remote image verification is pending.

Native device testing remains a separate check with its actual environment. RN web images are explicitly labeled web checkpoints; they cannot satisfy native evidence.
