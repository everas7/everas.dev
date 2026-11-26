import { test, expect, type Page } from '@playwright/test'

// Expected values are copied from docs/product/features/portfolio-home/spec.md and the
// E1-S7 design, not imported from data/, so a typo there fails the test.

const POSTS = ['/blog/help-apollo-is-changing-my-query-response', '/blog/taking-ownership']
const TAGS = [
  'apollo',
  'apollo-client',
  'react',
  'graphql',
  'cache',
  'software',
  'development',
  'ownership',
  'team-work',
  'quality',
]
const TAG_PAGES = TAGS.map((tag) => `/tags/${tag}`)
const BLOG_PAGES = [...POSTS, '/blog', '/blog/page/1', '/tags', ...TAG_PAGES]

// Paths on this site that the page links to, whether the href is relative or absolute.
const linkedPaths = async (page: Page) => {
  const hrefs = await page
    .locator('a[href]')
    .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href))
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

test('FR-14 sitemap lists only / and /about', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  expect(urls).toEqual(['https://everas.dev/', 'https://everas.dev/about'])
})
