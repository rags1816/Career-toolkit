# Career Toolkit

A set of tools supporting structured, evidence-based career development and
job application work — built from methodology developed while producing
senior procurement/product management applications (Home Office, Ministry of
Justice, Monzo, and general procurement director roles), and shared for
family use (e.g. a student CV/application starter kit) without requiring
each user to manage their own AI API key.

## What it does

- Helps structure job applications around evidence-based competency criteria
  (e.g. PBMG, PROD, INOV-style frameworks) rather than generic claims
- Draws on a structured career evidence bank to match the right evidence to
  the right criterion
- Settings/PIN-protected controls, with mobile-friendly scrolling and sync
  support (see `docs/walkthrough.docx` for the full feature history)
- A dedicated Student Starter Kit mode/guide for simpler, guided use by
  someone earlier in their career

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

Open `index.html` in a browser — no install, no account. AI features require
the Cloudflare Worker to be deployed and reachable; see `worker.js` for the
Worker's own setup requirements.

## Related

See `METHODOLOGY.md` for the evidence-mapping framework this tool applies,
and `docs/` for the student starter kit, user reference guide, and feature
walkthrough.

## Development note

Development assisted by Claude Code (Anthropic) under my direction. The
methodology, product design, and domain expertise reflected in this tool
are my own — see `METHODOLOGY.md` for the original framework.
