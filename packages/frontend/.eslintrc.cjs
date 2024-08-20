module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort', 'react-refresh', '@stylistic/js'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],

    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': [
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
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-one-expression-per-line': 'error',
    'react/jsx-wrap-multilines': ['error', { arrow: 'parens-new-line', return: 'parens-new-line', declaration: 'parens-new-line' }],
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-first-prop-new-line': 'error',
    'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
  },
}
