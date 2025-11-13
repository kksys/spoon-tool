import { defineConfig } from 'i18next-cli'

export default defineConfig({
  'locales': [
    'en-US',
    'ja-JP'
  ],
  'extract': {
    'input': 'src/**/*.{js,jsx,ts,tsx}',
    'output': 'src/locales/{{language}}/{{namespace}}.json',
    'defaultNS': 'common',
    'functions': [
      't',
      '*.t'
    ],
    'transComponents': [
      'Trans'
    ]
  },
  'types': {
    'input': [
      'locales/{{language}}/{{namespace}}.json'
    ],
    'output': 'src/types/i18next.d.ts'
  }
})