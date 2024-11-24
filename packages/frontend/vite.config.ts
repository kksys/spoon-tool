import react from '@vitejs/plugin-react-swc'
import sanitizeHtml from 'sanitize-html'
import { defineConfig, Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

function htmlShrinkPlugin(): Plugin {
  const removeNewLinesAndSpaces = (html: string): string =>
    html.split('\n')
      .map((line) => line.trim())
      .join('')

  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      let result: string = html

      // remove all comments
      result = sanitizeHtml(html, {
        allowedTags: false, // Remove all tags
        allowedAttributes: false, // Remove all attributes
        allowVulnerableTags: true, // Allow script tags
        exclusiveFilter: (frame) => frame.tag === '!--' // Remove comments
      })

      // remove all newlines and spaces
      result = removeNewLinesAndSpaces(result)

      return result
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
  server: {
    host: true,
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
