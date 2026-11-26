import { existsSync, readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'

test('FR-15 the newsletter endpoint is gone', async ({ request }) => {
  expect((await request.get('/api/newsletter')).status()).toBe(404)
  const post = await request.post('/api/newsletter', { data: { email: 'a@example.com' } })
  expect(post.status()).toBe(404)
})

test('FR-16 the projects page is gone', async ({ page }) => {
  const response = await page.goto('/projects')
  expect(response?.status()).toBe(404)
  await expect(page.locator('header').getByRole('link', { name: 'About' }).first()).toBeAttached()
})

for (const [path, status] of [
  ['/', 200],
  ['/about', 200],
  ['/blog', 200],
  ['/blog/page/1', 200],
  ['/blog/help-apollo-is-changing-my-query-response', 200],
  ['/blog/taking-ownership', 200],
  ['/tags', 200],
  ['/tags/apollo', 200],
  ['/no-such-page', 404],
] as const) {
  test(`FR-15 ${path} renders without a form`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(status)
    // Posts have their own <footer>; the site footer comes last.
    await expect(page.locator('footer').last()).toBeVisible()
    await expect(page.locator('form')).toHaveCount(0)
  })
}

test('FR-15 no newsletter or Mastodon configuration is left', () => {
  expect(readFileSync('.env.example', 'utf8')).not.toMatch(
    /MAILCHIMP|BUTTONDOWN|CONVERTKIT|KLAVIYO|REVUE|EMAILOCTOPUS/
  )
  expect(readFileSync('data/siteMetadata.js', 'utf8')).not.toMatch(/^\s*(newsletter|mastodon):/m)
})

test('FR-16 the starter projects data is gone', () => {
  expect(existsSync('data/projectsData.ts')).toBe(false)
})
