import { test, expect } from "@playwright/test"

test("hero flower follows the orbit while navigation remains usable", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()

  const marker = page.locator(".studio-orbit-marker g")
  const markerPosition = () => marker.evaluate((element) => getComputedStyle(element).transform)
  const initialPosition = await markerPosition()

  await page.evaluate(() => window.scrollTo(0, 350))
  await expect.poll(markerPosition).not.toBe(initialPosition)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(markerPosition).toBe(initialPosition)

  await page.getByRole("link", { name: "EXPLORE WORK", exact: true }).click()
  await expect(page.locator("#portfolio")).toBeInViewport()
})

test("desktop portrait reveals its color on hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()

  const image = page.locator(".studio-portrait img")
  await expect(image).toHaveCSS("filter", /grayscale\(1\)/)
  await page.locator(".studio-portrait-wrap").hover()
  await expect(image).toHaveCSS("filter", "grayscale(0) contrast(1)")
})

test("reduced motion keeps the hero stable", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const marker = page.locator(".studio-orbit-marker g")
  const initialPosition = await marker.evaluate((element) => getComputedStyle(element).transform)
  await page.evaluate(() => window.scrollTo(0, 300))
  await expect(marker).toHaveCSS("transform", initialPosition)
  const transitionDuration = await page.locator(".studio-portrait").evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration))
  expect(transitionDuration).toBeLessThan(.001)
})

test("mobile hero keeps a full-width portrait behind readable content", async ({ page }) => {
  for (const width of [320, 390, 430, 600]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/")
    await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()

    const name = await page.locator(".studio-copy h1").boundingBox()
    const portrait = await page.locator(".studio-portrait").boundingBox()
    const actions = await page.locator(".hero-actions").boundingBox()
    expect(name).not.toBeNull()
    expect(portrait).not.toBeNull()
    expect(actions).not.toBeNull()
    expect(portrait!.width).toBeGreaterThanOrEqual(width)
    expect(portrait!.y).toBeLessThan(name!.y + name!.height)
    expect(portrait!.y + portrait!.height).toBeGreaterThan(name!.y)
    expect(actions!.y).toBeGreaterThan(name!.y + name!.height)
    await expect(page.getByRole("link", { name: "EXPLORE WORK", exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
