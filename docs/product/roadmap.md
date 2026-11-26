---
stage: roadmap
status: final
updated: "2026-11-26T17:53"
based_on: "feature/portfolio-home/spec@2026-11-26T17:33, feature/portfolio-home/ux@2026-11-26T17:46"
---

# Roadmap: everas.dev

## M1 — Professional profile
everas.dev reads as a senior engineer's profile: `/` and `/about` state the role, work,
credentials and contact; the blog is still reachable by URL but hidden from search and navigation.

### E1 — Portfolio home (feature: portfolio-home)
Done when: every FR-1–FR-17 check in `yarn test:e2e` passes against a production build, and
everas.dev in production shows the new `/` and `/about` with no CSP errors and a Résumé click
recorded in Umami.

Every story ships to `main` on its own (production deploy). Each story's verify passes, plus
lint and type check (AGENTS.md), before it is pushed. Specs live in `e2e/`.

#### E1-S1 · Tracer bullet: profile hero on `/` with the e2e harness
- covers: FR-1, FR-2, FR-3, FR-8, FR-15
- after: none
- lane: home
- size: M
- verify: `yarn build && yarn test:e2e e2e/home-hero.spec.ts`
- status: done
Add `@playwright/test` as a devDependency, `playwright.config.ts` (webServer `yarn serve`) and a `test:e2e` script. Create `data/profile.ts` holding all of spec "Content", the single source for later stories. Replace the greeting, post list and newsletter form on `/` with the hero (ux "Home" 1); the hero links carry `data-umami-event` + `-where="home"`. Spec checks FR-1 at 400×800 and 1280×800 in both themes, FR-2's PDF response, FR-3's hrefs, and that `/` has no form.

#### E1-S2 · Credentials row with embeds, fallbacks and CSP
- covers: FR-5, FR-6, FR-7, FR-8
- after: E1-S1
- lane: home
- size: M
- verify: `yarn build && yarn test:e2e e2e/credentials.spec.ts`
- status: done
New `components/Credentials.tsx` (ux "New, needs approval"), rendered on `/` and `/about`. The Credly badge as a direct `https://www.credly.com` iframe (no `embed.js`) in a fixed 150×270 slot with placeholder text, the Toptal snippet ported with a CSS Module and no Typekit, and a text link always visible under each badge. Add `https://www.credly.com` to `frame-src` in `next.config.js`. Resolve OQ-6 in the browser console and write the exact hosts into the spec. Spec checks: blocking `www.credly.com` leaves the links; no `securitypolicyviolation` events; `body` font and `:root` styles unchanged.

#### E1-S3 · About page with the correct facts
- covers: FR-9, FR-8
- after: E1-S2
- lane: about
- size: M
- verify: `yarn build && yarn test:e2e e2e/about.spec.ts`
- status: todo
Rewrite `data/authors/default.mdx` (name "Enmanuel Veras", approved bio from ux "Microcopy", no Twitter). In `AuthorLayout`: name as `h2`, role and employer, avatar alt text, and "Résumé (PDF) →" with `-where="about"`. Spec compares the text to `data/profile.ts`, checks there is one `h1` and no skipped heading levels, and checks the alt text.

#### E1-S4 · Selected work cards on `/`
- covers: FR-4
- after: E1-S2
- lane: home
- size: S
- verify: `yarn build && yarn test:e2e e2e/home-work.spec.ts`
- status: todo
Card variant: an `as` heading prop (default `h2`), an optional `meta` line and the `form-title` size, full width (ux "New, needs approval"). Three cards from `data/profile.ts`, no links or images, with the Projects section commented out in the source. Can run in parallel with E1-S3.

#### E1-S5 · Professional header, mobile menu and footer
- covers: FR-11, FR-17, FR-10, FR-8
- after: E1-S1
- lane: site
- size: M
- verify: `yarn build && yarn test:e2e e2e/frame.spec.ts`
- status: todo
`headerNavLinks`: About and Résumé (menu: Home, About, Résumé). Résumé opens in a new tab with `resume` events `-where="header"` and `"menu"`. Remove `SearchButton`, `SearchProvider` from `app/layout.tsx` and `siteMetadata.search`. Mobile menu: out of the tab order and `aria-hidden` when closed, `Esc` closes it, labels "Open menu" / "Close menu". Remove the footer theme credit. Can run in parallel with E1-S2–S4.

#### E1-S6 · Site metadata, titles and RSS links
- covers: FR-10, FR-12
- after: E1-S5
- lane: site
- size: S
- verify: `yarn build && yarn test:e2e e2e/metadata.spec.ts`
- status: todo
In `siteMetadata.js` and `app/layout.tsx`: home title "Enmanuel Veras – Senior Software Engineer", template "%s | Enmanuel Veras", description from the intro, logo text stays "everas.dev". `app/seo.tsx` follows the same template. Remove the RSS `alternate` links (`app/layout.tsx:35-38,74`); `feed.xml` generation stays.

