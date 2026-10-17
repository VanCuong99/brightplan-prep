# Role-filter implementation and UI evidence

Code source: `e7febc1f697124054b938fc24fec461989c4f136`. Baseline UI: `5048b94bc2569fe91baf098fc7960f111f389e4f`. The capture/tested source matches this code commit; later workflow/evidence changes do not change app behavior. At evidence-capture time, public image URLs and remote fetch/render verification were still pending. [PR #1](https://github.com/VanCuong99/brightplan-prep/pull/1) is the post-push verification record; its body is updated only after those operations are observed.

## Actual QC

| Command                                           | Exit | Expected                                                                         | Observed                                                                                     |
| ------------------------------------------------- | ---- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run typecheck` — corrected run               | 0    | Both workspace checks succeed                                                    | Desktop and mobile TypeScript checks completed                                               |
| `npm test` — corrected run                        | 0    | Meaningful behavior tests succeed                                                | 3 files / 8 tests passed, including combined filter/clear/All roles and duplicate-role cases |
| `npm run build`                                   | 0    | Desktop production bundle builds                                                 | Vite build completed; product source unchanged afterward                                     |
| `npm run test:e2e`                                | 0    | Existing journeys plus role filter succeed                                       | 5 browser tests passed; desktop, simulated retry, RN web, Storybook and role filter          |
| `npm run test:evidence` — affected capture retest | 0    | Recapture the role-filter journey after changing only the narrow screenshot step | 1 browser test passed; Storybook build and RN web export also completed                      |

The full browser run preceded a narrow-screenshot-only test adjustment. The affected journey was rerun afterward; other unchanged browser journeys reuse their passing results. An initial `typecheck` exit 2 caught an unsupported Testing Library `exact` option in the new unit test; it was removed and typecheck/tests rerun successfully. The failed and corrected outputs are both preserved in [checks.log](role-filter/checks.log), with host paths redacted. No failed check is presented as passed.

## Real UI screenshots

Browser: installed Chrome through Playwright. Desktop viewport 1280×1100; narrow viewport 390×844. Screenshots are browser captures of fictional fixture data, not mockups or screenshots of logs. Each was opened and inspected; the independent Reviewer also inspected all five. PNG dimensions/hashes and source mapping are in [images.json](role-filter/images.json).

| State / reproduction                           | Expected                                  | Observed                                                | Image                                                        |
| ---------------------------------------------- | ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Baseline before feature                        | Five people; no role selector             | Five people and name search only                        | [Before](role-filter/before.png)                             |
| Name `SAM`, role `Mobile Engineer`             | Name AND role yields Sam only             | One result, Sam Rivera                                  | [Matched](role-filter/matched.png)                           |
| Name `Jamie`, role `Mobile Engineer`           | No person matches both                    | Zero results and empty state                            | [No match](role-filter/no-match.png)                         |
| Click Clear search while role selected         | Name clears; role stays selected          | Empty name, Mobile Engineer and Sam retained            | [Clear preserves role](role-filter/clear-preserves-role.png) |
| Name `Alex`, choose All roles, narrow viewport | Query remains; Alex visible; controls fit | Retained query, one Alex result, no horizontal overflow | [Narrow](role-filter/narrow.png)                             |

A full-page narrow capture initially repeated part of the header. QC rejected that capture and recaptured the actual visible panel viewport; the rejected image is not published.

## Review and limits

Independent read-only review found no findings in inspected code, tests, skills and five screenshots. The Reviewer independently ran `npm test`: 8 passed. Lead/Dev/QC were sequential roles of the implementing agent; the independent Reviewer was a separate worker. No extra workers or user practice sessions are invented.

RN native runtime/device remains **NOT VERIFIED**; RN web is only a web checkpoint. Screenshots do not prove native behavior or accessibility certification. User readiness was not assessed. Existing dependency audit findings are not fixed by this feature. No private planning documents, original conversations, internal requirements, credentials or unrelated artifacts are included. Main has not been merged. Remote image verification is performed after push and recorded in the read-back PR body, rather than claiming it occurred at capture time.
