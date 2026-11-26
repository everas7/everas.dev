---
stage: feature-ux
feature: "portfolio-home"
status: final
updated: "2026-11-26T17:46"
based_on: "feature/portfolio-home/spec@2026-11-26T17:33, ux@2026-11-26T16:33"
---

# Feature UX: portfolio-home

Layout decisions below were made by the human on 2026-11-26
unless marked otherwise.

## Where it lives

No new routes and no overlays. The feature changes existing screens in place:

- **`/`** (EXPERIENCE "Screens"): the greeting, post list and newsletter are replaced by a
  profile hero, Selected work and Credentials.
- **`/about`**: same `AuthorLayout`, new facts, a Résumé link and a Credentials row.
- **Header and mobile menu**: links become About and Résumé (header) and Home, About and Résumé
  (menu). The search button and `Cmd/Ctrl+K` go.
- **Footer**: the theme credit goes. The social icons and author line stay.
- **404**: first-person copy, a palette button and a focus ring. It is now also what a bad post or
  tag URL shows (FR-13).

Entry point for both journeys: a link to `/` from the résumé or LinkedIn. `/about` is reached
from the header. The blog routes stay reachable by direct URL only (FR-12); this feature adds
nothing to them.

## Screens added or changed

### `/` Home (changed; FR-1, FR-2, FR-3, FR-4, FR-5, FR-8, FR-10)

Order, top to bottom, inside the existing centred column:

1. **Hero.** No photo.
   - `h1` "Enmanuel Veras" in `display-xs` → `display-sm` → `display` (the heading classes
     `/about` already uses).
   - Role "Senior Software Engineer": a `p` in `card-title`, colour `heading`.
   - Intro (Content, word for word): `lead`, colour `muted`.
   - Link row: "Résumé (PDF) →", "Email", "GitHub", "LinkedIn" as `text-link`s, in that
     order, `space-x-6`, wrapping at narrow widths. Résumé opens in a new tab.
   - Must sit above the fold at 400×800 and 1280×800 (FR-1). Estimate at 400×800: header 112px
     plus hero about 370px. That leaves about 300px, enough for the "Selected work" heading too.
2. **Selected work.**
   - `h2` "Selected work" in `card-title`.
   - Three Cards in a single column, full width, `space-y-6`. Each has an `h3` title, a meta
     line, then the description (Content, word for word).
   - No links and no images (FR-4).
   - A commented-out Projects section sits under it in the source (FR-4).
3. **Credentials.** `h2` "Credentials", then the Credentials row (see "New, needs approval").

A thin `border` divider separates the hero from Selected work, as the old home hero did.
Removed: the post list, "All Posts →" and the newsletter form.

### `/about` About (changed; FR-5, FR-8, FR-9)

Keeps `AuthorLayout`: the photo column and the bio column (two-thirds) from `xl`, stacked below.

- `h1` "About" (unchanged).
- Photo column:
  - Avatar with alt text "Enmanuel Veras".
  - Name "Enmanuel Veras" as `h2` (was `h3`, which fixes the h1→h3 jump).
  - "Senior Software Engineer" and "2am.tech" in `muted`.
  - Social icons Email, GitHub and LinkedIn (Twitter dropped; it was never set).
  - Under the icons, a `text-link` "Résumé (PDF) →" that opens in a new tab.
- Bio column: the new bio (Microcopy).
- Below both columns, full width:
  - A `border` divider.
  - `h2` "Credentials" in `card-title`.
  - The Credentials row.

### Header (changed; FR-11)

- Logo and "everas.dev" stay.
- Text links "About" and "Résumé" from `sm`, styled `nav-link`. Résumé opens the PDF in a new tab.
- Theme switch and menu button stay. The search button is removed.

### Mobile menu (changed; FR-11, FR-17)

- Links: Home, About, Résumé. Selecting Résumé opens the PDF in a new tab and closes the menu.
- Closed: the panel is out of the tab order and hidden from assistive technology.
- Open: `Esc` closes it.
- Otherwise unchanged: full-screen panel, `menu-link` type, slide-in animation.

### Footer (changed; FR-10)

- Icons Email, GitHub and LinkedIn: no change.
- Line "Enmanuel Veras • © {build year} • everas.dev": no change.
- The "Tailwind Nextjs Theme" line is removed.

### 404 (changed; FR-13, FR-17)

Same layout: big "404", copy on the right from `md`.

- New copy (Microcopy).
- Button "Back to home": background `primary` (light value, below), white text, `rounded.lg`.
- Visible focus ring (see Components and tokens used).

## Flows

