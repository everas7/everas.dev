import { readFileSync } from 'node:fs'
import { test, expect, type Page } from '@playwright/test'

// Expected values are copied from docs/product/features/portfolio-home/spec.md "Content" and
// the ux.md "Microcopy" meta lines, not imported from data/profile.ts, so a typo there fails.
const CARDS = [
  {
    title: 'AI Sales Assistant for Car Dealerships',
    meta: 'Contract · 2023–2025',
    description:
      'Built the RAG pipeline (Python, FastAPI, LangChain, OpenAI, Cohere). Parallelized the SQS worker, cutting the slowest messages from 3–5+ minutes to about 1 minute.',
  },
  {
    title: 'Paperless document delivery for a Fortune 500 insurer',
    meta: '2am.tech',
    description:
      'Leading the rebuild for 6 tenants. Reverse-engineered the legacy system and proposed a Node.js microservice that the architecture board approved. 15+ ADRs.',
  },
  {
    title: 'Event-driven consent sync on AWS',
    meta: 'Toptal',
    description:
      "Lambda, SQS, DynamoDB and Serverless Framework integrations syncing users' consent choices to clients' email, user management and analytics tools.",
  },
]

const section = (page: Page) => page.getByTestId('selected-work')
const cards = (page: Page) => section(page).locator(':scope > div > div')

test('FR-4 three cards match the content word for word, in order', async ({ page }) => {
  await page.goto('/')
  await expect(
    section(page).getByRole('heading', { level: 2, name: 'Selected work', exact: true })
  ).toBeVisible()
  await expect(section(page).locator('h3')).toHaveText(CARDS.map((c) => c.title))
  await expect(cards(page)).toHaveCount(CARDS.length)
  for (const [i, { title, meta, description }] of CARDS.entries()) {
    await expect(cards(page).nth(i).locator('h3, p')).toHaveText([title, meta, description])
  }
})

test('FR-4 cards have no links or images', async ({ page }) => {
  await page.goto('/')
  await expect(cards(page)).toHaveCount(CARDS.length)
  await expect(section(page).locator('a, img')).toHaveCount(0)
})

test('FR-4 no Projects section renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main h2')).toHaveText(['Selected work', 'Credentials'])
})

test('FR-4 the Projects section is in the source, commented out', () => {
  const source = readFileSync('app/Main.tsx', 'utf8')
  const comments = source.match(/\{\/\*[\s\S]*?\*\/\}/g) ?? []
  expect(comments.filter((c) => /<h2[^>]*>\s*Projects\s*<\/h2>/.test(c))).toHaveLength(1)
})

test('one h1 and no skipped heading levels', async ({ page }) => {
  await page.goto('/')
  await expect(section(page).locator('h3')).toHaveCount(CARDS.length)
  const levels = await page
    .locator('h1, h2, h3, h4, h5, h6')
    .evaluateAll((els) => els.map((el) => Number(el.tagName[1])))
  expect(levels[0]).toBe(1)
  expect(levels.filter((level) => level === 1)).toHaveLength(1)
  levels.slice(1).forEach((level, i) => expect(level - levels[i]).toBeLessThanOrEqual(1))
})

test('cards stack at full width, 24px apart', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await expect(cards(page)).toHaveCount(CARDS.length)
  const column = (await section(page).boundingBox())!
  // Measure the bordered box, so padding around it counts against the width.
  const boxes = await cards(page)
    .locator(':scope > div')
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()))
  expect(boxes).toHaveLength(CARDS.length)
  for (const box of boxes) {
    expect(Math.round(box.x)).toBe(Math.round(column.x))
    expect(Math.round(box.width)).toBe(Math.round(column.width))
  }
  boxes.slice(1).forEach((box, i) => expect(Math.round(box.y - boxes[i].bottom)).toBe(24))
})

test('card titles rank below the section heading', async ({ page }) => {
  await page.goto('/')
  const title = section(page).locator('h3').first()
  await expect(title).toHaveCSS('font-size', '18px')
  await expect(title).toHaveCSS('font-weight', '600')
  await expect(section(page).locator('h2')).toHaveCSS('font-size', '24px')
})

test('one divider separates the hero from Selected work', async ({ page }) => {
  await page.goto('/')
  await expect(section(page)).toHaveCSS('border-top-width', '1px')
  const credentials = page.locator('main section', { has: page.getByTestId('credentials') })
  await expect(credentials).toHaveCSS('border-top-width', '0px')
})

for (const width of [400, 1280]) {
  test(`hero links sit 32px above the divider at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    const link = page.locator('main').getByRole('link', { name: 'LinkedIn', exact: true })
    const linkBox = (await link.boundingBox())!
    const sectionBox = (await section(page).boundingBox())!
    expect(Math.round(sectionBox.y - (linkBox.y + linkBox.height))).toBe(32)
  })
}

test('no horizontal scroll at 400px', async ({ page }) => {
  await page.route('**://www.credly.com/**', (route) => route.abort())
  await page.setViewportSize({ width: 400, height: 800 })
  await page.goto('/')
  await expect(cards(page)).toHaveCount(CARDS.length)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
