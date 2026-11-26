# E1-S7 design: hide the blog from search and the sitemap

Approved by the human on 2026-11-26 ("approve and yes": the design and removing the tag feed
link). Items marked "(my call)" were not discussed. Story: `docs/product/roadmap.md` E1-S7
(FR-12, FR-14).

## Intent
A reader with a post URL still gets the post, but search engines index the professional pages and
not the blog (redesign audit G-4). The story ships straight to `main`.

## Goals / non-goals / anti-goals
- Goals: `noindex` on post, blog and tag pages; a sitemap with only `/` and `/about`; no tag feed
  link in the `<head>`; `e2e/hidden-blog.spec.ts`.
- Non-goals: the site-wide RSS links and site titles (E1-S6), 404s for unknown slugs and tags
  (E1-S8), removing `/projects` and its link to a post (E1-S9), leftovers such as `app/head.tsx`
  (E1-S11).
- Anti-goals: a post URL that stops returning 200; `noindex` on `/` or `/about`; a `robots.txt`
  rule that stops crawlers from reading `noindex`; any visible change to a page.

## Constraints
- Next.js 13.4 app router. A page's `robots` metadata replaces the root layout's whole `robots`
  object, including `googleBot`.
- `noindex` goes in the page files, not through `app/seo.tsx`, which E1-S6 changes.
- E1-S6 runs in another worktree and owns `app/layout.tsx`, `app/seo.tsx` and
  `data/siteMetadata.js`. Only the roadmap is shared.
- `robots.txt` and RSS file generation stay as they are.

## Approaches
- **A. `robots: { index: false }` in each page's metadata (picked).** The story asks for it, and
  each route states its own rule. Five files repeat one line.
- B. An `X-Robots-Tag` header in `next.config.js`: one place, but it goes against "in the page
  files", and the page's `index, follow` tag would still contradict it.
- C. `Disallow` in `robots.txt`: crawlers could not read `noindex`, and the spec keeps
  `robots.txt` as it is.

## Design

### `noindex`
Add `robots: { index: false }` to:
- `app/blog/[...slug]/page.tsx`: in the object `generateMetadata` returns.
- `app/blog/page.tsx`: passed to `genPageMetadata`.
- `app/blog/page/[page]/page.tsx`: a new `metadata` export.
- `app/tags/page.tsx`: passed to `genPageMetadata`.
- `app/tags/[tag]/page.tsx`: passed to `genPageMetadata`.

An unknown slug keeps today's behaviour until E1-S8 makes it a 404.

### Tag feed link
In `app/tags/[tag]/page.tsx`, remove `alternates.types` and keep `canonical: './'`. The story
text doesn't name this link, but FR-12 allows no RSS `alternate` link in the `<head>`. The tag
`feed.xml` files are still generated. Tag pages keep the root layout's `/feed.xml` link until
E1-S6 removes it.

### Sitemap (`app/sitemap.ts`)
Remove the post entries. The list comes from the header links without an `event`: `/` and
`/about`.

### `e2e/hidden-blog.spec.ts`
Expected values are written in the test, not imported from `data/`.
- **FR-12 posts:** both post URLs return 200.
- **FR-12 `noindex`:** both posts, `/blog`, `/blog/page/1`, `/tags` and every tag page have one
  `robots` tag containing `noindex`, and no `googlebot` tag.
- `/` and `/about` have no `noindex` (my call).
- **Tag feed:** no tag page links to a `/tags/…/feed.xml` alternate.
- **FR-12 links** (my reading, because blog pages link to each other): `/`, `/about` and the 404
  page have no link into `/blog` or `/tags`; the posts have no link to the blog index, its
  numbered pages or tags.
- **FR-14:** the sitemap's URLs are exactly `https://everas.dev/` and `https://everas.dev/about`.

## Left to the builder
The test file's structure.
