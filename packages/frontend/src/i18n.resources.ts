import { InitOptions, TFunction } from 'i18next'
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
export const defaultNS = 'translation' satisfies keyof typeof resources[typeof languages[number]]

declare module 'i18next' {
  type DefaultNS = typeof defaultNS

  interface CustomTypeOptions {
    defaultNS: DefaultNS
    resources: typeof resources[typeof languages[number]]
  }

  interface CustomInitOptions<T = object> extends Omit<InitOptions<T>, keyof CustomTypeOptions> {
    defaultNS: DefaultNS
    resources: typeof resources
  }

  interface i18n {
    // strongly typed init function
    init<T>(options: CustomInitOptions<T>, callback?: Callback): Promise<TFunction>

    language: typeof languages[number]
    languages: typeof languages
  }
}
