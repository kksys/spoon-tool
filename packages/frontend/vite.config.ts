import react from '@vitejs/plugin-react-swc'
import { defineConfig, Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

function htmlShrinkPlugin(): Plugin {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html
        .replace(/<!-- .+ -->/g, '')
        .split('\n')
        .map((line) => line.trim())
        .join('')
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      tsDecorators: true,
    }),
    htmlShrinkPlugin(),
  ],
  esbuild: {
    target: 'es2020',
  },
  build: {
    target: 'es2020',
  },
  // TODO: fix it later, below is just workaround to avoid below error
  // `Parameter decorators only work when experimental decorators are enabled`
  // ref: https://github.com/vitejs/vite/issues/13736#issuecomment-1633592860
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
      },
    },
  },
})
