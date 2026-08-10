import { expect, test } from '@playwright/test'

test.describe('Lifeline', () => {
  test('keeps the vertical timeline readable and its media accessible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/timeline')

    const lifeline = page.getByRole('article', { name: /Laxman: from Chennai to building/ })
    await expect(lifeline).toBeVisible()
    await expect(lifeline.getByText('Age', { exact: true })).toBeVisible()
    await expect(lifeline.getByText('Years', { exact: true })).toBeVisible()
    await expect(lifeline.getByText('Now', { exact: true })).toBeVisible()

    const photo = lifeline.locator('[data-lifeline-interactive]').first()
    await expect(photo).toBeVisible()
    await photo.click({ position: { x: 12, y: 12 } })
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.mouse.wheel(0, 500)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  })
})
