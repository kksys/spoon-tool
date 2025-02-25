import { expect, test } from '@playwright/test'

test('search user', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.evaluate(() => {
    localStorage.setItem('configuration', JSON.stringify({ language: 'en-US', theme: 'dark' }))
  })
  await page.reload()

  await expect(page.getByTestId('search-user-list')
    .locator('> div > div'))
    .toBeEmpty()
  await page.getByPlaceholder('Target user name')
    .fill('kksys')
  await page.getByRole('button', { name: 'Search' })
    .click()

  await expect(page.getByTestId('search-user-list')
    .locator('> div > div'))
    .not.toBeEmpty()
  await page.getByTestId('search-user-item.310748409')
    .click()

  await expect(page.getByTestId('user-detail-dialog.nickname'))
    .toHaveText('kksys 𖦞²‬ƅ̋ ᗦ↞◃ᜊч‪')
  await expect(page.getByTestId('user-detail-dialog.tag'))
    .toHaveText('@kksys512')
  await expect(page.getByTestId('user-detail-dialog.number-of-followers'))
    .toHaveText('254 Followers')
  await expect(page.getByTestId('user-detail-dialog.number-of-following'))
    .toHaveText('610 Following')
  await expect(page.getByTestId('user-detail-dialog.joined-date-time'))
    .toHaveText('Joined Date and Time: 7/19/2019, 11:09:58 PM')

  await page.getByLabel('close')
    .click()
})
