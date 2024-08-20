import { ObjectTyped } from 'object-typed'

import enCommon from './locales/en-US/translation.json'
import jaCommon from './locales/ja-JP/translation.json'

export const resources = {
  'en-US': {
    translation: enCommon
  },
  'ja-JP': {
    translation: jaCommon
  },
} as const

export const languages = ObjectTyped.keys(resources)

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: typeof resources[typeof languages[number]]
  }

  interface i18n {
    language: typeof languages[number]
    languages: typeof languages
  }
}
