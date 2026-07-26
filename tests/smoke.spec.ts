import { expect, test } from "@playwright/test"

test("home page renders its primary content", async ({ page }) => {
  await page.goto("/")
  const preloader = page.getByRole("status", { name: "Loading website" })
  await expect(preloader).toBeVisible()
  await expect(preloader).toBeHidden({ timeout: 5_000 })
  await page.getByRole("button", { name: "Light mode" }).click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(page.locator("html")).not.toHaveClass(/theme-transitioning/)
  await page.getByRole("button", { name: "Dark mode" }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(page.locator("html")).not.toHaveClass(/theme-transitioning/)
  await expect(page.locator("h1").first()).toBeVisible()
  await expect(page.locator("h1").first()).toContainText("KARTHIK")
  await expect(page.locator("#portfolio")).toBeAttached()
  await expect(page.locator("#certifications article")).toHaveCount(3)

  const fullStackService = page.getByRole("button", { name: /Full Stack Web Development/ })
  await fullStackService.click()
  await expect(fullStackService).toHaveAttribute("aria-expanded", "true")
  await expect(page.locator("#service-details-2")).toBeVisible()
  await fullStackService.click()
  await expect(fullStackService).toHaveAttribute("aria-expanded", "false")
  await expect(page.locator("#service-details-2")).toBeHidden()
})

test("key public routes load without server errors", async ({ page }) => {
  for (const route of ["/projects", "/blog", "/contact"]) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBeLessThan(500)
    await expect(page.locator("main").first()).toBeVisible()
  }
})

test("contact and footer expose the complete social profile set", async ({ page }) => {
  await page.goto("/contact")

  for (const social of ["GITHUB", "LINKEDIN", "INSTAGRAM", "FACEBOOK", "X / TWITTER", "BEHANCE"]) {
    await expect(page.getByRole("link", { name: social, exact: true })).toHaveCount(2)
  }
})

test("GitHub-sourced project articles are published with repository links", async ({ page }) => {
  for (const slug of [
    "github-burner-ai-profile-analysis",
    "rust-crypt-aes-argon2-file-encryption",
    "guestit-portal-hospitality-support-workflows",
    "invoicely-studio-private-browser-invoicing",
  ]) {
    const response = await page.goto(`/blog/${slug}`)
    expect(response?.status(), slug).toBe(200)
    await expect(page.getByRole("link", { name: "View source repository" })).toBeVisible()
  }
})

test("project and blog client navigation has no failed RSC requests", async ({ page }) => {
  const failedRscRequests: string[] = []

  page.on("response", (response) => {
    if (response.url().includes("_rsc=") && response.status() >= 400) {
      failedRscRequests.push(`${response.status()} ${response.url()}`)
    }
  })

  await page.goto("/projects")
  await page.locator('a[href="/projects/1"]').first().click()
  await expect(page).toHaveURL(/\/projects\/1$/)
  await expect(page.locator("main h1")).toBeVisible()

  await page.goto("/blog")
  await page.locator('a[href="/blog/kernel-development-for-developers"]').first().click()
  await expect(page).toHaveURL(/\/blog\/kernel-development-for-developers$/)
  await expect(page.locator("main h1")).toBeVisible()

  expect(failedRscRequests).toEqual([])
})

test("project discovery state survives a case-study visit", async ({ page }) => {
  await page.goto("/projects")

  const firstTechnologyLabel = page.locator("main article").first().locator("span").first()
  await expect(firstTechnologyLabel).toHaveClass(/border/)
  await expect(firstTechnologyLabel).not.toHaveClass(/rounded-full/)

  const securityFilter = page.getByRole("button", { name: "Security Tools", exact: true })
  await securityFilter.click()
  await expect(securityFilter).toHaveAttribute("aria-pressed", "true")

  const search = page.getByRole("textbox", { name: "Search projects by name or technology" })
  await search.fill("Rust")
  await expect(page.getByText(/projects? found/i)).toBeVisible()

  await page.goto("/projects/1")
  await page.goBack()

  await expect(search).toHaveValue("Rust")
  await expect(securityFilter).toHaveAttribute("aria-pressed", "true")
})

