import { test, expect } from "@playwright/test"

test("hero flower follows the orbit while navigation remains usable", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()

  const marker = page.locator(".studio-orbit-marker g").last()
  const markerPosition = () => marker.evaluate((element) => getComputedStyle(element).transform)
  const initialPosition = await markerPosition()

  await page.evaluate(() => window.scrollTo(0, 350))
  await expect.poll(markerPosition).not.toBe(initialPosition)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(markerPosition).toBe(initialPosition)

  await page.getByRole("link", { name: "EXPLORE WORK", exact: true }).click()
  await expect(page.locator("#portfolio")).toBeInViewport()
})

test("desktop portrait stays monochrome on hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()

  const image = page.locator(".studio-portrait img")
  await expect(image).toHaveCSS("filter", /grayscale\(1\)/)
  await page.locator(".studio-portrait-wrap").hover()
  await expect(image).toHaveCSS("filter", "grayscale(1) contrast(1.08)")
})

test("reduced motion keeps the hero stable", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const marker = page.locator(".studio-orbit-marker g").last()
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
    await expect(page.locator(".studio-copy")).toHaveCSS("color", "rgb(255, 255, 255)")
    await expect(page.locator(".studio-copy")).toHaveCSS("z-index", "2")
    await expect(page.locator(".studio-portrait-wrap")).toHaveCSS("z-index", "0")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test("about profile presents current role and personal details", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#about")

  const about = page.locator("#about")
  await expect(about.getByRole("heading", { name: /complex systems calm/i })).toBeVisible()
  await expect(about.getByText("IT MANAGER", { exact: true })).toBeVisible()
  await expect(about.getByText("26", { exact: true })).toBeVisible()
  await expect(about.getByRole("link", { name: "VIEW LINKEDIN PROFILE" })).toHaveAttribute("href", "https://www.linkedin.com/in/karthiklal/")
  const portrait = await about.locator(".about-profile-portrait").boundingBox()
  expect(portrait?.width).toBeLessThanOrEqual(351)
  expect(portrait?.height).toBeLessThanOrEqual(440)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test("homepage components reveal once and retain their hover behavior", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()

  const card = page.locator(".content-track-card").first()
  await expect(card).toHaveClass(/scroll-reveal/)
  await card.scrollIntoViewIfNeeded()
  await expect(card).toHaveClass(/reveal-arrived/)

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(card).toHaveClass(/reveal-arrived/)

  const journalCard = page.locator(".journal-card").first()
  await journalCard.scrollIntoViewIfNeeded()
  await expect(journalCard).toHaveClass(/reveal-arrived/)

  const footerColumn = page.locator(".footer-columns > *").first()
  await footerColumn.scrollIntoViewIfNeeded()
  await expect(footerColumn).toHaveClass(/reveal-arrived/)
})

test("top navigation tracks sections and project cards expose concise captions", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden()

  const sectionNav = page.getByRole("navigation", { name: "Desktop navigation" })
  await expect(sectionNav).toBeVisible()
  await sectionNav.getByRole("link", { name: /PROJECTS/ }).click()
  await expect(page.locator("#portfolio")).toBeInViewport()
  await expect(sectionNav.getByRole("link", { name: /PROJECTS/ })).toHaveAttribute("aria-current", "page")

  const firstProject = page.locator("#portfolio .stack-card").first()
  await expect(firstProject.getByRole("heading", { name: "RustPing" })).toBeVisible()
  await expect(firstProject.getByText("Software Development", { exact: true })).toBeVisible()
  await expect(firstProject.getByRole("link", { name: "LIVE", exact: true })).toBeVisible()
})
