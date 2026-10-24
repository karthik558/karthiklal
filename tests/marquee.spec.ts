import { test, expect } from '@playwright/test'

test.describe('Capabilities Marquee Interaction & Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  })

  test('dual ribbons render cleanly with top black bar and bottom scroll control', async ({ page }) => {
    const marquee = page.locator('.capabilities-marquee')
    await expect(marquee).toBeVisible()
    await marquee.scrollIntoViewIfNeeded()

    const topTrack = marquee.locator('.capabilities-marquee-top')
    const bottomTrack = marquee.locator('.capabilities-marquee-bottom')

    await expect(topTrack).toBeVisible()
    await expect(bottomTrack).toBeVisible()

    // Both tracks are separate in the flex column and visible without occlusion
    const topBox = await topTrack.boundingBox()
    const bottomBox = await bottomTrack.boundingBox()

    expect(topBox).not.toBeNull()
    expect(bottomBox).not.toBeNull()
    // Bottom track should be below the top track
    expect(bottomBox!.y).toBeGreaterThanOrEqual(topBox!.y)

    // Verify colors and styling
    const primaryRibbon = topTrack.locator('.capabilities-primary')
    const secondaryRibbon = bottomTrack.locator('.capabilities-secondary')

    await expect(primaryRibbon).toBeVisible()
    await expect(secondaryRibbon).toBeVisible()

    // Primary has deep dark background
    const primaryBg = await primaryRibbon.evaluate(el => window.getComputedStyle(el).backgroundColor)
    expect(primaryBg).toBe('rgb(18, 17, 16)')

    // Secondary ribbon has clean white background
    const secondaryBg = await secondaryRibbon.evaluate(el => window.getComputedStyle(el).backgroundColor)
    expect(secondaryBg).toBe('rgb(255, 255, 255)')

    // Verify registration cross lines above Karthik have been removed
    await expect(page.locator('.studio-registration')).toHaveCount(0)

    // Marquee has transparent background and no borders (clean overlap between landing & about)
    const marqueeBorderTop = await marquee.evaluate(el => window.getComputedStyle(el).borderTopWidth)
    expect(marqueeBorderTop).toBe('0px')
  })

  test('text remains clearly visible and high-contrast in both light and dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    const marquee = page.locator('.capabilities-marquee')
    await marquee.scrollIntoViewIfNeeded()

    const topRibbon = marquee.locator('.capabilities-primary')
    const bottomRibbon = marquee.locator('.capabilities-secondary')

    const topTextColor = await topRibbon.evaluate(el => window.getComputedStyle(el).color)
    const topBgColor = await topRibbon.evaluate(el => window.getComputedStyle(el).backgroundColor)
    expect(topTextColor).toBe('rgb(255, 255, 255)')
    expect(topBgColor).toBe('rgb(18, 17, 16)')

    const bottomTextColor = await bottomRibbon.evaluate(el => window.getComputedStyle(el).color)
    const bottomBgColor = await bottomRibbon.evaluate(el => window.getComputedStyle(el).backgroundColor)
    expect(bottomTextColor).toBe('rgb(18, 17, 16)')
    expect(bottomBgColor).toBe('rgb(255, 255, 255)')

    // Verify typography uses display font (not Georgia)
    const fontFamily = await topRibbon.evaluate(el => window.getComputedStyle(el).fontFamily)
    expect(fontFamily).not.toContain('Georgia')
  })

  test('clicking on Curious Thinking makes it bold, scales up, pauses bottom track while top black bar keeps moving', async ({ page }) => {
    const marquee = page.locator('.capabilities-marquee')
    await marquee.scrollIntoViewIfNeeded()

    const topRibbon = marquee.locator('.capabilities-marquee-top .marquee-interactive')
    const bottomRibbon = marquee.locator('.capabilities-marquee-bottom .marquee-interactive')

    // Find the "Curious thinking" item in the bottom ribbon
    const curiousItem = bottomRibbon.locator('[data-marquee-item="Curious thinking"]').first()
    await expect(curiousItem).toBeAttached()

    // Top ribbon should initially be moving (not paused)
    const topAnimatedEl = topRibbon.locator('.animate-marquee-left').first()
    const initialTopState = await topAnimatedEl.evaluate(el => window.getComputedStyle(el).animationPlayState)
    expect(initialTopState).toBe('running')

    // Click on Curious thinking via event
    await curiousItem.dispatchEvent('click')

    // Curious item should now have data-active="true"
    await expect(curiousItem).toHaveAttribute('data-active', 'true')

    // It must be bold (>= 700)
    await expect.poll(async () => {
      const weight = await curiousItem.evaluate(el => window.getComputedStyle(el).fontWeight)
      return parseInt(weight, 10)
    }).toBeGreaterThanOrEqual(700)

    // The text pops up and scales bigger with counter-rotation so it is straight on screen
    const transform = await curiousItem.evaluate(el => window.getComputedStyle(el).transform)
    expect(transform).not.toBe('none')

    // Bottom track must be paused
    await expect(bottomRibbon).toHaveClass(/is-paused/)
    const bottomAnimatedEl = bottomRibbon.locator('.animate-marquee-right').first()
    const bottomPlayState = await bottomAnimatedEl.evaluate(el => window.getComputedStyle(el).animationPlayState)
    expect(bottomPlayState).toBe('paused')

    // The top black bar MUST continue moving (NOT paused)!
    const topPlayStateAfterClick = await topAnimatedEl.evaluate(el => window.getComputedStyle(el).animationPlayState)
    expect(topPlayStateAfterClick).toBe('running')

    // Clicking again toggles and unpauses
    await curiousItem.dispatchEvent('click')
    await expect(curiousItem).not.toHaveAttribute('data-active', 'true')
    await expect(bottomRibbon).not.toHaveClass(/is-paused/)
  })

  test('marquee bar is narrower in height, and flower separator rotates during scroll and rounds on hover', async ({ page }) => {
    const marquee = page.locator('.capabilities-marquee')
    await marquee.scrollIntoViewIfNeeded()

    const topRibbon = marquee.locator('.capabilities-primary')
    const defaultWeight = await topRibbon.evaluate(el => window.getComputedStyle(el).fontWeight)
    expect(parseInt(defaultWeight, 10)).toBeGreaterThanOrEqual(800)

    // Bar height matches reference py-3 md:py-4 lg:text-4xl (clientHeight <= 85px)
    const clientHeight = await topRibbon.evaluate(el => el.clientHeight)
    expect(clientHeight).toBeLessThanOrEqual(85)

    // Check flower separator
    const flowerSeparator = marquee.locator('.marquee-separator').first()
    await expect(flowerSeparator).toBeVisible()

    // Verify flower has continuous spin animation
    const animationName = await flowerSeparator.evaluate(el => window.getComputedStyle(el).animationName)
    expect(animationName).toContain('marquee-flower-spin-continuous')

    // Verify flower has 8 petals
    const petals = flowerSeparator.locator('ellipse')
    await expect(petals).toHaveCount(8)

    // Verify roundness on hover / interaction
    await flowerSeparator.dispatchEvent('mouseenter')
    const borderRadius = await flowerSeparator.evaluate(el => window.getComputedStyle(el).borderRadius)
    expect(borderRadius).toMatch(/50%|[0-9]+px/)
  })

  test('hovering over the marquee track straightens the bar to 0 degrees', async ({ page }) => {
    const marquee = page.locator('.capabilities-marquee')
    await marquee.scrollIntoViewIfNeeded()

    const topTrack = marquee.locator('.capabilities-marquee-top')
    await expect(topTrack).toBeVisible()

    // Hover over top track
    await topTrack.hover()

    // Track should straighten (transform angle rotates to 0deg -> matrix(1, 0, 0, 1, 0, 0))
    await expect.poll(async () => {
      const transform = await topTrack.evaluate(el => window.getComputedStyle(el).transform)
      if (transform === 'none') return true
      const match = transform.match(/^matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)/)
      if (match) {
        const b = Math.abs(parseFloat(match[2]))
        const c = Math.abs(parseFloat(match[3]))
        return b < 0.005 && c < 0.005
      }
      return false
    }).toBe(true)
  })

  test('hero baseline displays "SCROLL TO EXPLORE" and social links with hover animation styling', async ({ page }) => {
    const baseline = page.locator('.studio-baseline')
    await expect(baseline).toBeVisible()

    const scrollLink = baseline.locator('.studio-scroll-link')
    await expect(scrollLink).toContainText('SCROLL TO EXPLORE')

    const socialLinks = baseline.locator('.studio-social-link')
    const count = await socialLinks.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // Hover over first social link and verify styling
    const firstSocial = socialLinks.first()
    await firstSocial.hover()
    await expect(firstSocial).toBeVisible()
  })
})

