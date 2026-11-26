# E1-S2 Credentials row Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Credentials row (Credly iframe + scoped Toptal badge + always-visible text links) on `/` and `/about`, with a minimal CSP change.

**Architecture:** Server components only. The Credly badge is the `<iframe>` that `embed.js` would write, rendered directly. The Toptal snippet is ported to JSX with a CSS Module (hashed classes, no `:root`, no Typekit).

**Tech Stack:** Next.js 13 app router, Tailwind, CSS Modules, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-26-e1-s2-credentials-design.md`

## Global Constraints

- Credly iframe `src`: `https://www.credly.com/embedded_badge/523d4204-1cad-42fe-8a94-aa6aa6fa9966`, 150×270, title "View my verified achievement on Credly."
- Placeholder: "Claude Certified Developer – Foundations · Anthropic". Links: "Verify on Credly →", "Toptal profile →".
- Toptal résumé URL: `https://www.toptal.com/developers/resume/enmanuel-veras-vargas` (the "Hire me" href keeps `#NW8430`).
- Umami: `badge-claude`, `badge-toptal`; `data-umami-event-where` is `home` or `about`; "Hire me" adds `data-umami-event-via="badge"`.
- CSP: only `frame-src giscus.app https://www.credly.com` changes.
- No third-party script, no Typekit, no `:root` rule from the badge.

## Review Focus

1. Navigating client-side from `/` to `/about` must still show the Credly badge (server-rendered iframe: covered by the FR-5 test on `/about` loading the iframe element; the in-app link comes in E1-S5).
2. A 400px viewport must not scroll sideways when the slots stack: covered by the 400px overflow test on both pages.
3. Dark theme must keep the text links readable: they reuse the hero link classes (no new test; E1-S10 owns contrast).
4. Blocked Credly must not collapse the slot: covered by the FR-6 box-size assertion.
5. The Toptal CSS must not restyle site elements: covered by the FR-7 `--h`, font and bare-class checks.

---

### Task 1: Credentials component on `/` with CSP

**Files:**
- Create: `components/Credentials.tsx`, `components/ToptalBadge.tsx`, `components/ToptalBadge.module.css`
- Modify: `app/Main.tsx`, `next.config.js:16`
- Test: `e2e/credentials.spec.ts`

**Interfaces:**
- Produces: `export default function Credentials({ where }: { where: 'home' | 'about' })` and `export default function ToptalBadge({ where }: { where: 'home' | 'about' })`.

- [ ] **Step 1:** Write `e2e/credentials.spec.ts` with a `for (const [path, where] of [['/', 'home'], ['/about', 'about']])` loop and these tests: FR-5 (h2 "Credentials", iframe `src` + 150×270 box, "TOP 3% TALENT" text, "Hire me" href starts with the Toptal URL), FR-6 (abort `**://www.credly.com/**`, both text links visible with hrefs, Credly slot box 150×270, no request to `typekit.net`), FR-7 (init script collects `securitypolicyviolation`; zero after `networkidle`; `--h` on `:root` is `''`; body `font-family` contains `Montserrat`; no element matches `.a,.b,.c,.d,.f,.h`), FR-8 (events + `-where` on both text links and "Hire me"), no horizontal scroll at 400px.
- [ ] **Step 2:** Run `yarn build && yarn test:e2e e2e/credentials.spec.ts`. Expected: FAIL (no Credentials heading).
- [ ] **Step 3:** Implement the two components per the design, add the divider + `h2` + `<Credentials where="home" />` to `app/Main.tsx`, and add `https://www.credly.com` to `frame-src`.
- [ ] **Step 4:** Rebuild and run the spec. Expected: the `/` tests PASS; the `/about` tests still FAIL.
- [ ] **Step 5:** Run lint and the type check (AGENTS.md); commit `feat(home): add credentials row with Credly and Toptal badges`.

### Task 2: Credentials on `/about`

**Files:**
- Modify: `layouts/AuthorLayout.tsx`
- Test: `e2e/credentials.spec.ts` (already written)

- [ ] **Step 1:** Below the grid, inside the `divide-y` wrapper: a section with `h2` "Credentials" (`card-title`) and `<Credentials where="about" />`.
- [ ] **Step 2:** Run `yarn build && yarn test:e2e`. Expected: all tests PASS, including `home-hero.spec.ts`.
- [ ] **Step 3:** Commit `feat(about): add credentials row`.

### Task 3: Resolve OQ-6 and update the docs

**Files:**
- Modify: `docs/product/features/portfolio-home/spec.md` (FR-6, FR-7, Change boundary, OQ-6), `docs/product/roadmap.md` (E1-S2 text, status)

- [ ] **Step 1:** Load `/` and `/about` on `yarn serve`; record the hosts requested by the page itself (not those inside the Credly frame) and any console CSP errors.
- [ ] **Step 2:** Update the spec and roadmap wording per the design's "Spec and roadmap updates"; OQ-6 resolved with the date and hosts.
- [ ] **Step 3:** Run the story's verify `yarn build && yarn test:e2e e2e/credentials.spec.ts`, then set `status: done`; commit `docs: resolve OQ-6 and mark E1-S2 done`.
