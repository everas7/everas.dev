import { test, expect, type Page } from '@playwright/test'

// Expected values are copied from docs/product/features/portfolio-home/spec.md and the
// E1-S2 design, not imported from data/profile.ts, so a typo there fails the test.
const CREDLY_SRC = 'https://www.credly.com/embedded_badge/523d4204-1cad-42fe-8a94-aa6aa6fa9966'
const CREDLY_URL = 'https://www.credly.com/badges/523d4204-1cad-42fe-8a94-aa6aa6fa9966'
const TOPTAL_URL = 'https://www.toptal.com/developers/resume/enmanuel-veras-vargas'

const PAGES = [
  ['/', 'home'],
  ['/about', 'about'],
] as const

const section = (page: Page) => page.getByTestId('credentials')
const credlyFrame = (page: Page) => section(page).locator('iframe')
const textLink = (page: Page, name: string) =>
  section(page).getByRole('link', { name, exact: true })

for (const [path, where] of PAGES) {
  test.describe(`credentials on ${path}`, () => {
    test('FR-5 both badges render', async ({ page }) => {
      await page.goto(path)
      await expect(
        page.getByRole('heading', { level: 2, name: 'Credentials', exact: true })
      ).toBeVisible()

      const frame = credlyFrame(page)
      await expect(frame).toHaveAttribute('src', CREDLY_SRC)
      await expect(frame).toHaveAttribute('title', 'View my verified achievement on Credly.')
      const box = await frame.boundingBox()
      expect(box).not.toBeNull()
      expect(Math.round(box!.width)).toBe(150)
      expect(Math.round(box!.height)).toBe(270)

      await expect(section(page).getByText('TOP 3% TALENT', { exact: true })).toBeVisible()
      const hire = textLink(page, 'Hire me')
      await expect(hire).toBeVisible()
      expect(await hire.getAttribute('href')).toMatch(new RegExp(`^${TOPTAL_URL}`))
    })

    test('FR-6 text links survive a blocked Credly host', async ({ page }) => {
      const typekit: string[] = []
      page.on('request', (r) => {
        if (r.url().includes('typekit.net')) typekit.push(r.url())
      })
      await page.route('**://www.credly.com/**', (route) => route.abort())
      await page.goto(path)

      const credly = textLink(page, 'Verify on Credly →')
      await expect(credly).toBeVisible()
      await expect(credly).toHaveAttribute('href', CREDLY_URL)
      const toptal = textLink(page, 'Toptal profile →')
      await expect(toptal).toBeVisible()
      await expect(toptal).toHaveAttribute('href', TOPTAL_URL)

      const slot = await page.getByTestId('credly-slot').boundingBox()
      expect(Math.round(slot!.width)).toBe(150)
      expect(Math.round(slot!.height)).toBe(270)
      expect(typekit).toEqual([])
    })

    test('FR-7 no CSP violations and no style leaks', async ({ page }) => {
      await page.addInitScript(() => {
        ;(window as unknown as { __csp: string[] }).__csp = []
        document.addEventListener('securitypolicyviolation', (e) =>
          (window as unknown as { __csp: string[] }).__csp.push(
            `${e.violatedDirective} ${e.blockedURI}`
          )
        )
      })
      await page.goto(path, { waitUntil: 'networkidle' })

      const result = await page.evaluate(() => ({
        csp: (window as unknown as { __csp: string[] }).__csp,
        rootVar: getComputedStyle(document.documentElement).getPropertyValue('--h'),
        bodyFont: getComputedStyle(document.body).fontFamily,
        bareClasses: document.querySelectorAll('.a, .b, .c, .d, .f, .h').length,
      }))
      expect(result.csp).toEqual([])
      expect(result.rootVar).toBe('')
      expect(result.bodyFont).toMatch(/Montserrat/i)
      expect(result.bareClasses).toBe(0)
    })

    test('FR-8 badge links carry Umami events', async ({ page }) => {
      await page.goto(path)
      for (const [name, event] of [
        ['Verify on Credly →', 'badge-claude'],
        ['Toptal profile →', 'badge-toptal'],
        ['Hire me', 'badge-toptal'],
      ] as const) {
        const link = textLink(page, name)
        await expect(link).toHaveAttribute('data-umami-event', event)
        await expect(link).toHaveAttribute('data-umami-event-where', where)
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', /noopener/)
      }
      await expect(textLink(page, 'Hire me')).toHaveAttribute('data-umami-event-via', 'badge')
    })

    test('no horizontal scroll at 400px', async ({ page }) => {
      await page.route('**://www.credly.com/**', (route) => route.abort())
      await page.setViewportSize({ width: 400, height: 800 })
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  })
}
