import { test, expect } from "@playwright/test"

test("homepage parallax moves with scroll and keeps navigation usable", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()
  const portrait = page.locator(".hero-portrait")
  const initial = await portrait.evaluate(el => getComputedStyle(el).transform)
  await page.evaluate(() => window.scrollTo(0, 350))
  await expect.poll(() => portrait.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial)
  await page.getByRole("link", { name: "EXPLORE WORK", exact: true }).click()
  await expect(page.locator("#portfolio")).toBeInViewport()
})

test("homepage fits small screens and disables parallax for reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Karthik Lal", exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.evaluate(() => window.scrollTo(0, 300))
  await expect(page.locator(".hero-portrait")).toHaveCSS("transform", "none")
  await expect(page.locator(".hero-word > span").first()).toHaveCSS("animation-name", "none")
})

test("mobile hero keeps the portrait beside the name with actions below", async ({ page }) => {
  for (const width of [320, 390, 430, 639]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/")
    await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()
    const name = await page.locator(".hero-name").boundingBox()
    const portrait = await page.locator(".hero-portrait").boundingBox()
    const actions = await page.locator(".hero-actions").boundingBox()
    expect(name).not.toBeNull()
    expect(portrait).not.toBeNull()
    expect(actions).not.toBeNull()
    expect(portrait!.x).toBeGreaterThanOrEqual(name!.x + name!.width)
    expect(portrait!.y).toBeLessThan(name!.y + name!.height)
    expect(portrait!.y + portrait!.height).toBeGreaterThan(name!.y)
    expect(actions!.y).toBeGreaterThan(portrait!.y + portrait!.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 390) await page.screenshot({ path: "/tmp/karthik-mobile-fixed.png" })
  }
})
