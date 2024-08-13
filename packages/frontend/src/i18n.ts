import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { languages, resources } from './i18n.resources'

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja-JP',
    fallbackLng: languages,
    supportedLngs: languages,
    interpolation: { escapeValue: false },
  })
