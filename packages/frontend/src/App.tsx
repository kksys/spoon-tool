import './App.css'

import { FluentProvider, Theme, webDarkTheme, webLightTheme } from '@fluentui/react-components'
import { ObjectTyped } from 'object-typed'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { filter } from 'rxjs'

import { AboutPage } from '#/about/views/pages/about-page/AboutPage'
import { LicensePage } from '#/about/views/pages/license-page/LicensePage'
import { RepositoryPage } from '#/about/views/pages/repository-page/RepositoryPage'
import { ConfigurationPage } from '#/configuration/views/pages/configuration-page/ConfigurationPage'
import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IEventAggregator } from '#/cross-cutting/interfaces/IEventAggregator'
import { Layout } from '#/cross-cutting/views/components/layout/Layout'
import { Page } from '#/cross-cutting/views/pages/Page'
import { SearchUserPage } from '#/search-user/views/pages/search-user-page/SearchUserPage'

import { configurationTypes } from './features/configuration/di/configurationTypes'
import { IConfiguration, IConfigurationRepository } from './features/cross-cutting/interfaces/IConfigurationRepository'
import { diContainer } from './inversify.config'

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
        path="/license"
        element={(
          <Layout>
            <LicensePage />
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

const mediaQueryList = matchMedia('(prefers-color-scheme: dark)')

function useTheme(defaultThemeType: Exclude<IConfiguration['theme'], 'system'>): [Theme, (themeType: Exclude<IConfiguration['theme'], 'system'>) => void] {
  const mapToTheme = useCallback((themeType: Exclude<IConfiguration['theme'], 'system'>): Theme => {
    switch (themeType) {
    case 'dark':
      return webDarkTheme
    case 'light':
      return webLightTheme
    }
  }, [])
  const [themeType, setThemeType] = useState(defaultThemeType)
  const [theme, setTheme] = useState<Theme>(mapToTheme(defaultThemeType))

  useEffect(() => {
    setTheme(mapToTheme(themeType))
  }, [mapToTheme, themeType])

  return [
    theme,
    (themeType) => {
      setThemeType(themeType)
    }
  ]
}

function useApplyingLanguage() {
  const { i18n } = useTranslation()
  const eventAggregator = diContainer.get<IEventAggregator>(crossCuttingTypes.EventAggregator)
  const configurationRepository = diContainer.get<IConfigurationRepository>(configurationTypes.ConfigurationRepository)

  useEffect(() => {
    const subscription = eventAggregator.subscriber$
      .pipe(
        filter(event => {
          switch (event.event) {
          case 'configurationChanged':
            return ObjectTyped.keys(event.data.changed)
              .includes('language')
          case 'configurationResetted':
            return true
          }
        })
      )
      .subscribe(() => {
        i18n.changeLanguage(configurationRepository.getCalculatedLanguage())
      })

    const handleLanguageChanged = () => {
      i18n.changeLanguage(configurationRepository.getCalculatedLanguage())
    }

    window.addEventListener('languagechange', handleLanguageChanged)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('languagechange', handleLanguageChanged)
    }
  })
}

function useApplyingTheme() {
  const eventAggregator = diContainer.get<IEventAggregator>(crossCuttingTypes.EventAggregator)
  const configurationRepository = diContainer.get<IConfigurationRepository>(configurationTypes.ConfigurationRepository)
  const [theme, setTheme] = useTheme(configurationRepository.getCalculatedTheme())

  useEffect(() => {
    const subscription = eventAggregator.subscriber$
      .pipe(
        filter(event => {
          switch (event.event) {
          case 'configurationChanged':
            return ObjectTyped.keys(event.data.changed)
              .includes('theme')
          case 'configurationResetted':
            return true
          }
        })
      )
      .subscribe(() => {
        setTheme(configurationRepository.getCalculatedTheme())
      })

    const handleThemeChanged = () => {
      setTheme(configurationRepository.getCalculatedTheme())
    }

    mediaQueryList.addEventListener('change', handleThemeChanged)

    return () => {
      subscription.unsubscribe()
      mediaQueryList.removeEventListener('change', handleThemeChanged)
    }
  })

  return theme
}

function useUpdatingLanguageOnOutOfReactWorld() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const handleLanguageChanged = async (language: typeof i18n.language) => {
      document.title = t('app.title')
      const html = document.querySelector('html')
      html?.setAttribute('lang', language)
      html?.setAttribute('translate', 'no')
    }

    handleLanguageChanged(i18n.language)

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n, t])
}

function App() {
  useApplyingLanguage()
  useUpdatingLanguageOnOutOfReactWorld()
  const theme = useApplyingTheme()

  return (
    <FluentProvider theme={theme}>
      <RouterProvider router={router} />
    </FluentProvider>
  )
}

export default App
