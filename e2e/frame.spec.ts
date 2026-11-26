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

test.describe('FR-17 mobile menu', () => {
  test.use({ viewport: { width: 400, height: 800 } })

  const menu = (page: Page) => page.locator('#mobile-menu')
  const menuLink = (page: Page, name: string) => menu(page).getByRole('link', { name, exact: true })
  const opener = (page: Page) => page.getByRole('button', { name: 'Open menu' })
  const closer = (page: Page) => page.getByRole('button', { name: 'Close menu' })
  const overflow = (page: Page) =>
    expect.poll(() => page.evaluate(() => document.body.style.overflow))
  const focusInMenu = (page: Page) =>
    page.evaluate(() => !!document.activeElement?.closest('#mobile-menu'))

  const expectClosed = async (page: Page) => {
    await expect(menu(page)).toHaveAttribute('aria-hidden', 'true')
    await expect(menu(page)).toBeHidden()
    await overflow(page).toBe('')
  }
  const openMenu = async (page: Page) => {
    await opener(page).click()
    await expect(closer(page)).toBeFocused()
  }

  test.beforeEach(async ({ page }) => {
    // The menu doesn't need the badge frame, and page load shouldn't wait on a third party.
    await page.route('**://www.credly.com/**', (route) => route.abort())
    await page.goto('/')
    await hydrated(page)
  })

  test('closed menu is out of reach', async ({ page }) => {
    await expectClosed(page)
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      expect(await focusInMenu(page)).toBe(false)
    }
  })

  test('open menu takes the focus', async ({ page }) => {
    await opener(page).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    await expect(menu(page)).toHaveAttribute('aria-hidden', 'false')
    await expect(closer(page)).toBeFocused()
    await expect(page.locator('button[aria-label="Open menu"]')).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    await overflow(page).toBe('hidden')
  })

  test('focus stays inside the open menu', async ({ page }) => {
    await openMenu(page)
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab')
      expect(await focusInMenu(page)).toBe(true)
    }
    await expect(closer(page)).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(menuLink(page, 'Résumé')).toBeFocused()
  })

  test('Tab after tapping blank space returns to the menu', async ({ page }) => {
    await openMenu(page)
    await page.mouse.click(200, 750)
    await page.keyboard.press('Tab')
    expect(await focusInMenu(page)).toBe(true)
  })

  test('Escape closes the menu', async ({ page }) => {
    await openMenu(page)
    await page.keyboard.press('Escape')
    await expectClosed(page)
    await expect(opener(page)).toBeFocused()
  })

  test('Escape does nothing when the menu is closed', async ({ page }) => {
    const theme = page.getByRole('button', { name: 'Toggle Dark Mode' })
    await theme.focus()
    await page.keyboard.press('Escape')
    await expect(theme).toBeFocused()
  })

  test('close button closes the menu', async ({ page }) => {
    await openMenu(page)
    await closer(page).click()
    await expectClosed(page)
    await expect(opener(page)).toBeFocused()
  })

  test('a link closes the menu', async ({ page }) => {
    await openMenu(page)
    await menuLink(page, 'About').click()
    await expect(page).toHaveURL(/\/about$/)
    await expectClosed(page)
    await expect(opener(page)).toBeFocused()
  })

  test('the current page link closes the menu', async ({ page }) => {
    await openMenu(page)
    await menuLink(page, 'Home').click()
    await expectClosed(page)
  })

  test('Résumé opens the PDF and closes the menu', async ({ page, context }) => {
    await context.route('**/static/resume.pdf', (route) =>
      route.fulfill({ contentType: 'text/html', body: 'pdf' })
    )
    await openMenu(page)
    const popupPromise = page.waitForEvent('popup')
    await menuLink(page, 'Résumé').click()
    const popup = await popupPromise
    await popup.waitForURL(/\/static\/resume\.pdf$/)
    await page.bringToFront()
    await expectClosed(page)
    await expect(opener(page)).toBeFocused()
  })

  test('browser Back closes the menu', async ({ page }) => {
    await openMenu(page)
    await menuLink(page, 'About').click()
    await expect(page).toHaveURL(/\/about$/)
    await expectClosed(page)
    await openMenu(page)
    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
    await expectClosed(page)
  })

  test('widening the window closes the menu', async ({ page }) => {
    await openMenu(page)
    await page.setViewportSize({ width: 800, height: 800 })
    await expectClosed(page)
  })
})
