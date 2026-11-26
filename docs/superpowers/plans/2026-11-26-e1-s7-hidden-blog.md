# E1-S7 Hide the blog from search and the sitemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Search engines skip the blog and the sitemap lists only `/` and `/about`, while post URLs keep working.

**Architecture:** Each blog and tag route sets `robots: { index: false }` in its own metadata, which replaces the root layout's `robots` object (including `googleBot`). `app/sitemap.ts` drops the post entries.

**Tech Stack:** Next.js 13.4 app router, Contentlayer, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-26-e1-s7-hidden-blog-design.md`

## Global Constraints

- `noindex` goes in the page files. Don't touch `app/seo.tsx`, `app/layout.tsx` or `data/siteMetadata.js` (E1-S6).
- Both post URLs keep returning 200: `/blog/help-apollo-is-changing-my-query-response`, `/blog/taking-ownership`.
- No `noindex` on `/` or `/about`. `app/robots.ts` and `scripts/rss.mjs` stay as they are. No visible change to any page.
- Leave unknown slugs and tags as they are (E1-S8).
- E2E expected values are written in the test, not imported from `data/`.
- Before each code commit, build, then lint and type check:
  `yarn next lint --dir app --dir components --dir layouts --dir scripts` and
  `yarn tsc --noEmit --tsBuildInfoFile node_modules/.cache/tsconfig.tsbuildinfo`.
- Tests run against the last build: `yarn build`, then `APP_PORT=3107 yarn test:e2e …`.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Work only in this worktree. Don't push or merge without the human's go-ahead.

## Review Focus

1. `robots.txt` blocking the blog would stop crawlers from reading `noindex`: it must keep `Allow: /` with no `Disallow` (Task 1).
2. Editing the tag page's `alternates` could drop its canonical URL: `/tags/team-work` keeps `https://everas.dev/tags/team-work` (Task 1).
3. An inherited `googlebot: index, follow` tag would contradict `noindex`: blog pages have none (Task 1).

---

Before Task 1, commit the design, this plan and the roadmap status:
`docs: add E1-S7 design and plan, start E1-S7`.

### Task 1: `noindex` on the blog and no tag feed link

**Files:**
- Create: `e2e/hidden-blog.spec.ts`
- Modify: `app/blog/[...slug]/page.tsx`, `app/blog/page.tsx`, `app/blog/page/[page]/page.tsx`, `app/tags/page.tsx`, `app/tags/[tag]/page.tsx`

**Interfaces:**
- Produces: `e2e/hidden-blog.spec.ts`, which Task 2 extends.

- [ ] **Step 1: Write the tests** in `e2e/hidden-blog.spec.ts`

```ts
import { test, expect, type Page } from '@playwright/test'

// Expected values are copied from docs/product/features/portfolio-home/spec.md and the
// E1-S7 design, not imported from data/, so a typo there fails the test.

const POSTS = ['/blog/help-apollo-is-changing-my-query-response', '/blog/taking-ownership']
const TAGS = [
  'apollo', 'apollo-client', 'react', 'graphql', 'cache',
  'software', 'development', 'ownership', 'team-work', 'quality',
]
const TAG_PAGES = TAGS.map((tag) => `/tags/${tag}`)
const BLOG_PAGES = [...POSTS, '/blog', '/blog/page/1', '/tags', ...TAG_PAGES]

// Paths on this site that the page links to, whether the href is relative or absolute.
const linkedPaths = async (page: Page) => {
  const hrefs = await page.locator('a[href]').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).href)
  )
  const hosts = [new URL(page.url()).host, 'everas.dev']
  return hrefs
    .map((href) => new URL(href))
    .filter((url) => hosts.includes(url.host))
    .map((url) => url.pathname)
}

for (const path of POSTS) {
  test(`FR-12 ${path} returns 200`, async ({ page }) => {
    expect((await page.goto(path))?.status()).toBe(200)
  })
}

for (const path of BLOG_PAGES) {
  test(`FR-12 ${path} is noindex`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('meta[name="robots"]')).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    await expect(page.locator('meta[name="googlebot"]')).toHaveCount(0)
  })
}

for (const path of ['/', '/about']) {
  test(`${path} stays indexable`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  })
}

test('FR-12 no tag page advertises a tag feed', async ({ page }) => {
  for (const path of TAG_PAGES) {
    await page.goto(path)
    await expect(page.locator('link[rel="alternate"][href*="/tags/"]')).toHaveCount(0)
  }
})

test('tag pages keep their canonical URL', async ({ page }) => {
  await page.goto('/tags/team-work')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://everas.dev/tags/team-work'
  )
})

for (const path of ['/', '/about', '/no-such-page']) {
  test(`FR-12 ${path} has no link into the blog`, async ({ page }) => {
    await page.goto(path)
    const paths = await linkedPaths(page)
    expect(paths).toContain('/about')
    expect(paths.filter((p) => /^\/(blog|tags)(\/|$)/.test(p))).toEqual([])
  })
}

// A post may link to the previous or next post, but not to the blog's lists.
for (const path of POSTS) {
  test(`FR-12 ${path} has no link to the blog index or tags`, async ({ page }) => {
    await page.goto(path)
    const paths = await linkedPaths(page)
    expect(paths).toContain('/about')
    expect(paths.filter((p) => /^\/(blog\/?$|blog\/page(\/|$)|tags(\/|$))/.test(p))).toEqual([])
  })
}

test('robots.txt lets crawlers read noindex', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Allow: /')
  expect(robots).not.toContain('Disallow')
})
```

