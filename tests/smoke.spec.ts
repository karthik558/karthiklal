import { expect, test } from "@playwright/test"

test("home page renders its primary content", async ({ page }) => {
  await page.goto("/")
  const preloader = page.getByRole("status", { name: "Loading website" })
  await expect(preloader).toBeVisible()
  await expect(preloader).toBeHidden({ timeout: 5_000 })
  await page.getByRole("button", { name: "Light mode" }).click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await page.getByRole("button", { name: "Dark mode" }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(page.locator("h1").first()).toBeVisible()
  await expect(page.locator("h1").first()).toContainText("KARTHIK")
  await expect(page.locator("#portfolio")).toBeAttached()
  await expect(page.locator("#certifications article")).toHaveCount(6)
})

test("key public routes load without server errors", async ({ page }) => {
  for (const route of ["/projects", "/blog", "/contact"]) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBeLessThan(500)
    await expect(page.locator("main").first()).toBeVisible()
  }
})

test("mobile navigation supports keyboard access and focus restoration", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden({ timeout: 5_000 })

  await page.keyboard.press("Tab")
  const skipLink = page.locator('a[href="#main-content"]', { hasText: "Skip to content" })
  await expect(skipLink).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#main-content")).toBeFocused()

  const menuButton = page.getByRole("button", { name: "Open menu" })
  await menuButton.click()
  const navigationDialog = page.getByRole("dialog", { name: "Main navigation" })
  await expect(navigationDialog).toBeVisible()
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(navigationDialog).toBeHidden()
  await expect(menuButton).toBeFocused()
})

test("health check and contact validation are available", async ({ request }) => {
  const health = await request.get("/api/health")
  expect(health.ok()).toBeTruthy()
  await expect(health.json()).resolves.toMatchObject({ status: "ok" })

  const invalidContact = await request.post("/api/contact", {
    data: { name: "", email: "invalid" },
  })
  expect(invalidContact.status()).toBe(400)

  const legacyVital = await request.post("/api/monitoring/vitals", {
    data: {
      id: "smoke-fid",
      name: "FID",
      value: 12,
      rating: "good",
      path: "/",
    },
  })
  expect(legacyVital.status()).toBe(204)
})

test("unknown routes show the not-found experience", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist")
  expect(response?.status()).toBe(404)
  await expect(page.getByText(/not found|404/i).first()).toBeVisible()
})
