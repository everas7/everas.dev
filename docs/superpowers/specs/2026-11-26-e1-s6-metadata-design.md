# E1-S6 design: site metadata, titles and RSS links

Approved by the human on 2026-11-26 ("yes"). Items marked "(my call)" were proposed by the
builder and approved as part of this design. Story: `docs/product/roadmap.md` E1-S6 (FR-10,
FR-12).

## Intent
Search results and link previews show the same professional facts as the pages (UJ-1, UJ-2), and
no page advertises the blog's RSS feed. The story ships straight to `main`.

## Goals / non-goals / anti-goals
- Goals: new home title, title template and description; the same site name in previews on every
  page; no RSS `alternate` link in any `<head>`; `e2e/metadata.spec.ts`.
- Non-goals: `noindex` and the sitemap (E1-S7), removing `newsletter`, `mastodon` and `/projects`
  (E1-S9), other cleanup (E1-S11), `siteLogo` and `socialBanner`, the web manifest.
- Anti-goals: a new dependency; any visible change to the pages; the header logo text changing
  from "everas.dev"; RSS file generation stopping.

## Constraints
- Next.js 13.4 app router. A page's `alternates` and `openGraph` replace the layout's, they don't
  merge.
- `scripts/rss.mjs` loads `data/siteMetadata.js` with plain Node, so that file can't import
  `data/profile.ts`.
- E1-S4 runs in another worktree. Only the roadmap is shared.

## Approaches
There is one sensible way: change the configuration the app already reads. The one choice inside
it is the description: building it from `data/profile.ts` would need the RSS script to load
TypeScript, so the intro is copied into `siteMetadata.js` and the spec catches drift.

## Design

### Site data (`data/siteMetadata.js`)
- `title`: "Enmanuel Veras – Senior Software Engineer" (en dash).
- `description`: the intro from spec "Content", word for word.
- `author` and `headerTitle` don't change.

### Titles and previews
- `app/layout.tsx`: the default `<title>`, Open Graph title and Twitter title come from `title`.
  The template is "%s | Enmanuel Veras", from `author`.
- `app/seo.tsx`: Open Graph and Twitter titles use the same suffix.
- Open Graph `siteName` is `author`, "Enmanuel Veras" (my call), in `app/layout.tsx`,
  `app/seo.tsx` and `app/blog/[...slug]/page.tsx`.
- Posts keep the bare post title as their Open Graph and Twitter title.
- `app/blog/page/[page]/page.tsx` gets the "Blog" title through `genPageMetadata`. It has no
  metadata of its own, so it would take the home title, against FR-10 (found while planning,
  reviewed with the plan).
- `app/tags/[tag]/page.tsx`: the description uses `headerTitle`, so it still reads
  "everas.dev react tagged content" (my call).

### RSS links
- `app/layout.tsx`: remove `alternates.types` and the `<link rel="alternate">` element.
- `app/tags/[tag]/page.tsx`: remove the `alternates` block. The canonical URL is then inherited
  from the layout.
- Delete `app/head.tsx` (my call). Next 13.4 doesn't read it.
- `scripts/rss.mjs` doesn't change. The title and description inside the generated feeds follow
  the new site data.

### `e2e/metadata.spec.ts`
Titles are written in the test. The description is compared with `profile.intro`, to catch drift
between the two data files.
- **FR-10:** `/` has the new `<title>`, Open Graph and Twitter titles and description; `/about`,
  `/blog`, a post and a tag page follow the template; the site name is "Enmanuel Veras"; the
  header logo text is "everas.dev".
- **FR-12:** `/`, `/about`, `/blog`, `/blog/page/1`, both posts, `/tags` and a tag page have no
  RSS `alternate` link and keep their canonical URL.
- `/feed.xml` and a tag feed still return 200.

## Left to the builder
The test file's structure.