Run `yarn prettier --write e2e/hidden-blog.spec.ts` to apply the project's formatting.

- [ ] **Step 2: Run the tests against the current build**

Run: `yarn build && APP_PORT=3107 yarn test:e2e e2e/hidden-blog.spec.ts`
Expected: 16 fail (15 `is noindex`, 1 tag feed), 11 pass.

- [ ] **Step 3: Add `robots: { index: false }` to the five page files**

- `app/blog/[...slug]/page.tsx`: a key in the object `generateMetadata` returns.
- `app/blog/page.tsx` and `app/tags/page.tsx`: an argument to `genPageMetadata` (it spreads extra keys).
- `app/blog/page/[page]/page.tsx`: a new `export const metadata: Metadata = { robots: { index: false } }`, with `Metadata` imported from `next`.
- `app/tags/[tag]/page.tsx`: an argument to `genPageMetadata`. In the same call, reduce `alternates` to `{ canonical: './' }`. The `siteMetadata` import stays (the description uses it).

- [ ] **Step 4: Run the tests, lint and type check**

Run: `yarn build && APP_PORT=3107 yarn test:e2e e2e/hidden-blog.spec.ts`
Expected: 27 pass.
Run both Global Constraints checks. Expected: no errors.

- [ ] **Step 5: Commit** `feat(routes): noindex blog and tag pages, drop the tag feed link`
  (the six files above)

### Task 2: Sitemap with only `/` and `/about`

**Files:**
- Modify: `app/sitemap.ts`, `e2e/hidden-blog.spec.ts`, `docs/product/roadmap.md` (E1-S7 `status`)

**Interfaces:**
- Consumes: `e2e/hidden-blog.spec.ts` from Task 1.

- [ ] **Step 1: Write the failing test** at the end of `e2e/hidden-blog.spec.ts`

```ts
test('FR-14 sitemap lists only / and /about', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  expect(urls).toEqual(['https://everas.dev/', 'https://everas.dev/about'])
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `APP_PORT=3107 yarn test:e2e e2e/hidden-blog.spec.ts -g FR-14`
Expected: FAIL, the received list also has the two post URLs.

- [ ] **Step 3: Remove the post entries from `sitemap(): MetadataRoute.Sitemap`**

Delete `blogRoutes` and the `allBlogs` import. The header-link routes stay as they are.

- [ ] **Step 4: Run the story's verify, the full suite, lint and type check**

Run: `yarn build && APP_PORT=3107 yarn test:e2e e2e/hidden-blog.spec.ts`
Expected: 28 pass.
Run: `APP_PORT=3107 yarn test:e2e`
Expected: 91 pass.
Run both Global Constraints checks. Expected: no errors.
Run: `git status --short`. Expected: only this task's files (`app/tag-data.json` unchanged).

- [ ] **Step 5: Mark the story done and commit**

Set E1-S7 `status: done` in `docs/product/roadmap.md`, then commit the three files:
`feat(routes): list only home and about in the sitemap, mark E1-S7 done`.
