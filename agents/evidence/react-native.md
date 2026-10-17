# React Native Android validation

Status: **PASS for the scoped Android native checks on 17 October 2026**. Eight checks passed; original system settings were restored and read back before final PASS. Published source commit: `a4f91b8d7cd503ee10258e812549fb208eba5785`. Every file in the run manifest was verified byte-for-byte against that commit before evidence publication.

The fixed directory puts its header, controls, rows and runtime footer in one scrollable FlatList. Previously, the fixed header consumed the landscape viewport and prevented reaching rows. Name filtering and the shared fixture remain unchanged; no mobile role filter or navigation was added.

Environment: Android Emulator 37.2.12.0; Android 16 / API 36, arm64-v8a, generic Pixel 7 AVD, 1080×2400 physical pixels, density 420, 411 dp portrait width. Expo SDK 55 / React Native 0.83.10 / React 19.2.0 in Expo Go 55.0.7 (versionCode 419). Landscape is 2400×1080. Large-font check uses font scale 1.3.

Reproduction: start the project's Metro server on localhost port 8083, keep the authorized emulator running, then run `npm run test:android:native` with `ADB` pointing to Android platform-tools when needed. Output is ignored `native-test-results/android-native/`, separate from Playwright output. See the [native procedure](../qc-evidence/SKILL.md#android-native-smoke-procedure).

Source provenance: the script verifies Metro, reverses port 8083, relaunches the project URI in Expo Go, observes `Runtime: android` and `native-scroll-v1`, and checks local source hashes before/after interactions. The marker labels this layout revision, not arbitrary future source. The final run manifest records launch URI, client package, hashes and base commit; published source mapping is verified separately.

## Limits and earlier failures

Expo Go on an emulator is actual Android React Native execution, not a standalone release, physical-device or iOS run. Component tests use mocked native modules; browser tests and Hermes exports are separate evidence. iOS remains unverified: no simulator runtime/device was available and installed Xcode 26.1.1 is below the Expo 55 reference's 26.2+ requirement. No Xcode upgrade was performed.

Fresh-AVD cold boot initially showed a System UI ANR and later an unrelated stock Messages ANR; those dialogs were handled before the final app run. Early automation tapped the visible Text label instead of the input and an earlier native output directory was cleared by Playwright. The script now prefers accessibility labels on controls and stores native artifacts separately. Independent review also required actual orientation/font checks, keyboard dismissal assertions, runtime source provenance and restoring/read-backing settings before PASS. These were fixed; early partial runs are not the final acceptance evidence.

No user-readiness or accessibility certification is claimed. Navigation and role filtering are not features of this mobile demo. Existing dependency audit findings remain; dependency upgrades are outside this native-verification change.

## Observed checks

| Command                       | Observed result                                                           | Scope                                        |
| ----------------------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| `npm run check`               | Exit 0; typechecks, 8 Vitest tests, 6 Jest RN tests, desktop build passed | Implementation and mocked-component behavior |
| `npm run test:e2e`            | Exit 0; 5 tests passed, including RN web checkpoint                       | Browser regression, not native proof         |
| `npm run test:android:native` | Exit 0; 8 native checks and settings restoration passed                   | Android Expo Go on this emulator             |

The repository has no configured CI workflow or lint/backend command; checks above follow the actual package scripts. Full redacted [implementation log](android-native/check.log), [browser log](android-native/browser.log), [native log](android-native/native.log) and [native run manifest](android-native/results.json) are preserved. Failed exploratory runs are described above rather than represented as PASS. Source files stayed unchanged during the final native run.

| Native check                 | Expected                                                                       | Observed                                                             | Actual capture                                                      |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| initial native screen        | Five people and Android native input                                           | 5 people found; native EditText present; no WebView in app hierarchy | [initial.png](android-native/initial.png)                           |
| name filter with keyboard    | SaM matches Sam with software keyboard open                                    | Sam Rivera; 1 person found; input-method state shows keyboard        | [filtered-keyboard.png](android-native/filtered-keyboard.png)       |
| clear with keyboard open     | Clear remains usable and restores five people                                  | 5 people found after native tap                                      | [cleared-keyboard.png](android-native/cleared-keyboard.png)         |
| empty state                  | Unknown name produces zero matches                                             | No people found and 0 people found                                   | [empty-keyboard.png](android-native/empty-keyboard.png)             |
| dismiss keyboard and restore | Five people after clear and keyboard dismissal                                 | 5 people found on native screen                                      | [restored.png](android-native/restored.png)                         |
| portrait list scrolling      | Last person and role are reachable                                             | Jordan Lee and Engineering Manager visible after native swipe        | [scrolled-last-person.png](android-native/scrolled-last-person.png) |
| landscape layout             | Search/clear and all rows remain reachable via scrolling                       | Native landscape controls reached; final person role visible         | [landscape.png](android-native/landscape.png)                       |
| font scale 1.3               | Controls and last row reachable at font scale 1.3; clipping reviewed in images | Search/clear reached and final role visible at font scale 1.3        | [large-font.png](android-native/large-font.png)                     |

## Before and image review

[Before landscape](android-native/before-landscape.png) was captured on the native app source from `568ec15d61d895047e6a764da57018c5aae8b935`: the fixed header filled the viewport and rows were inaccessible. This is a pre-fix defect image, not a passing result.

Post-fix captures are native Android screencaps following assertions. The author opened all nine images and checked legibility, expected inputs/counts, software keyboard state, reachable final row in portrait/landscape/large-font, and fixture-only content. Scrolled images intentionally place the heading outside the current viewport. Keyboard-open images show a reduced viewport; the runtime footer may be partly below it. This does not claim every row/control is visible simultaneously, all devices are covered, or accessibility is certified. The Expo Go tools overlay belongs to the development client.

Independent code review found three validation weaknesses, all corrected and focused re-reviewed without new findings. Independent visual review opened all nine PNGs, checked the final manifest and source hashes, and found no findings in the inspected scope. Image hashes/dimensions and source mappings are recorded in [images.json](android-native/images.json).
