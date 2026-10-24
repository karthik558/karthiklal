import { expect, test } from '@playwright/test'

test('public pages share editorial titles, square controls, and the footer', async ({ page }) => {
  for (const route of ['/projects', '/blog', '/contact', '/stories', '/privacy-policy', '/terms', '/cookies', '/projects/1', '/blog/rust-crypt-aes-argon2-file-encryption']) {
    await page.goto(route)
    await expect(page.locator('main h1.editorial-heading')).toBeVisible()
    await expect(page.locator('.editorial-footer')).toBeAttached()
    await expect(page.locator('.nav-monogram')).toHaveCount(0)
  }
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  const nav = page.locator('.studio-navigation')
  const sound = nav.getByTestId('sound-toggle-btn')
  const theme = nav.getByRole('group', { name: 'Color theme' })
  await expect(sound).toHaveCSS('height', '30px')
  await expect(theme).toHaveCSS('height', '30px')
  await expect(nav).toHaveCSS('border-radius', '0px')
  await expect(page.locator('#portfolio .stack-card').first()).toHaveCSS('border-radius', '0px')
  await page.getByRole('button', { name: 'Light mode', exact: true }).click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('mobile public pages fit the screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['/contact', '/projects', '/stories', '/privacy-policy']) {
    await page.goto(route)
    await expect(page.locator('main h1.editorial-heading')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  }
})
