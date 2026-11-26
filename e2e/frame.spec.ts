import { test, expect, type Page } from '@playwright/test'

// Expected values are copied from docs/product/features/portfolio-home/spec.md and the
// E1-S5 design, not imported from data/, so a typo there fails the test.

const headerLinks = (page: Page) => page.locator('header a:not(#mobile-menu a)')
const menuLinks = (page: Page) => page.locator('#mobile-menu a')
// The theme switch renders after mount, so it marks the page as hydrated.
const hydrated = (page: Page) =>
  expect(page.getByRole('button', { name: 'Toggle Dark Mode' })).toBeVisible()

test('FR-11 header links to About and Résumé only', async ({ page }) => {
  await page.goto('/')
  await expect(headerLinks(page)).toHaveText(['everas.dev', 'About', 'Résumé'])
})

test('FR-11 menu links to Home, About and Résumé', async ({ page }) => {
  await page.goto('/')
  await expect(menuLinks(page)).toHaveText(['Home', 'About', 'Résumé'])
})

for (const [where, links] of [
  ['header', headerLinks],
  ['menu', menuLinks],
] as const) {
  test(`FR-8 ${where} résumé link opens the PDF and carries its event`, async ({ page }) => {
    await page.goto('/')
    const resume = links(page).filter({ hasText: 'Résumé' })
    await expect(resume).toHaveAttribute('href', '/static/resume.pdf')
    await expect(resume).toHaveAttribute('target', '_blank')
    await expect(resume).toHaveAttribute('rel', /noopener/)
    await expect(resume).toHaveAttribute('data-umami-event', 'resume')
    await expect(resume).toHaveAttribute('data-umami-event-where', where)
  })
}

test('sitemap lists the pages, not the résumé file', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  expect(xml).toContain('<loc>https://everas.dev/</loc>')
  expect(xml).toContain('<loc>https://everas.dev/about</loc>')
  expect(xml).not.toContain('resume.pdf')
})

test('FR-11 there is no search button or shortcut', async ({ page }) => {
  await page.goto('/')
  await hydrated(page)
  await expect(page.getByRole('button', { name: 'Search' })).toHaveCount(0)
  for (const shortcut of ['Meta+k', 'Control+k']) {
    await page.keyboard.press(shortcut)
    await page.waitForTimeout(500)
    await expect(page.locator('input')).toHaveCount(0)
  }
})
