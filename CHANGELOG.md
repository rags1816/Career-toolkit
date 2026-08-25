# Changelog

All notable changes to Career Suite are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## v3.0 — 2026-08-25

Third major iteration milestone. Documentation/labeling checkpoint tagging
the app as v3.0 (git tag `v3.0`, alongside the existing
`v-student-experience-2026-08` tag) ahead of a new round of family testing
(Anil, daughter, and others). No functional changes beyond an in-app "v3.0"
version label next to the sidebar branding.

### Added
- "v3.0" version label in the sidebar, next to the Career Suite / AI Toolkit branding.
- PBMG / PROD / INOV glossary and a short "why evidence-based frameworks matter" note in `METHODOLOGY.md`.

---

## 2026-08-20

### Added
- Two equal-weight Candidate Profile entry paths — "Upload my CV" vs "I'm a student — build mine" — replacing the old dropzone-plus-text-link. (PR #7)
- Per-field "✨ Help me write this" AI-assist on all 10 Student Starter CV fields, with field-specific guiding questions and a single-level Undo. (PR #7)
- PDF export (jsPDF) alongside the existing Word export, for Personal Statement and every CV Tailor output. (PR #7)
- Personal Statement University Admission mode restructured into 3 independent sections (motivation / academic preparation / wider preparation), each with its own input, AI-generated draft, undo, and a live 350-character minimum counter; a combined 4000-character counter gates Copy/Word/PDF until every section qualifies. Generation prompt incorporates condensed Russell Group admissions guidance. Existing University-mode drafts are surfaced read-only in a "Previous draft" note instead of disappearing. (PR #7)
- Job Application Personal Statement mode now generates a short bulleted Executive Summary instead of a full essay, and is flagged optional for student-created profiles. (PR #7)
- Student CV summary/confirm screen: a student-sourced profile lands on a clean, properly-headed summary of the 10 fields they just entered (same underlying `user.cv`) instead of the baseline builder styled for a career professional. Includes Word/PDF downloads and a "Replace with edited version" re-upload option. (PR #8)
- Student-mode progressive nav unlock: Career Strategy, STAR Builder, CV Tailor, Decision Matrix, and Interview Coach start greyed out (visible, not hidden) for a student profile until the CV is confirmed and at least one University Personal Statement section passes 350 characters, at which point an explicit "✓ Yes, unlock tools" prompt offers the unlock — never silent, never automatic. Gated centrally in `switchTool()` so it can't be bypassed from the sidebar or the Home dashboard tiles. Non-student profiles are entirely unaffected. (PR #8)
- 🏠 Home sidebar nav entry — previously unreachable once you navigated away from the dashboard; never subject to student-mode locking. (PR #9)
- Brief shake/glow pulse on a locked-tool click, anchored on the clicked nav item and the matching Home dashboard tile, alongside the existing toast. Home dashboard tiles are now greyed for locked tools, matching the sidebar (previously only the sidebar showed the lock state). (PR #9)

### Fixed
- New installs now default to Secure Proxy mode with zero clicks; only applies when no `appSettings` has been saved yet. Fixed `isApiConfigured()` and `callSecureProxy()` to fall back to `DEFAULT_PROXY_URL` like the rest of the proxy code already did, and persisted the default to `localStorage` the moment no saved settings are found, instead of leaving it in memory only until Settings happened to be opened. (PR #7, PR #8)
- `updateApiStatusDot()` now routes its green/red decision through `isApiConfigured()` instead of a separate, looser proxy-URL check, so the status dot and the actual AI-call path can no longer disagree. (PR #8)
- `confirmDirectProfile()`: declining the "update existing profile?" prompt no longer falls through and creates a duplicate profile — it now aborts, matching what "no" should mean. (PR #8)
- Confirming a student's CV summary no longer permanently redirects to the professional baseline builder on every subsequent visit. The summary screen now has a proper confirmed (read-only CV, with Edit) vs unconfirmed (editable, with Confirm) state; Word/PDF downloads are visible in both. Editing and re-confirming is freely repeatable without affecting the tools-unlock state. (PR #9)
- `formatStudentCvSummary()` made idempotent — re-rendering the confirmed view was duplicating the CV's name heading (`# # Name`); found during end-to-end re-testing after the redirect fix above, since confirming now re-renders through this function repeatedly where it previously only ran once. (PR #9)

### Changed
- Personal Statement now defaults to "University Admission" (instead of "Job Application") the first time a student-sourced profile views the panel; sticky after that, and working-professional profiles are unaffected. (PR #9)

### Verified
- Full student journey — CV builder (with real AI-assist) → submit → confirm → navigate to Home → locked-tool click from both sidebar and Home tiles → Personal Statement (with real AI generation) → progressive unlock → re-visit Candidate Profile → edit/re-confirm → full page reload → second, separate non-student profile — re-tested end-to-end against the live deployed site (`rags1816.github.io/Career-toolkit`) with real AI (not Mock mode, not a local dev server), including downloading and opening the exported Word/PDF CVs, before freezing this checkpoint as `v-student-experience-2026-08`.

---

## 2026-08-13

### Fixed
- Interview Coach: mic status label no longer lies when `recognition.start()` silently fails or the browser has no STT support — shows "Starting mic...", then either the real listening state or an honest failure message.
- Interview Coach: Send button now gives visible feedback (red border flash + hint) instead of silently no-op'ing when the input is empty.
- Interview Coach: TTS cleanup extended to stop reading "/" and "&" literally, and to strip stray bullet/separator hyphens, without touching real hyphenated words.
- Interview Coach: the AI now actually introduces itself as Ms. Evelyn / Mr. Arthur (reading the selected avatar) instead of the UI showing a persona name the AI never uses.
- Interview Coach: stalls and non-answers are now recognized and the question is repeated or rephrased instead of silently advancing; the parse-failure fallback message is honest about what happened instead of pretending an answer was scored.

### Changed
- `downloadAsWordDoc()` now uses the app's brand color for headings, a colored title-bar rule, and a byline/subtitle line instead of plain black-on-white text — verified against an actual generated `.docx` (not just the source HTML) that the styling survives `html-docx-js` conversion.

### Added
- Floating AI reference guide: a persistent chat widget (bottom-right, above every other fixed element) answering "what does this do / where do I find X", using the app's real structure as its system prompt; works in both Live and Mock mode. Context-aware of the current screen via the `activeTool` global, re-read on every message so navigating while the panel stays open re-scopes both AI answers and the Mock-mode fallback. Hidden while the PIN lock/setup screens are up. (PR #6)

---

## 2026-08-12

### Fixed
- Legacy binary `.doc` (OLE/CFB signature) files are now detected before being handed to `mammoth`, showing a clear message instead of crashing.
- `copyText()` now reads `.value` for textarea/input elements instead of the always-empty `innerText`.
- Decision Matrix no longer computes or renders a winner when criteria weights don't total 100%.
- Native `<option>` elements now get an explicit dark background so they're readable without hovering.
- Interview Coach uses continuous recognition plus a 4s custom silence timer instead of stopping on the browser's first pause; added a manual "Done answering" fallback.
- Profile creation no longer auto-fires SWOT/baseline analysis when no AI connection is configured; shows a toast linking to API Key Settings instead of a raw AI error.

### Added
- Real Word (`.docx`) exports via `html-docx-js` and a shared `downloadAsWordDoc()` helper. Personal Statement download now produces a real `.docx` instead of `.md`; added Download buttons next to Copy for CV Tailor's Tailored Profile, Cover Letter, CV Achievements, and Tailored STAR.
- Local-only 4-digit PIN lock screen (hashed with the existing `sha256Hex` helper) to keep localStorage data private on shared family devices — first-run setup prompt (skippable), blocking lock screen, Forgot PIN reset (clears only the PIN, not user data), and a Change PIN entry point in the sidebar, fully independent of the existing Admin Panel passphrase. (PR #5)

---

## 2026-08-11

### Added
- UX hint in the Student Starter CV modal, visible above the first input field, advising students that filling in more sections produces more specific SWOT, STAR, and Personal Statement output, and pointing to Subjects & Grades and Positions of Responsibility as the best starting sections when short on time. (PR #4)

---

## 2026-08-09

### Fixed
- Baseline Documents generation was being truncated because all three documents were requested in a single AI call that exceeded the model's output limit. Split into three separate sequential calls (one per document) to guarantee full-length output. (PR #3)

### Restored
- Secure Proxy mode and the Admin Panel had been lost from `index.html` in a prior manual upload. Both are restored; the Cloudflare Worker proxy URL is pre-configured for authorised users. (PR #2)

---

## 2026-07-21

### Changed
- Reorganised repository: moved `walkthrough.docx`, student starter kit, user reference guide, and STAR template into `docs/`. Root now contains only the live app and documentation-standard files. (PR #1)
- Rewrote `README.md` with current feature list, tech stack, how-to-run instructions, and standard Development Note and Related sections.

---

## 2026-06-14 — Initial release

Career Suite launched as a single-file HTML/CSS/JS application covering:
- **Candidate Profile** — CV upload (PDF/DOCX/XLSX/text paste) with automatic name parsing
- **Student Starter CV** — ten-section form for candidates without work experience, generating a structured profile that unlocks all downstream tools
- **Career Strategy (SWOT)** — AI-generated Strengths, Weaknesses, Opportunities, Threats, and "Why select you" from the candidate profile
- **STAR Bank** — generate and save competency-based STAR responses, with a personal bank persisted in localStorage
- **Personal Statement** — Job Application and University Admission types, guided by three open questions and the candidate profile
- **CV Tailor** — adapts the base CV to a specific job description
- **Baseline Documents** — CV, cover letter, and LinkedIn summary generated from the profile
- API support for Google Gemini, Anthropic Claude, and Secure Proxy (Cloudflare Worker) modes
