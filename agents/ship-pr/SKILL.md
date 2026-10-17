---
name: ship-pr
description: Publish a reviewed and validated task branch to the authorized GitHub repository with an allowlisted history audit and evidence-backed PR; never merge shared main implicitly.
---

# Commit, push and create PR — Lead

**Trigger:** requested publication within the active task after review/QC. **Inputs:** authorized repo, task branch, reviewed diff, evidence and public file allowlist.

## Steps

1. Confirm branch/status, exact remote URL, remote history and existing PR state with the authenticated Git/GitHub session. Do not read token stores, print credentials or create tokens. Do not change repository visibility/security settings.
2. Require review findings resolved and relevant QC complete. Unavailable required checks are a blocker unless the user has explicitly accepted that specific gap. Never infer all checks pass from one exit code or a template.
3. Stage explicit allowed paths, not `git add .`. Existing local interview plans/guides stay local; the new `agents/` public workflow and root entry point are an explicitly requested exception. Scan staged blobs **and every outgoing ancestor commit** for excluded docs, personal/private context, credential patterns and generated artifacts. Do not print suspected secret values.
4. Commit the reviewed snapshot on a task branch, verify the tree equals the audited index and evidence still applies. Push that branch normally to the confirmed remote. No force push, history overwrite, destructive reset or shared-branch merge. If remote/history changed, inspect before deciding a safe next step; do not silently broaden scope.
5. Look for an existing PR from this exact branch to avoid duplication. Create or update one into `main` only when authorized, using [the concise PR template](../templates/pr.md). With `gh`, use a body file for multiline text. Verify branch SHA and PR URL/state/base/head after the mutation. If the client supports PR attachments, attach the created PR; otherwise return its verified URL.

**Output:** branch, commit SHA, PR URL, validation evidence, exclusions and remaining gaps. **Stop:** auth/permission denial, uncertain push/PR outcome, unexpected remote, leaks, unresolved review/QC or a requested merge/production/destructive action needing approval. On uncertainty inspect state before retrying. Finish at the reviewable PR; merge requires explicit approval.

**Copy prompt:**

> Use agents/ship-pr/SKILL.md. Publish [reviewed change] to [authorized repo] on [task branch] and create/update a PR into main after review/QC. Allowlist [paths], inspect the full outgoing history, keep private local docs untouched, verify the remote SHA and PR, and do not merge or force push.

## Required visual evidence in a UI PR

Before push, review the allowlisted image files and evidence record as public content. Commit safe UI evidence in the task branch or use an authorized repository attachment mechanism. Screenshots explicitly requested as evidence are the exception to excluding generated artifacts; build outputs, raw private logs and unrelated screenshots remain excluded.

For repository-hosted images, use an immutable link after push:

`https://raw.githubusercontent.com/OWNER/REPO/EVIDENCE_COMMIT/agents/evidence/TASK/IMAGE.png`

Fill OWNER/REPO from the verified authorized repository and EVIDENCE_COMMIT from the pushed SHA. Embed it as `![State — expected and observed behavior](image-url)` directly in the PR body; include source commit, inputs and results in the caption. Do not use local filesystem paths or merely claim the files are attached.

Update the existing PR by verified number using a body file (`gh pr edit ... --body-file ...`), rather than creating another PR. Then read the PR body back with `gh pr view`, confirm the expected image URLs are present, fetch every image and verify HTTP success, image MIME/signature and readable dimensions. Inspect the rendered PR/Markdown and open the resulting image to confirm it displays. If the GitHub client cannot show the full PR page, render the read-back body through GitHub's Markdown API and inspect that output in a browser, documenting this verification limit. Do not claim successful attachments from a local screenshot alone. Missing/broken/mismatched images block completion of a UI PR until fixed or an explicit, task-specific exception is approved.

Return the same PR URL with the pushed code/evidence SHAs, test results, images and gaps. Neither updating the PR nor passing tests authorizes merging it.
