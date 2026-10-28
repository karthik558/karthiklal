import { test, expect } from '@playwright/test'
import data from '../public/data/blogs.json'

const latest = [...data.blogs].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

test('navigation stays visible and homepage chapters follow their numbering', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading website' })).toBeHidden()
  expect(await page.locator('main section[id]').evaluateAll(sections => sections.map(section => section.id))).toEqual([
    'home', 'about', 'principles', 'portfolio', 'services', 'skills', 'experience', 'certifications', 'journal', 'portfolio-gallery', 'testimonials',
  ])
  const chapters = await page.getByRole('navigation', { name: 'Portfolio chapters' }).locator('a').evaluateAll(links => links.map(link => document.querySelector(link.getAttribute('href')!)!.getBoundingClientRect().top + window.scrollY))
  expect(chapters).toEqual([...chapters].sort((a,b) => a-b))
  await page.evaluate(() => window.scrollTo(0, 900))
  const nav = page.getByRole('navigation', { name: 'Desktop navigation' })
  await expect(nav).toBeInViewport()
  await expect(nav.getByRole('link', { name: /DESIGNS/ })).toBeVisible()
  expect(await page.locator('#journal .journal-card').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(latest.slice(0,3).map(post => `/blog/${post.id}`))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const menu = page.getByRole('button', { name: 'Open menu' })
  await expect(menu).toBeInViewport()
  await menu.click()
  await expect(page.getByRole('dialog', { name: 'Main navigation' })).toBeVisible()
  await page.getByRole('button', { name: 'Close menu' }).click()
})

test('all blog articles appear newest first', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.locator('.journal-card time')).toHaveCount(latest.length)
  const dates = await page.locator('.journal-card time').evaluateAll(times => times.map(time => time.getAttribute('datetime')))
  expect(dates).toEqual(latest.map(post => post.date))
})
