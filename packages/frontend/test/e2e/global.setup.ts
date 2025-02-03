import { chromium, firefox, FullConfig, webkit } from '@playwright/test'

type BrowserName = 'chromium' | 'firefox' | 'webkit';

export default async function globalSetup(config: FullConfig) {
  for (const project of config.projects) {
    const { browserName } = project.use
    const browserType = ((browserName: BrowserName) => {
      return {
        chromium: chromium,
        firefox: firefox,
        webkit: webkit,
      }[browserName]
    })(browserName || 'chromium')

    const browser = await browserType.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('http://localhost:5173/')

    await context.close()
  }
}
