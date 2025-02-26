import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { configurationTypes } from './features/configuration/di/configurationTypes'
import { IConfigurationRepository } from './features/cross-cutting/interfaces/repositories/IConfigurationRepository'
import { defaultNS, languages, resources } from './i18n.resources'
import { diContainer } from './inversify.config'

async function main() {
  const configurationRepository = await diContainer.getAsync<IConfigurationRepository>(configurationTypes.ConfigurationRepository)

  await i18next
    .use(initReactI18next)
    .init({
      defaultNS,
      resources,
      lng: configurationRepository.getCalculatedLanguage(),
      fallbackLng: languages,
      supportedLngs: languages,
      interpolation: { escapeValue: false },
    })
}

main()
