# CLAUDE.md

Persistent context for Claude Code sessions in this repo. Read this before
starting work.

## Who this repo belongs to

Owned by Vijay L Narasimhan (GitHub: rags1816). Part of a wider portfolio
of applied tools — see the hub page at https://rags1816.github.io for the
full list. Each repo is independent but follows the same conventions below
for consistency across the portfolio.

## Repo structure convention

- **Root** — only the live app file(s) (e.g. `index.html`), `README.md`,
  `METHODOLOGY.md`, `LICENSE`, `.gitignore`, `CHANGELOG.md` (if the repo
  tracks one). Keep root clean; nothing else belongs there.
- **`docs/`** — user guides, admin guides, reference guides, and any
  supporting documentation not needed to run the app.
- **`archive/`** — superseded versions, old HTML/app snapshots, deprecated
  scripts. Kept for history, not deleted, unless confirmed genuinely
  redundant (e.g. a byte-identical duplicate).
- **`tools/`** — utility/build scripts still actively used, if any (keep
  separate from `archive/`, which is for scripts no longer used).

## Documentation files — what each one is for

- **`README.md`** — what the app does, current status, tech stack, how to
  run it. Must end with a **Development note** section (see below) and a
  **Related** section pointing to METHODOLOGY.md.
- **`METHODOLOGY.md`** — the original framework/methodology behind the
  tool. This is the IP-protection document — states origin, credits any
  established frameworks the tool builds on (with clear attribution, e.g.
  Kraljic, Porter's Five Forces), and describes the original contribution
  clearly separated from the credited frameworks.
- **`LICENSE`** — explicit "All Rights Reserved" copyright, present in
  every repo individually (do not rely on inherited/default licensing —
  confirmed unreliable across this portfolio; always add the file
  directly). Exception: Raaga, which is deliberately MIT-licensed.

## Standard "Development note" section for README.md

Every README ends with this section, verbatim, before "Related":

```markdown
## Development note

Development assisted by Claude Code (Anthropic) under my direction. The
methodology, product design, and domain expertise reflected in this tool
are my own — see `METHODOLOGY.md` for the original framework.
```

## Workflow rules — always follow these

1. **Never commit without showing a diff first and waiting for explicit
   confirmation.** A stop-hook nudge about uncommitted changes is not
   confirmation — only an explicit go-ahead from Vijay counts.
2. **Never force-push** without explicit, separate confirmation — treat
   this as a distinct, higher-caution action from a normal push.
3. **Before any file reorg**, check whether files referenced by the live
   app (script tags, asset paths, sound files, etc.) would be affected.
   Search the app file for references before moving anything that could
   plausibly be a runtime dependency. Report findings before moving, don't
   assume.
4. **Work happens on a feature branch, then via PR into `main`.** Direct
   pushes to `main` should be avoided — branch protection may not be
   enabled on all repos yet, but the convention is PR-first regardless.
5. **After a PR merges, the remote feature branch is not auto-deleted.**
   Flag it and offer to delete it — if deletion 403s (a known permission
   gap with the current GitHub App install), tell Vijay to delete it
   manually via the repo's Branches page rather than retrying.
6. **Never hardcode API keys, passwords, or secrets into any file.** Keys
   are supplied at runtime (env vars, UI input, or session input) — this
   is a firm project-wide rule, not a per-repo preference.
7. **Flag, don't silently fix, anything that looks like real personal
   data, credentials, or PII** in any file being touched — stop and ask
   before proceeding, even if it seems like test data.

## Working alongside direct edits to main

The repo owner sometimes edits `main` directly (via GitHub's web editor or
a local clone) rather than routing every change through a PR — this is a
legitimate, normal part of the workflow, not something to avoid or work
around. Because of this, Claude Code sessions must actively guard against
branch divergence rather than assuming `main` is static:

1. **At the start of every session**, before any work, pull latest `main`
   and briefly confirm whether it has moved since Claude Code last touched
   this repo.
2. **Never let a working branch live longer than one discrete fix/task.**
   Complete one piece of work, get it reviewed and merged, then start the
   next piece from a freshly-pulled `main` — don't accumulate multiple
   unrelated fixes on one long-lived branch. The longer a branch stays
   open, the more likely it silently diverges from direct edits landing on
   `main` in the meantime, and the more entangled the eventual
   reconciliation becomes.
3. **Before starting a new task within the same session**, always re-pull
   `main` first, even if it was checked recently — don't assume it's still
   where it was 20 minutes ago.
4. **If `main` has changed in ways that touch the same functions/lines
   being worked on**, stop and flag it immediately with a clear diff of
   what changed, rather than discovering it at merge time. Assess what's
   genuinely good to adopt from the direct changes (fixes, improvements)
   separately from what needs reconciling with in-progress work.

## Testing & verification for multi-step flows

- **Test the full end-to-end journey, not just the change in isolation,
  for anything touching a multi-step flow** (e.g. student CV builder →
  submit → confirm → navigate away → navigate back → progressive unlock).
  A fix that passes its own isolated test can still break the broader
  journey: during the student-experience-polish round, the fix for the
  permanent-redirect-after-confirm bug passed on its own, but broke on
  re-render (a duplicated CV heading, `# # Name`) — a regression that only
  surfaced once the full journey (confirm, navigate away, navigate back)
  was re-run end-to-end, not when the redirect fix was tested alone.
- **Live-AI verification must run against the actual deployed URL**, not
  Mock mode and not a local dev server. This repo's Secure Proxy Worker
  locks its CORS policy (`Access-Control-Allow-Origin`) to the production
  `github.io` origin — testing from `localhost` fails the browser's CORS
  preflight silently. `curl` cannot detect this (CORS is a browser-only
  enforcement, invisible to a plain HTTP client), so a `curl -I` check
  alone is not sufficient evidence that real AI calls will work; confirm
  from the actual deployed page. Silently falling back to Mock mode when
  a local test can't reach the real proxy defeats the point of a Live-AI
  verification pass — the failure needs to be surfaced, not routed around.
- **Avoid blocking native `alert()` for error states in async/AI-call
  flows.** It freezes automated testing sessions in a way indistinguishable
  from a crash (screenshots and JS eval calls start timing out with no
  visible cause, and closing/reopening the tab is the only recovery), and
  it's inconsistent with the toast-based error pattern (`showToast()`)
  already used elsewhere in the app.

## Known environment quirks

- The GitHub App integration can push and merge but **cannot delete
  branches** (consistent 403) — this is expected, not a bug to keep
  retrying.
- Commit signing may show as unverifiable in local hooks even when the
  actual signature is present and GitHub verifies it server-side after
  push — don't treat a local signing-check failure as blocking on its own.
- **`gh` CLI is not reliably available in every Claude Code session or
  environment.** If `gh pr create` fails (command not found, no auth
  token), don't block on it — push the branch, then give Vijay the manual
  PR creation link GitHub prints after a push
  (`github.com/OWNER/REPO/pull/new/BRANCH-NAME`) along with a suggested
  title and body to paste in.

## Reporting output back to Vijay

- **For long terminal output or a detailed multi-part report, write it to
  a file (e.g. `report.md`) and hand over the path**, rather than pasting
  large blocks directly into chat — long terminal pastes have repeatedly
  arrived corrupted or truncated.

## When in doubt

Report findings and ask, rather than assuming — this repo (and the wider
portfolio) prioritises careful, reviewed changes over speed.
