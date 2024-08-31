import jsEslint from '@eslint/js'
import StylisticPlugin from '@stylistic/eslint-plugin'
import StylisticJsPlugin from '@stylistic/eslint-plugin-js'
import ReactPlugin from 'eslint-plugin-react'
import ReactHooksPlugin from 'eslint-plugin-react-hooks'
import ReactRefreshPlugin from 'eslint-plugin-react-refresh'
import SimpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import typescriptEslintPlugin from 'typescript-eslint'

export default typescriptEslintPlugin.config(
  {
    files: ['**/*.{js,ts,mjs,mts,cjs,cts,jsx,tsx}'],
  },
  {
    ignores: ['**/dist/**'],
  },
  {
    extends: [
      jsEslint.configs.recommended,
      ...typescriptEslintPlugin.configs.strict,
      ...typescriptEslintPlugin.configs.stylistic,
    ],
  },
  // global configurations for all of sources
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
  },
  // global configurations for all of sources
  {
    rules: {
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: 'off',
    }
  },
  // global configurations for all of sources
  {
    plugins: {
      'simple-import-sort': SimpleImportSortPlugin,
      '@stylistic': StylisticPlugin,
      '@stylistic/js': StylisticJsPlugin,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Node.js builtins prefixed with `node:`.
            ['^node:'],
            // Packages.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^(?!~/|@/|#/)'],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^~/\\w', '^src/(?!assets/|features/)\\w'],
            ['^@/\\w', '^src/assets/\\w'],
            ['^#/\\w', '^src/features/\\w'],
            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: false,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        }
      ],
      '@stylistic/js/semi': ['error', 'never'],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
    },
  },
  // enable @typescript-eslint for TypeScript files
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-function': [
        'warn'
      ]
    },
  },
  // react configurations for tsx files
  {
    files: ['*.tsx'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react': ReactPlugin,
      'react-hooks': ReactHooksPlugin,
      'react-refresh': ReactRefreshPlugin,
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-one-expression-per-line': 'error',
      'react/jsx-wrap-multilines': ['error', { arrow: 'parens-new-line', return: 'parens-new-line', declaration: 'parens-new-line' }],
      'react/jsx-closing-bracket-location': 'error',
      'react/jsx-first-prop-new-line': 'error',
      'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    }
  },
)
