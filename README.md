# Career Toolkit

A set of tools supporting structured, evidence-based career development and
job application work — built from methodology developed while producing
senior procurement/product management applications (Home Office, Ministry of
Justice, Monzo, and general procurement director roles), and shared for
family use (e.g. a student building their first CV and personal statement)
without requiring each user to manage their own AI API key.

## What it does

- Helps structure job applications around evidence-based competency criteria
  (e.g. PBMG, PROD, INOV-style frameworks) rather than generic claims
- Draws on a structured career evidence bank to match the right evidence to
  the right criterion
- Provides eight tools in total: Candidate Profile, Career Strategy & SWOT,
  STAR Builder, CV Tailor & Letters, Personal Statement, Decision Matrix,
  and Interview & Sales Coach, alongside the Candidate Profile entry point
- Exports Personal Statement and CV Tailor outputs as properly formatted
  Word (.docx) and PDF documents — not plain text
- A floating, screen-aware AI reference guide (bottom-right chat widget,
  available on every screen) answers "what do I do here?" contextually,
  separate from the static walkthrough document in `docs/`
- A local 4-digit PIN lock screen keeps a shared family device private —
  first-run setup (skippable), a lock screen on return visits, and a
  Change/Forgot PIN option that never touches saved profiles or CVs. This
  is separate from the Admin Panel's own passphrase, which controls the
  proxy/family-access settings rather than general app viewing.

## Two ways to start

- **Upload my CV** — for anyone with an existing CV (PDF, Word, or plain
  text), unlocking every tool immediately
- **I'm a student — build mine** — a guided, question-by-question builder
  for someone with no formal CV yet (school subjects, positions of
  responsibility, extracurriculars, and more), with an AI-assist "help me
  write this" option on every field and one-step undo. This produces a
  clean, professional CV summary — downloadable as Word or PDF, editable,
  and replaceable later with an edited version — rather than the same
  professional CV-management view a working applicant sees.

  Student profiles start with Career Strategy, STAR Builder, CV Tailor,
  Decision Matrix, and Interview Coach greyed out, with an explanation of
  why. Once the CV is confirmed and a Personal Statement is drafted, an
  explicit prompt offers to unlock the rest — framed as tools for planning
  a career forward once the essentials are done, not a hidden requirement.

## Status

Live — actively used for real job applications and shared with family
members for their own CV/application work.

## Tech stack

Single `index.html` front end. AI features are proxied through a Cloudflare
Worker (`worker.js`) acting as a lightweight backend — the Worker holds the
API key server-side, so anyone using the toolkit (e.g. a student family
member) never needs to obtain, enter, or manage their own API key. This is a
deliberate design choice: it keeps the tool genuinely easy to hand off to a
non-technical user while keeping the key itself out of the client entirely.

## How to run

Open `index.html` in a browser — no install, no account. On first load, AI
is already connected through the shared Secure Proxy by default — there's
nothing to configure. A Sandbox/Mock mode is also available with zero AI
setup at all, useful for exploring every tool before connecting real AI. If
you'd rather use your own Anthropic or Gemini API key instead of the shared
proxy, that's available too under ⚙️ API Key Settings.

## Related

See `METHODOLOGY.md` for the evidence-mapping framework this tool applies,
and `docs/` for the student starter kit, user reference guide, and feature
walkthrough (a static document — for interactive, contextual help while
using the app, use the floating chat guide in the bottom-right corner of
any screen instead).

## Development note

Development assisted by Claude Code (Anthropic) under my direction. The
methodology, product design, and domain expertise reflected in this tool
are my own — see `METHODOLOGY.md` for the original framework..
