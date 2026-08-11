# Changelog

All notable changes to Career Suite are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

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
