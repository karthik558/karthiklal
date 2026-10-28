import { test, expect } from '@playwright/test'

test('footer links remain usable at desktop and phone widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    const footer = page.locator('.editorial-footer')
    await footer.scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    for (const link of await footer.getByRole('link').all()) {
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    }
    await expect(page.getByRole('link', { name: 'Back to top', exact: true })).toHaveCount(0)
    if (width <= 700) {
      const wordmark = await footer.locator('.footer-wordmark').boundingBox()
      expect(wordmark!.width / wordmark!.height).toBeCloseTo(1000 / 320, 1)
    }
    await footer.screenshot({ path: `/tmp/refined-footer-${width}.png` })
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole('navigation', { name: 'Portfolio chapters' }).getByRole('link', { name: 'Hello', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