### UJ-1 Recruiter screens a candidate
1. Opens a link to `everas.dev` from LinkedIn or the résumé → **Home**.
2. Without scrolling: name, role, intro and the four links.
3. Scrolls to **Selected work** and reads the three cards.
4. One of:
   - Selects "Résumé (PDF) →" and the PDF opens in a new tab. ★
   - Selects "Email" and the mail client opens on `enmaveras07@gmail.com`. ★
   - Selects "LinkedIn" and the profile opens in a new tab. ★
5. Optionally scrolls on to **Credentials**: same as UJ-2 step 3.

The header Résumé link (desktop) or menu Résumé (mobile) is a second route to step 4 from any page.

### UJ-2 Hiring manager checks the claims
1. From **Home** (or any page), selects "About" in the header or mobile menu → **About**.
2. Reads the photo column (name, role, employer) and the bio: employer and dates, location,
   languages.
3. Scrolls to **Credentials**. Selects the Credly badge (inside the embed) or "Verify on Credly
   →", and the Credly badge page opens in a new tab. Or selects "Toptal profile →" (or the
   badge's "Hire me"), and the Toptal résumé opens in a new tab. ★
4. Selects the GitHub icon, and GitHub opens in a new tab.

### Removed flows
EXPERIENCE flows F-1 to F-4 (read, browse, explore topics, search) and F-6 (newsletter) lose
their entry points. F-5 becomes UJ-2. The last story updates EXPERIENCE.md to match.

## States

The pages are built statically. The only parts that load at run time are the two badge embeds.

| Screen or part | Empty | Loading | Error | Permission / first use |
| --- | --- | --- | --- | --- |
| Home hero, Selected work | n/a (content is fixed in source) | none (static) | none (static) | n/a: no accounts |
| Credentials row: Credly slot | n/a | The slot keeps its full size (no layout shift). It shows the placeholder text "Claude Certified Developer – Foundations · Anthropic" in `muted` until the iframe covers it | Script blocked or failed: the placeholder text stays; "Verify on Credly →" below always works (FR-6) | n/a |
| Credentials row: Toptal slot | n/a | Fonts load late: text shows in fallback font, then swaps. Size reserved | Typekit or CSS blocked: badge HTML shows unstyled but readable; "Toptal profile →" below always works (FR-6) | n/a |
| About | n/a | none | none | n/a |
| Header, mobile menu, footer | n/a | Theme switch still renders after mount (existing) | none | n/a |
| Résumé link | n/a | Browser PDF viewer | PDF missing: Vercel 404 in the new tab. Guarded by the FR-2 check, not by UI | n/a |
| 404 | n/a | n/a | This is the error state for unknown routes, slugs and tags (FR-13) | n/a |

Dark theme: the vendor badges keep their light styling on `surface-dark` (accepted, OQ-2).

## Components and tokens used

**Existing components:**
- Header
- Footer
- Mobile menu
- `Link`: internal paths route in the app.
  - Résumé needs `target="_blank"` explicitly, since `/static/resume.pdf` looks internal.
- `text-link`
- `nav-link`
- Social icon
- Card: as a variant, see "New, needs approval".
- `AuthorLayout`
- `avatar`
- `SectionContainer`

**Tokens:**
- Colours:
  - `primary`, `primary-hover`, `primary-hover-dark`
  - `heading`, `heading-dark`
  - `muted`, `muted-dark`
  - `border`, `border-dark`
  - `surface`, `surface-dark`
  - `on-primary`
- Type: `display`, `display-sm`, `display-xs`, `card-title`, `lead`, `meta`, `nav`, `menu-link`,
  `small`, `body`
- Radii: `md` (cards, badge slots), `lg` (404 button), `full` (avatar)
- Spacing: steps 2–16, `gutter`, `container`

**Token change (FR-17, approved in the spec as the one token change):**

| Token | Light, before → after | Dark (unchanged) |
| --- | --- | --- |
| `primary` as text | `primary-500` `#0db1ea` (2.47:1) → `primary-700` `#0270a0` (**5.49:1** on white) | `primary-500` (8.14:1 on `surface-dark`) |
| `primary-hover` | `primary-600` `#018ec8` → `primary-800` `#065f86` (7.03:1) | `primary-400` |
| 404 button background | `blue-600` → `primary-700`; white text 5.49:1; hover `primary-800` | same as light |
| Focus ring (404 button) | none → 2px ring `primary-700`, offset 2px on `surface` | 2px ring `primary-500` (8.14:1), offset on `surface-dark` |

The change applies to every `text-primary-500` text use, plus the typography plugin's prose link
colour (`tailwind.config.js:50`). Post links change colour too, which is accepted in the spec.
`logo` stays `#06b6d4`.

