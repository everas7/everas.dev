import { test, expect, type Page } from '@playwright/test'

// Expected values are copied from docs/product/features/portfolio-home/spec.md "Content",
// not imported from data/profile.ts, so a typo there fails the test.
const NAME = 'Enmanuel Veras'
const ROLE = 'Senior Software Engineer'
const INTRO =
  'I build full-stack products in TypeScript and LLM systems in Python. 8 years shipping React, Node.js and AWS; most recently, the RAG pipeline behind an AI sales assistant used by ~150 car dealerships.'

const LINKS = [
  { name: 'Résumé (PDF) →', href: '/static/resume.pdf', event: 'resume' },
  { name: 'Email', href: 'mailto:enmaveras07@gmail.com', event: 'email' },
  { name: 'GitHub', href: 'https://github.com/everas7', event: 'github' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/everas7/', event: 'linkedin' },
] as const

const heroLink = (page: Page, name: string) =>
  page.locator('main').getByRole('link', { name, exact: true })

test.describe('FR-1 hero above the fold', () => {
  for (const { width, height } of [
    { width: 400, height: 800 },
    { width: 1280, height: 800 },
  ]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`${width}x${height} ${colorScheme}`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.emulateMedia({ colorScheme })
        await page.goto('/')

        const main = page.locator('main')
        const targets = [
          page.getByRole('heading', { level: 1, name: NAME, exact: true }),
          main.getByText(ROLE, { exact: true }),
          main.getByText(INTRO, { exact: true }),
          ...LINKS.map((l) => heroLink(page, l.name)),
        ]
        for (const target of targets) {
          await expect(target).toBeVisible()
          const box = await target.boundingBox()
          expect(box, 'element has a box').not.toBeNull()
          expect(box!.y + box!.height).toBeLessThanOrEqual(height)
        }
      })
    }
  }
})

test('FR-2 résumé link opens the PDF in a new tab', async ({ page, request }) => {
  await page.goto('/')
  const resume = heroLink(page, 'Résumé (PDF) →')
  await expect(resume).toHaveAttribute('href', '/static/resume.pdf')
  await expect(resume).toHaveAttribute('target', '_blank')
  await expect(resume).toHaveAttribute('rel', /noopener/)

  const response = await request.get('/static/resume.pdf')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
})

test('FR-3 contact links point at the right addresses', async ({ page }) => {
  await page.goto('/')
  await expect(heroLink(page, 'Email')).toHaveAttribute('href', 'mailto:enmaveras07@gmail.com')
  expect(await heroLink(page, 'Email').getAttribute('target')).toBeNull()
  await expect(heroLink(page, 'GitHub')).toHaveAttribute('href', 'https://github.com/everas7')
  await expect(heroLink(page, 'LinkedIn')).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/everas7/'
  )
})

test('FR-8 hero links carry Umami events', async ({ page }) => {
  await page.goto('/')
  for (const { name, event } of LINKS) {
    const link = heroLink(page, name)
    await expect(link).toHaveAttribute('data-umami-event', event)
    await expect(link).toHaveAttribute('data-umami-event-where', 'home')
  }
})

test('FR-15 home has no form', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('form')).toHaveCount(0)
})

test('no horizontal scroll at 400px', async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 800 })
  await page.goto('/')
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(scrollWidth).toBeLessThanOrEqual(400)
})

test('home loads without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(errors).toEqual([])
})
