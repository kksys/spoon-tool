import { expect, test } from '@playwright/test'

// E2E test for user search functionality
test('search user', async ({ page }) => {
  await page.routeFromHAR('./test/e2e/hars/api.har', {
    url: 'http://localhost:8787/**/*',
    update: false,
  })

  await page.goto('http://localhost:5173/')
  await page.evaluate(() => {
    localStorage.setItem('configuration', JSON.stringify({ language: 'en-US', theme: 'dark' }))
  })
  await page.reload()

  await expect(page.getByTestId('search-user-list'))
    .toBeVisible()
  // Wait a moment for the component to be fully loaded
  await page.waitForTimeout(1000)
  
  await expect(page.getByTestId('search-user-item.310748409'))
    .toHaveCount(0)
  
  await page.getByPlaceholder('Target user name')
    .fill('kksys')
  await page.getByRole('button', { name: 'Search' })
    .click()

  await expect(page.getByTestId('search-user-item.310748409'))
    .toHaveCount(1)
  await page.getByTestId('search-user-item.310748409')
    .click()

  await expect(page.getByTestId('user-detail-dialog.nickname'))
    .toHaveText('kksys 𖦞²‬ƅ̋ ᗦ↞◃ᜊч‪')
  await expect(page.getByTestId('user-detail-dialog.tag'))
    .toHaveText('@kksys512')
  await expect(page.getByTestId('user-detail-dialog.number-of-followers'))
    .toHaveText('257 Followers')
  await expect(page.getByTestId('user-detail-dialog.number-of-following'))
    .toHaveText('613 Following')
  await expect(page.getByTestId('user-detail-dialog.joined-date-time'))
    .toHaveText('Joined Date and Time: 7/19/2019, 11:09:58 PM')

  await page.getByLabel('close')
    .click()
})
