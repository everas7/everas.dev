import { test, expect, type Page } from '@playwright/test'
import { profile } from '../data/profile'

// data/siteMetadata.js can't import data/profile.ts, so comparing the descriptions with
// profile.intro catches drift between the two.
const HOME_TITLE = 'Enmanuel Veras – Senior Software Engineer'
const NAME = 'Enmanuel Veras'
const POST = '/blog/taking-ownership'
const POST_TITLE = 'Taking Ownership as a Developer'

const meta = (page: Page, key: string) =>
  page.locator(`head meta[name="${key}"], head meta[property="${key}"]`)

async function expectTitles(page: Page, title: string) {
  await expect(page).toHaveTitle(title)
  await expect(meta(page, 'og:title')).toHaveAttribute('content', title)
  await expect(meta(page, 'twitter:title')).toHaveAttribute('content', title)
  await expect(meta(page, 'og:site_name')).toHaveAttribute('content', NAME)
}

test('FR-10 home title and description', async ({ page }) => {
  await page.goto('/')
  await expectTitles(page, HOME_TITLE)
  await expect(meta(page, 'description')).toHaveAttribute('content', profile.intro)
  await expect(meta(page, 'og:description')).toHaveAttribute('content', profile.intro)
})

for (const [path, title] of [
  ['/about', 'About'],
  ['/blog', 'Blog'],
  ['/blog/page/1', 'Blog'],
  ['/tags', 'Tags'],
  ['/tags/react', 'react'],
]) {
  test(`FR-10 ${path} follows the title template`, async ({ page }) => {
    await page.goto(path)
    await expectTitles(page, `${title} | ${NAME}`)
    await expect(meta(page, 'description')).toHaveAttribute('content', profile.intro)
  })
}

test('FR-10 a post keeps its own preview title', async ({ page }) => {
  await page.goto(POST)
  await expect(page).toHaveTitle(`${POST_TITLE} | ${NAME}`)
  await expect(meta(page, 'og:title')).toHaveAttribute('content', POST_TITLE)
  await expect(meta(page, 'twitter:title')).toHaveAttribute('content', POST_TITLE)
  await expect(meta(page, 'og:site_name')).toHaveAttribute('content', NAME)
})

test('FR-10 tag description keeps the site name', async ({ page }) => {
  await page.goto('/tags/react')
  await expect(meta(page, 'og:description')).toHaveAttribute(
    'content',
    'everas.dev react tagged content'
  )
})

test('FR-10 header logo text stays', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header').getByText('everas.dev', { exact: true })).toBeVisible()
})

test('FR-10 title follows in-app navigation', async ({ page }) => {
  await page.goto('/')
  await page.locator('header').getByRole('link', { name: 'About', exact: true }).first().click()
  await expect(page).toHaveTitle(`About | ${NAME}`)
  await page.locator('header').getByRole('link', { name: 'everas.dev' }).click()
  await expect(page).toHaveTitle(HOME_TITLE)
})
