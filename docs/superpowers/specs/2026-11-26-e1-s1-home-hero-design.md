# E1-S1 design: profile hero on `/` with the e2e harness

Approved by the human on 2026-11-26. Story: `docs/product/roadmap.md` E1-S1 (FR-1, FR-2, FR-3, FR-8, FR-15).

## Intent
A recruiter coming from LinkedIn or the résumé lands on `/` and sees, without scrolling, the
name, title, intro and links to Résumé, Email, GitHub and LinkedIn. This story also adds the
Playwright harness that every later story's check runs on. It ships straight to `main`.

## Goals / non-goals
- Goals: the hero on `/`, `data/profile.ts` as the single source of the spec's Content, and a
  Playwright harness with `e2e/home-hero.spec.ts`.
- Non-goals: Selected work, Credentials, header, metadata and About changes (later stories).
  Between this deploy and E1-S4, production `/` shows only the hero. That was accepted.
- Anti-goals: changing `components/Link.tsx` behaviour for other callers; a visual redesign.

## Constraints
- Node 24, Yarn 3.6.1, `nodeLinker: node-modules`. The theme follows the system (`next-themes`, class
  strategy).
- `/static/resume.pdf` and the three contact URLs must not change.

## Approaches
Only one approach made sense. The roadmap fixed the tool (Playwright, the human's decision over a no-dependency script) and ux.md
fixed the layout.

## Design
- `data/profile.ts`: all of spec "Content" as typed constants (name, title, intro, links,
  employer, location/languages, three work items with meta lines, credentials).
- `app/page.tsx`: renders `<Main />` with no Contentlayer import (static page).
- `app/Main.tsx`: the hero.
  - `h1` name: the existing heading classes `/about` uses.
  - Role: a `p` in `card-title`, heading colour.
  - Intro: `lead`, muted.
  - Link row: "Résumé (PDF) →", "Email", "GitHub", "LinkedIn", `space-x-6`, wrapping.
  - Résumé and Email are plain `<a>`. Résumé gets `target="_blank" rel="noopener"`. Email has no
    target, because `components/Link.tsx` would open `mailto:` in a new tab and send the PDF through the router.
    GitHub and LinkedIn open in a new tab.
  - Each link carries `data-umami-event` (`resume`, `email`, `github`, `linkedin`) and
    `data-umami-event-where="home"`.
  - The post list, "All Posts" and the newsletter form are removed.
- `playwright.config.ts`: Chromium only, `webServer: yarn serve` on port 3000,
  `reuseExistingServer` locally. `package.json` gets the script `"test:e2e": "playwright test"` and the
  devDependency `@playwright/test`.
- `e2e/home-hero.spec.ts`:
  - FR-1: for 400×800 and 1280×800 × light/dark (`colorScheme`), the name, role, intro and the four
    links are visible and their bounding boxes end within the viewport height.
  - FR-2: the résumé `href` is `/static/resume.pdf`, and a request to it returns 200 with `application/pdf`.
  - FR-3: exact hrefs `mailto:enmaveras07@gmail.com`, `https://github.com/everas7`,
    `https://www.linkedin.com/in/everas7/`.
  - FR-8: each link has its `data-umami-event` and `-where="home"`.
  - FR-15 (partial): `/` has no `<form>`.

## Left to the builder
The exact Tailwind classes for each DESIGN.md token (match `AuthorLayout` and the existing
components), the test file's structure, and the Playwright version (the current stable one).
