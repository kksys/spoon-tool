import './App.css'

import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

import { AboutPage } from '#/about/views/pages/about-page/AboutPage'
import { RepositoryPage } from '#/about/views/pages/repository-page/RepositoryPage'
import { ConfigurationPage } from '#/configuration/views/pages/configuration-page/ConfigurationPage'
import { Layout } from '#/cross-cutting/views/components/layout/Layout'
import { Page } from '#/cross-cutting/views/pages/Page'
import { SearchUserPage } from '#/search-user/views/pages/search-user-page/SearchUserPage'

import { configurationTypes } from './features/configuration/di/configurationTypes'
import { IConfigurationRepository } from './features/cross-cutting/interfaces/IConfigurationRepository'
import { diContainer } from './inversify.config'

const mediaQueryList = matchMedia('(prefers-color-scheme: dark)')

const router = createBrowserRouter(
  createRoutesFromElements((
    <>
      <Route
        path="/"
        element={(
          <Layout>
            <SearchUserPage />
          </Layout>
        )}
      />
      <Route
        path="/configuration"
        element={(
          <Layout>
            <ConfigurationPage />
          </Layout>
        )}
      />
      <Route
        path="/repository"
        element={(
          <Layout>
            <RepositoryPage />
          </Layout>
        )}
      />
      <Route
        path="/about"
        element={(
          <Layout>
            <AboutPage />
          </Layout>
        )}
      />
      <Route
        path="*"
        element={(
          <Layout>
            <Page>
              NotFound
            </Page>
          </Layout>
        )}
      />
    </>
  ))
)

function App() {
  const { t, i18n } = useTranslation()
  const [prefersColorSchemeDark, updatePrefersColorSchemeDark] = useState(mediaQueryList.matches)
  const configurationRepository = diContainer.get<IConfigurationRepository>(configurationTypes.ConfigurationRepository)

  useEffect(() => {
    function handlePrefersColorSchemeChange(event: MediaQueryListEvent) {
      updatePrefersColorSchemeDark(event.matches)
    }

    mediaQueryList.addEventListener('change', handlePrefersColorSchemeChange)
    return () => {
      mediaQueryList.removeEventListener('change', handlePrefersColorSchemeChange)
    }
  }, [])

  useEffect(() => {
    const handleLanguageChanged = async (language: typeof i18n.language) => {
      document.title = t('app.title')
      const html = document.querySelector('html')
      html?.setAttribute('lang', language)
      html?.setAttribute('translate', 'no')

      if (configurationRepository.getLanguage() !== language) {
        configurationRepository.setLanguage(language)
        await configurationRepository.save()
      }
    }

    handleLanguageChanged(i18n.language)

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [configurationRepository, i18n, t])

  return (
    <FluentProvider theme={prefersColorSchemeDark ? webDarkTheme : webLightTheme}>
      <RouterProvider router={router} />
    </FluentProvider>
  )
}

export default App