test("mobile navigation supports keyboard access and focus restoration", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden({ timeout: 5_000 })

  const hero = page.locator("#home")
  for (const social of ["GitHub", "LinkedIn", "Instagram", "Facebook"]) {
    await expect(hero.getByRole("link", { name: social, exact: true })).toBeVisible()
  }
  for (const social of ["Email", "X", "Behance"]) {
    await expect(hero.getByRole("link", { name: social, exact: true })).toHaveCount(0)
  }

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

test("desktop custom cursor keeps the SVG and uses motion-only interaction states", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden({ timeout: 5_000 })

  await page.mouse.move(220, 220)
  const svgCursor = page.getByTestId("svg-cursor")
  const cursorLayer = page.locator(".custom-cursor-layer")
  await expect(svgCursor).toBeVisible()
  await expect(svgCursor).toHaveCSS("background-image", /cursor\/cursor\.svg/)

  const workLink = page.getByRole("link", { name: "EXPLORE WORK", exact: true })
  await workLink.hover()
  await expect(svgCursor).toBeVisible()
  await expect(cursorLayer).toHaveAttribute("data-cursor-state", "link")
  await expect(page.getByTestId("cursor-halo")).toBeVisible()
  await expect(cursorLayer).not.toContainText(/View|Open|Select/)

  await page.goto("/contact")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden({ timeout: 5_000 })
  const subjectField = page.getByLabel("PROJECT TYPE *", { exact: true })
  await subjectField.hover()
  await expect(cursorLayer).toHaveAttribute("data-cursor-state", "select")

  const nameField = page.getByLabel("YOUR NAME *", { exact: true })
  await nameField.hover()
  await expect(cursorLayer).toHaveAttribute("data-cursor-state", "text")
  await expect(page.getByTestId("cursor-text-indicator")).toHaveCount(0)
  await expect(svgCursor).toBeVisible()

  await page.mouse.down()
  await expect(cursorLayer).toHaveAttribute("data-pressed", "true")
  await page.mouse.up()
  await expect(cursorLayer).toHaveAttribute("data-pressed", "false")
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

test("featured design and case-study interactions remain functional", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("status", { name: "Loading website" })).toBeHidden({ timeout: 5_000 })

  await expect(page.locator("#principles")).toBeAttached()
  await page.getByRole("button", { name: /Performance is a feature/i }).click()
  await expect(page.locator("#principles").getByText("Progressive loading", { exact: false })).toBeVisible()

  const experience = page.locator("#experience")
  await expect(experience.getByText("2026", { exact: true }).first()).toBeVisible()
  await expect(experience.getByRole("button", { name: "Credentials" })).toHaveCount(0)
  await experience.getByRole("button", { name: "2026, selected; activate to show all years" }).click()
  await expect(experience.getByText("ALL YEARS", { exact: true })).toBeVisible()
  await expect(experience.locator("article")).toHaveCount(10)

  const certifications = page.locator("#certifications")
  await certifications.getByRole("button", { name: "Archived", exact: true }).click()
  await expect(certifications.getByRole("button", { name: "2021, selected; activate to show all years" })).toHaveAttribute("aria-pressed", "true")
  await expect(certifications.getByRole("heading", { name: "Certified Ethical Hacker (CEH)" })).toBeVisible()
  await certifications.getByRole("button", { name: "2021, selected; activate to show all years" }).click()
  await expect(certifications.getByText("ALL YEARS", { exact: true })).toBeVisible()

  await expect(page.getByRole("button", { name: "Open experience controls" })).toHaveCount(0)

  const interfaceFilter = page.getByRole("button", { name: "INTERFACE", exact: true })
  await interfaceFilter.click()
  await expect(interfaceFilter).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("heading", { name: "Creator Profile UI" })).toBeVisible()

  await page.goto("/projects/1")
  const xrayToggle = page.getByRole("button", { name: "X-Ray process off" })
  await xrayToggle.click()
  await expect(page.getByRole("button", { name: "X-Ray process on" })).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByText("X-RAY / COMPONENT LOGIC", { exact: true })).toBeVisible()
  await expect(page.getByText(/Project evidence/)).toBeVisible()
  await expect(page.getByRole("heading", { name: "Director's Notes" })).toBeVisible()
})
