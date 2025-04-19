import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default defineConfig(ctx => mergeConfig(
  viteConfig(ctx),
  defineConfig({
    test: {
      setupFiles: [
        './test/vitest.setup.ts',
      ],
      exclude: [
        './test/e2e/**',
      ],
    },
  })
))
