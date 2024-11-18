import { expect,test } from '@playwright/test'

test('search user', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.evaluate(() => {
    localStorage.setItem('configuration', JSON.stringify({ language: 'en-US', theme: 'dark' }))
  })
  await page.reload()

  await expect(page.locator('.___15xayib_1ssujer > div > div:nth-child(2) > div'))
    .toBeEmpty()
  await page.getByPlaceholder('Target user name')
    .fill('kksys')
  await page.getByRole('button', { name: 'Search' })
    .click()

  await expect(page.locator('.___15xayib_1ssujer > div > div:nth-child(2) > div'))
    .not.toBeEmpty()
  await page.locator('div:nth-child(2) > div > div > div > .___k6aa400_9xyjtj0')
    .click()

  await expect(page.getByLabel('', { exact: true }))
    .toContainText('kksys 𖦞²‬ƅ̋ ᗦ↞◃ᜊч‪@kksys512251 Followers604 FollowingJoined Date and Time: 7/19/2019, 11:09:58 PMClose')
  await page.getByLabel('close')
    .click()
})
