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
    await expect(footer.locator('.footer-marquee')).toHaveCSS('animation-name', 'none')
    await footer.screenshot({ path: `/tmp/refined-footer-${width}.png` })
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole('navigation', { name: 'Portfolio chapters' }).getByRole('link', { name: 'Hello', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('four featured reviews precede a clipped, moving footer wordmark', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  const cards = page.locator('.review-card')
  await expect(cards).toHaveCount(4)
  await expect(cards.first()).toHaveCSS('position', 'sticky')
  await page.locator('.review-cards').evaluate(deck => window.scrollBy(0, deck.getBoundingClientRect().top - innerHeight * .65))
  const first = await cards.first().boundingBox()
  const second = await cards.nth(1).boundingBox()
  expect(second!.y).toBeLessThan(first!.y + first!.height)
  await page.locator('.review-layout').evaluate(layout => window.scrollBy(0, layout.getBoundingClientRect().top - 140))
  await page.screenshot({ path: '/tmp/client-feedback-desktop.png' })
  const mark = page.locator('.footer-wordmark')
  const offset = () => mark.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)
  await mark.evaluate(el => window.scrollBy(0, el.getBoundingClientRect().top - innerHeight + 32))
  await expect.poll(offset).toBeGreaterThan(1)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect.poll(offset).toBeLessThan(1)
  const track = page.locator('.footer-marquee')
  const position = () => track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)
  const initial = await position()
  await expect.poll(position).not.toBe(initial)
})
