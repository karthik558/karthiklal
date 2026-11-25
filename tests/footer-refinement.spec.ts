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
    await expect(footer.getByRole('link', { name: 'Karthik Lal home' })).toBeVisible()
    const logo = (await footer.locator('.contact-signature').boundingBox())!
    const email = (await footer.locator('.footer-email').boundingBox())!
    expect(email.y).toBeGreaterThan(logo.y + logo.height)
    const groups = footer.locator('.footer-marquee span')
    expect(await groups.evaluateAll(items => items.map(item => getComputedStyle(item).webkitTextStrokeWidth)))
      .toEqual(['0px', '1px', '0px', '1px', '0px', '1px', '0px', '1px'])
    expect((await groups.first().boundingBox())!.width).toBeLessThan(width)
    expect(await footer.locator('.footer-marquee').evaluate(el => el.scrollWidth / 2)).toBeGreaterThanOrEqual(width)
    const mark = (await footer.locator('.footer-wordmark-mask').boundingBox())!
    expect(Math.abs(mark.y + mark.height - 1000)).toBeLessThanOrEqual(1)
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
  await expect(page.locator('.review-controls')).toHaveCSS('border-top-width', '0px')
  await expect(cards.first()).toHaveCSS('position', 'sticky')
  await page.locator('.review-cards').evaluate(deck => window.scrollBy(0, deck.getBoundingClientRect().top - innerHeight * .65))
  const first = await cards.first().boundingBox()
  const second = await cards.nth(1).boundingBox()
  expect(second!.y).toBeLessThan(first!.y + first!.height)
  await page.locator('.review-layout').evaluate(layout => window.scrollBy(0, layout.getBoundingClientRect().top - 140))
  await page.screenshot({ path: '/tmp/client-feedback-desktop.png' })
  const footer = page.locator('.editorial-footer')
  const main = page.locator('#main-content')
  await main.evaluate(el => window.scrollBy(0, el.getBoundingClientRect().bottom - innerHeight + 60))
  const initialTop = (await footer.boundingBox())!.y
  const initialEdge = (await main.boundingBox())!
  expect(initialTop).toBeLessThan(initialEdge.y + initialEdge.height)
  await page.evaluate(() => window.scrollBy(0, 90))
  const edge = (await main.boundingBox())!
  expect(initialEdge.y - edge.y).toBeCloseTo(90, 0)
  expect((await footer.boundingBox())!.y).toBeCloseTo(initialTop, 0)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const finalEdge = (await main.boundingBox())!
  expect(finalEdge.y + finalEdge.height).toBeCloseTo((await footer.boundingBox())!.y, 0)
  const track = page.locator('.footer-marquee')
  const position = () => track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)
  const initial = await position()
  await expect.poll(position).not.toBe(initial)
})

test('a footer taller than the phone screen can be read from top to bottom', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 })
  await page.goto('/contact')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  const footer = page.locator('.editorial-footer')
  await page.locator('main').evaluate(el => window.scrollBy(0, el.getBoundingClientRect().bottom))
  const logo = footer.locator('.contact-signature')
  await expect(logo).toBeInViewport()
  expect(await logo.evaluate(el => {
    const box = el.getBoundingClientRect()
    return el.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2))
  })).toBeTruthy()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(footer.locator('.footer-wordmark-mask')).toBeInViewport()
})
