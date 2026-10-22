import { test, expect } from '@playwright/test'

test('redesigned sections fit small screens and keep their content accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const gallery = page.locator('#portfolio-gallery')
    await gallery.scrollIntoViewIfNeeded()
    const title = gallery.getByRole('heading', { name: 'Island Diwali Celebration', exact: true })
    await expect(title).toBeVisible()
    expect(await title.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1)
    await expect(title).toHaveCSS('overflow', 'visible')
    await expect(title).toHaveCSS('-webkit-line-clamp', 'none')
    await expect.poll(() => gallery.locator('img').first().evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true)
    await expect(gallery.locator('img').first()).toHaveCSS('object-fit', 'contain')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 390 || width === 1440) {
      for (const id of ['portfolio-gallery', 'skills', 'services', 'principles']) {
        await page.locator('#' + id).scrollIntoViewIfNeeded()
        await page.locator('#' + id).screenshot({ path: `/tmp/redesign-${width}-${id}.png` })
      }
    }
  }
  await expect(page.locator('#principles article')).toHaveCount(3)
  const skills = page.locator('#skills')
  await skills.getByRole('button', { name: 'More tools — Programming Languages', exact: true }).click()
  await expect(skills.getByText('C · C++ · Bash · Shell Scripting', { exact: false })).toBeVisible()
  await expect(skills.getByText('PowerShell', { exact: false })).toBeVisible()
  await skills.getByRole('button', { name: 'Fewer tools — Programming Languages', exact: true }).click()
  await expect(skills.getByText('C · C++ · Bash · Shell Scripting', { exact: false })).toBeHidden()
  const services = page.locator('#services')
  const webService = services.getByRole('button', { name: 'Web development', exact: true })
  await webService.click()
  await expect(webService).toHaveAttribute('aria-expanded', 'true')
  await expect(services.getByRole('region', { name: 'Web development' })).toContainText('React & Next.js applications')
  await expect(services.getByRole('region', { name: 'Security & penetration testing' })).toHaveCount(0)
})

test('skill tools animate through intermediate heights when opening and closing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  const button = page.locator('#skills').getByRole('button', { name: 'More tools — Programming Languages', exact: true })
  await button.scrollIntoViewIfNeeded()
  const sampleToggle = () => page.evaluate(async () => {
    const trigger = document.querySelector<HTMLButtonElement>('[aria-controls="skill-tools-0"]')!
    trigger.click()
    await new Promise(requestAnimationFrame)
    const panel = document.getElementById('skill-tools-0')!
    const heights: number[] = []
    const start = performance.now()
    while (performance.now() - start < 500) {
      await new Promise(requestAnimationFrame)
      heights.push(panel.getBoundingClientRect().height)
    }
    return heights
  })
  const opening = await sampleToggle()
  const finalHeight = opening[opening.length - 1]
  expect(finalHeight).toBeGreaterThan(0)
  expect(opening.filter(height => height > 1 && height < finalHeight - 1).length).toBeGreaterThan(2)
  const closing = await sampleToggle()
  expect(closing.filter(height => height > 1 && height < finalHeight - 1).length).toBeGreaterThan(2)
  expect(closing[closing.length - 1]).toBe(0)
})