#### E1-S7 · Hide the blog from search and the sitemap
- covers: FR-12, FR-14
- after: E1-S1, E1-S5
- lane: routes
- size: S
- verify: `yarn build && yarn test:e2e e2e/hidden-blog.spec.ts`
- status: todo
Add `robots: { index: false }` to the metadata exports of the post, `/blog`, `/blog/page/*`, `/tags` and `/tags/*` pages, in the page files and not through `app/seo.tsx` (site lane). `app/sitemap.ts` lists only `/` and `/about`. Spec checks both post URLs return 200, and that no page links to `/blog` or `/tags`. That check needs the old home (E1-S1) and the old header (E1-S5) gone.

#### E1-S8 · Real 404s and the 404 page
- covers: FR-13, FR-17
- after: E1-S7
- lane: routes
- size: S
- verify: `yarn build && yarn test:e2e e2e/not-found.spec.ts`
- status: todo
`notFound()` for an unknown post slug and an unknown tag, so they return status 404. `app/not-found.tsx`: new copy, a `primary-700` button with white text, `rounded-lg` and a visible focus ring (ux "404").

#### E1-S9 · Remove the newsletter, projects and starter leftovers
- covers: FR-15, FR-16
- after: E1-S6
- lane: site
- size: S
- verify: `yarn build && yarn test:e2e e2e/removals.spec.ts`
- status: todo
Delete `app/api/newsletter`, `app/projects` and `data/projectsData.ts`. Remove `newsletter` and `mastodon` from `siteMetadata.js` and the Mailchimp variables from `.env.example`. Spec: `/api/newsletter` and `/projects` return 404, and no page has a form.

#### E1-S10 · Accessible `primary` link colour
- covers: FR-17
- after: E1-S3, E1-S4, E1-S8, E1-S9
- lane: site
- size: M
- verify: `yarn build && yarn test:e2e e2e/contrast.spec.ts`
- status: todo
Light-theme text `primary-500`→`primary-700` and hover →`primary-800` across `app/Main.tsx`, `components/Card.tsx`, `Tag.tsx`, `social-icons`, the post and list layouts, and the prose link colour (`tailwind.config.js:50`). Dark stays the same (ux token table). Spec computes the contrast of the links and chips on `/`, `/about` and a post (≥ 4.5:1 on white). This runs after the stories that touch those files.

#### E1-S11 · Refactor sweep
- covers: none
- after: E1-S1, E1-S2, E1-S3, E1-S4, E1-S5, E1-S6, E1-S7, E1-S8, E1-S9, E1-S10
- lane: site
- size: S
- verify: `yarn next lint --dir app --dir components --dir layouts --dir scripts && yarn build && yarn test:e2e`
- status: todo
Cleanup only: drop unused imports and components (search, newsletter, projects), dead `siteMetadata` keys and unused Card branches. No behaviour change, and the full suite stays green.

#### E1-S12 · Fold the feature into EXPERIENCE.md and DESIGN.md, verify in production
- covers: none
- after: E1-S11
- lane: site
- size: S
- verify: `yarn build && yarn test:e2e && sh "$HOME/.claude/skills/prep/prep-status.sh"`
- status: todo
EXPERIENCE.md: new Home, About, frame and 404. Retire F-1–F-4 and F-6, and turn F-5 into UJ-2. DESIGN.md: the `primary` text change, `form-title` renamed `title-sm`, the Credentials row and the Card variant. In production: no CSP errors on `/` and `/about`, and Résumé, Email and badge clicks appear in Umami (FR-8, Success). Then mark the epic's Done when as met.

## Deferred
- Logo redesign: visual identity, so it needs its own feature or redesign pass (spec Non-goals).
- Case-study pages, project links and a live Projects section (spec Non-goals).
- Dark-mode styling for vendor badges (audit OQ-2, accepted).

## Decisions
- 2026-11-26: Playwright e2e harness added in the tracer bullet. FR-1, FR-6 and FR-7 can only be checked in a browser (human chose it over a no-dependency script plus manual checks).
- 2026-11-26: Each story ships straight to `main` (human; a feature branch with a single merge was recommended). As a result, the About facts (E1-S3) come right after the credentials row, and the Credentials row goes on both pages in E1-S2, so production never shows the new home next to the old Toptal claim for long.
- 2026-11-26: E1-S2 renders the Credly badge as a direct iframe (no `embed.js`, which runs once per full page load) and ports the Toptal snippet to a CSS Module without Typekit (human chose this over loading the vendor script and fonts).
- 2026-11-26: Story 2 is the Credentials row, the part the human is least sure of (OQ-6 hosts, scoped Toptal CSS).
- 2026-11-26: Umami events (FR-8) are added in each story that builds a link, not as a separate pass.
- 2026-11-26: The `primary` contrast change comes late (E1-S10) because it touches files in every lane. Running it last avoids merge conflicts.
- 2026-11-26: Refactor sweep comes before the docs story, so EXPERIENCE.md and DESIGN.md describe the cleaned-up code.