**Umami events (FR-8):**
- Event names: `resume`, `email`, `github`, `linkedin`, `badge-claude`, `badge-toptal`.
- Each event carries `data-umami-event-where` set to `home`, `about`, `header` or `menu`.
- Footer icons get no events (not required by FR-8).

## New, needs approval

| What | Why existing won't do | Approved |
| --- | --- | --- |
| **Credentials row** (new component, `components/Credentials.tsx`). Two badge slots side by side with `space-x-6`, wrapping below `sm` if they don't fit 368px. Each slot is a fixed-size box sized to its embed. [ASSUMPTION: Credly 150×270 from the vendor snippet's `data-iframe-width/height`; Toptal size measured on a build.] Under each slot, a `text-link`: "Verify on Credly →" and "Toptal profile →", always visible and carrying the Umami events. Used on `/` and `/about`. | Nothing in the app hosts third-party embeds. The spec names it as the one new component | yes (human, 2026-11-26) |
| **Card variant**: an `as` prop for the title heading level (`h3` here; default stays `h2`) and an optional `meta` line in `meta` / `muted` under the title. No image, no `href`. Full width in a single column, not `md:w-1/2`. | Card hard-codes `h2`, which would put card titles at the same level as "Selected work". It has no slot for "Contract · 2023–2025". The 2-up layout leaves the third card alone | yes (human, 2026-11-26) |
| **Card title size in the variant**: `form-title` (1.125rem / 600) instead of `card-title`, so `h2` "Selected work" (`card-title`) outranks the card titles | `card-title` on both levels flattens the hierarchy. `form-title` is an existing token whose only use (the newsletter) is being removed; the last story can rename it `title-sm` in DESIGN.md | yes (human, 2026-11-26) |

## Microcopy

First person on home and About, plain labels elsewhere: the existing voice, minus the
"Welcome to my blog" tone.

| Where | Text |
| --- | --- |
| `<title>` and OG title of `/` | "Enmanuel Veras – Senior Software Engineer" |
| Other page titles | "%s \| Enmanuel Veras", for example "About \| Enmanuel Veras" |
| Meta description | The intro from Content |
| Home `h1` | "Enmanuel Veras" |
| Home role | "Senior Software Engineer" |
| Home intro | Content intro, word for word |
| Hero links | "Résumé (PDF) →", "Email", "GitHub", "LinkedIn" |
| Section headings | "Selected work", "Credentials" |
| Card meta lines | 1: "Contract · 2023–2025" · 2: "2am.tech" · 3: "Toptal" (only facts the Content gives) |
| Card titles and text | Content, word for word |
| Badge placeholders | "Claude Certified Developer – Foundations · Anthropic" · "Toptal · Top 3% Talent" |
| Badge links | "Verify on Credly →" · "Toptal profile →" |
| Header / menu | "About", "Résumé" / "Home", "About", "Résumé" |
| Menu button labels | "Open menu" / "Close menu" (was "Toggle Menu" for both) |
| About photo column | "Enmanuel Veras", "Senior Software Engineer", "2am.tech", "Résumé (PDF) →" |
| Avatar alt | "Enmanuel Veras" |
| 404 | "This page doesn't exist." / "It may have moved, or the link has a typo." / "Back to home" |
| Footer | "Enmanuel Veras • © 2026 • everas.dev" |

**About bio (approved by human 2026-11-26):**

> I'm a Senior Software Engineer at 2am.tech, where I've worked since April 2022. I build
> full-stack products in TypeScript and LLM systems in Python, with 8 years shipping React,
> Node.js and AWS.
>
> Most recently I built the RAG pipeline behind an AI sales assistant used by about 150 car
> dealerships. At 2am.tech I'm leading the rebuild of paperless document delivery for a Fortune
> 500 insurer. From 2021 to 2023 I also worked through Toptal, building event-driven
> integrations on AWS.
>
> I live in Santo Domingo, Dominican Republic, and work remotely with US Eastern overlap. I work
> in English (professional) and Spanish (native).

## Mockups

Static HTML in `mockups/`, built from DESIGN.md token values (badges are placeholders). Add
`#dark` to the URL for the dark theme, and `#w400` (or `#dark-w400`) to pin the page to 400px.
At 400×800 the hero's last link ends at about y=465, so FR-1 fits with room to spare.

- [mockups/home.html](mockups/home.html): Home with hero, Selected work and Credentials.
- [mockups/about.html](mockups/about.html): About with the photo column, bio and Credentials.
- Screenshots in `mockups/`, at 400×800 and 1280×800 in light and dark:
  - `home-400-light.png`, `home-400-dark.png`, `home-1280-light.png`, `home-1280-dark.png`
  - `about-1280-light.png`, `about-400-dark.png`

For higher-fidelity mocks in Claude Design or v0, use [design-prompt.md](design-prompt.md).
