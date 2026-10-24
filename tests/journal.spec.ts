import { expect, test } from '@playwright/test'

test('journal search, empty state and article contents work', async ({ page }) => {
  await page.goto('/blog')
  const search = page.getByRole('textbox', { name: 'Search articles or tags' })
  await search.fill('no-such-article-7291')
  await expect(page.getByText('No notes on that. Yet.')).toBeVisible()
  await page.getByRole('button', { name: 'RESET FILTERS' }).click()
  await expect(search).toHaveValue('')
  await search.fill('Rust')
  await expect(page.locator('.journal-grid article').first()).toBeVisible()
  await page.locator('.journal-grid article h3 a').first().click()
  await expect(page.locator('main h1')).toHaveCount(1)
  const contents = page.getByRole('navigation', { name: 'Table of contents' })
  const anchor = contents.locator('a').first()
  const href = await anchor.getAttribute('href')
  await anchor.click()
  await expect(page.locator(href!)).toBeInViewport()
  await expect(page.locator('.article-related a')).toHaveCount(2)
})

test('new layouts fit mobile and support reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const route of ['/', '/blog', '/blog/rust-crypt-aes-argon2-file-encryption']) {
    await page.goto(route)
    await expect(page.locator('main h1')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  }
})
