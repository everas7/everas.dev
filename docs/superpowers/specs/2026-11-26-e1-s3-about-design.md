# E1-S3 design: About page with the correct facts

Approved by the human on 2026-11-26 ("yes"). Story: `docs/product/roadmap.md` E1-S3 (FR-9, FR-8).
Size: a small change.

## Intent
A hiring manager checking the résumé (UJ-2) opens `/about` and reads the same facts. Today the page
says "Enmanuel Veras Vargas", "Toptal / 2am.tech" and current Toptal freelancing.

## Goals / non-goals
- Goals: the approved bio, name, employer and alt text on `/about`; no skipped heading levels; a
  résumé link; Umami events on the page's contact links; `e2e/about.spec.ts`.
- Non-goals: page titles and metadata (E1-S6), header and footer (E1-S5), the `primary` colour
  change (E1-S10), the badges (done in E1-S2).
- Anti-goals: Umami events on the footer icons; two different sets of author facts on the site.

## Approaches
1. **Keep the text in `data/authors/default.mdx`** (chosen). `/about` and the blog posts already
   read author data from it. The test compares the rendered page with `data/profile.ts`, so the two
   sources can't drift apart unnoticed.
2. Render `/about` from `data/profile.ts`. The blog posts would still read the MDX, which leaves two
   sets of author facts in use.

## Design

### `data/authors/default.mdx`
- `name: Enmanuel Veras`, `company: 2am.tech`. The other frontmatter stays. There is no `twitter`.
- Body: the three-paragraph bio from ux "Microcopy", word for word. It has no headings and no
  Toptal link (the Credentials row covers it).

### `layouts/AuthorLayout.tsx`
- The name becomes an `h2` with the same classes (was `h3`).
- Avatar `alt` is the author name.
- Under the social icons: "Résumé (PDF) →", label and `href` taken from `profile.links`, in a new
  tab with `rel="noopener noreferrer"`, `data-umami-event="resume"` and
  `data-umami-event-where="about"`. A plain `<a>`, as on `/`. Same link classes as the hero links
  (`primary-500`); the mockup's darker shade arrives in E1-S10.
- The Twitter icon is removed.

### `components/social-icons/index.tsx`
- The Email, GitHub and LinkedIn icons on `/about` send `email`, `github` and `linkedin` events
  with `where="about"`. FR-8 requires it; the story text omits it (proposed by Claude, approved).
- `SocialIcon` gets an optional way to pass these attributes. Without it, the output is unchanged,
  so the footer icons stay untracked.

### `e2e/about.spec.ts` (written first)
- Name, title, employer, location, languages and the 2am.tech start date on the page agree with
  `data/profile.ts`.
- The bio matches the approved text, written out in the test.
- The page says nothing about "Vargas" or current freelancing.
- Exactly one `h1`, and no skipped heading levels.
- The photo's alt text is the person's name.
- The résumé link and the three icons have the right `href`, new-tab behaviour and events.
- No horizontal scroll at 400px.

## Left to the builder
How the attributes are passed to `SocialIcon`, spacing under the icons, and the test's structure.
