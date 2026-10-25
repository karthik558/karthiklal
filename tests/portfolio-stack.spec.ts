import { expect, test } from '@playwright/test'

test('vertical collections scroll over images, filter, and dismiss previews', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  const work = page.locator('#portfolio')
  await expect(work.locator('.stack-card')).toHaveCount(4)
  await work.getByRole('button', { name: /SHOW ALL.*PROJECTS/ }).click()
  await expect(work.locator('.stack-card')).toHaveCount(10)
  await work.getByRole('button', { name: 'SHOW FEWER', exact: true }).click()
  await expect(work.locator('.stack-card')).toHaveCount(4)
  await expect(work.locator('.book-filters button[aria-pressed=true]')).toBeFocused()
  const artwork = work.locator('.book-art').first()
  await artwork.scrollIntoViewIfNeeded()
  await artwork.hover()
  const before = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 500)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 100)
  await work.evaluate(element => {
    const top = element.getBoundingClientRect().top + window.scrollY
    if (window.lenis) window.lenis.scrollTo(top, { immediate: true })
    else window.scrollTo(0, top)
  })
  await work.locator('.book-view').first().click()
  await expect(work.locator('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(work.locator('dialog')).not.toBeVisible()
  await expect(work.locator('.book-view').first()).toBeFocused()
  const designs = page.locator('#portfolio-gallery')
  await expect(designs.locator('.stack-card')).toHaveCount(4)
  await designs.getByRole('button', { name: /SHOW ALL.*DESIGNS/ }).click()
  expect(await designs.locator('.stack-card').count()).toBeGreaterThan(4)
  await designs.getByRole('button', { name: 'SHOW FEWER', exact: true }).click()
  await expect(designs.locator('.stack-card')).toHaveCount(4)
  await designs.getByRole('button', { name: 'INTERFACE', exact: true }).click()
  await expect(designs.getByRole('heading', { name: 'Creator Profile UI' })).toBeVisible()
  await designs.locator('.book-art').first().hover()
  const designBefore = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 450)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(designBefore + 100)
})

test('mobile cover, testimonial navigation, and text return link work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  await expect(page.locator('.studio-orbit-marker')).toBeHidden()
  const hero = await page.locator('#home').boundingBox()
  const image = await page.locator('.studio-portrait').boundingBox()
  expect(image?.width).toBe(390)
  expect(image?.height).toBe(hero?.height)
  const reviews = page.locator('#testimonials')
  const before = await reviews.locator('blockquote').textContent()
  await reviews.getByRole('button', { name: 'Next Testimonial' }).click()
  await expect(reviews.locator('blockquote')).not.toHaveText(before!)
  await page.getByRole('link', { name: 'Back to top', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
})


test('cards pin at the viewport edge and release on short screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  const first = page.locator('#portfolio .stack-card').first()
  await first.evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + 300))
  await expect.poll(async () => Math.round((await first.boundingBox())!.y)).toBe(96)
  await page.setViewportSize({ width: 1440, height: 400 })
  await expect(first).toHaveCSS('position', 'relative')
  await expect(first).toHaveCSS('top', '0px')
})


test('full-view previews retain a pointer and restore the custom cursor on close', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  for (const id of ['portfolio', 'portfolio-gallery']) {
    const section = page.locator(`#${id}`)
    await section.locator('.book-view').first().click()
    const dialog = section.locator('dialog')
    await expect(dialog).toBeVisible()
    await dialog.locator('.book-preview-image').hover()
    await expect(dialog.locator('.book-preview-image')).toHaveCSS('cursor', 'none')
    await expect(dialog.locator('.custom-cursor-layer')).toBeAttached()
    await expect(dialog.getByTestId('svg-cursor')).toHaveCSS('opacity', '1')
    await expect(dialog.getByRole('button', { name: 'Close preview' })).toHaveCSS('cursor', 'none')
    await dialog.getByRole('button', { name: 'Close preview' }).click()
    await expect(dialog).not.toBeVisible()
    await expect(page.locator('.custom-cursor-layer')).toHaveCSS('visibility', 'visible')
    await expect(section.locator('.book-view').first()).toBeFocused()
  }
})

test('mobile cards reveal their content before stacking', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  for (const id of ['portfolio', 'portfolio-gallery']) {
    const card = page.locator(`#${id} .stack-card`).first()
    await expect(card).toHaveCSS('position', 'sticky')
    const top = await card.evaluate(e => parseFloat(getComputedStyle(e).top))
    await card.evaluate((e, offset) => {
      const y = e.getBoundingClientRect().top + window.scrollY - offset + 20
      if (window.lenis) window.lenis.scrollTo(y, { immediate: true })
      else window.scrollTo(0, y)
    }, top)
    await expect.poll(async () => Math.round((await card.boundingBox())!.y)).toBe(Math.round(top))
    const box = await card.boundingBox()
    expect(box!.y + box!.height).toBeLessThanOrEqual(844)
  }
})


test('incoming artwork smoothly scales the pinned card and reduced motion disables stacking', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  for (const id of ['portfolio', 'portfolio-gallery']) {
    const cards = page.locator(`#${id} .stack-card`)
    await cards.nth(1).evaluate(element => {
      const y = element.getBoundingClientRect().top + window.scrollY - 360
      if (window.lenis) window.lenis.scrollTo(y, { immediate: true })
      else window.scrollTo(0, y)
    })
    await expect.poll(() => cards.first().evaluate(element => Number(element.style.getPropertyValue('--stack-scale')))).toBeLessThan(.99)
    await expect(cards.first()).toHaveCSS('position', 'sticky')
    const first = await cards.first().boundingBox()
    const second = await cards.nth(1).boundingBox()
    expect(second!.y).toBeLessThan(first!.y + first!.height)
    await expect(cards.first().locator('img')).toHaveCSS('object-fit', 'cover')
    await expect(cards.first().locator('img')).toHaveCSS('filter', 'none')
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('#portfolio .stack-card').first()).toHaveCSS('position', 'relative')
  await expect(page.locator('#portfolio .stack-card').first().locator('.stack-card-surface')).toHaveCSS('transform', 'none')
})
