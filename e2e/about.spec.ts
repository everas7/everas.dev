import { test, expect, type Page } from '@playwright/test'
import { profile } from '../data/profile'

// The page reads data/authors/default.mdx, so comparing it with data/profile.ts catches drift
// between the two. The bio is copied from ux.md "Microcopy".
const BIO = [
  "I'm a Senior Software Engineer at 2am.tech, where I've worked since April 2022. I build full-stack products in TypeScript and LLM systems in Python, with 8 years shipping React, Node.js and AWS.",
  "Most recently I built the RAG pipeline behind an AI sales assistant used by about 150 car dealerships. At 2am.tech I'm leading the rebuild of paperless document delivery for a Fortune 500 insurer. From 2021 to 2023 I also worked through Toptal, building event-driven integrations on AWS.",
  'I live in Santo Domingo, Dominican Republic, and work remotely with US Eastern overlap. I work in English (professional) and Spanish (native).',
]

const column = (page: Page) => page.getByTestId('profile-column')
const bio = (page: Page) => page.getByTestId('bio')

test('FR-9 photo column matches the profile', async ({ page }) => {
  await page.goto('/about')
  await expect(column(page).getByRole('heading', { level: 2 })).toHaveText(profile.name)
  await expect(column(page).getByText(profile.title, { exact: true })).toBeVisible()
  await expect(column(page).getByText(profile.employer.name, { exact: true })).toBeVisible()
})

test('FR-9 bio is the approved text', async ({ page }) => {
  await page.goto('/about')
  await expect(bio(page).locator('p')).toHaveText(BIO)
})

test('FR-9 bio agrees with the profile', async ({ page }) => {
  await page.goto('/about')
  const [month, year] = profile.employer.since.split(' ')
  const [toptal] = profile.pastRoles
  await expect(bio(page)).toContainText(`${profile.employer.role} at ${profile.employer.name}`)
  await expect(bio(page)).toContainText(new RegExp(`since ${month}\\w* ${year}`))
  await expect(bio(page)).toContainText(
    `From ${toptal.from.split(' ')[1]} to ${toptal.to.split(' ')[1]}`
  )
  await expect(bio(page)).toContainText(profile.location)
  await expect(bio(page)).toContainText(profile.workStyle.replace('Remote with ', ''))
  for (const language of profile.languages) {
    await expect(bio(page)).toContainText(language)
  }
})

test('FR-9 no old name or current freelancing', async ({ page }) => {
  await page.goto('/about')
  await expect(page.locator('main')).not.toContainText(/Vargas|freelanc/i)
})

test('FR-9 blog post metadata uses the new name', async ({ request }) => {
  const response = await request.get('/blog/taking-ownership')
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain(`"name":"${profile.name}"`)
  expect(html).not.toContain('Enmanuel Veras Vargas')
})

test('FR-9 one h1 and no skipped heading levels', async ({ page }) => {
  await page.goto('/about')
  const levels = await page
    .locator('h1, h2, h3, h4, h5, h6')
    .evaluateAll((els) => els.map((el) => Number(el.tagName[1])))
  expect(levels[0]).toBe(1)
  expect(levels.filter((level) => level === 1)).toHaveLength(1)
  levels.slice(1).forEach((level, i) => expect(level - levels[i]).toBeLessThanOrEqual(1))
})

test('FR-9 photo alt text names the person', async ({ page }) => {
  await page.goto('/about')
  await expect(column(page).locator('img')).toHaveAttribute('alt', profile.name)
})

test('no horizontal scroll at 400px', async ({ page }) => {
  await page.route('**://www.credly.com/**', (route) => route.abort())
  await page.setViewportSize({ width: 400, height: 800 })
  await page.goto('/about')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
