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

function usePreferedTheme(): 'light' | 'dark' {
  const convertToTheme = (isDark: boolean) => isDark ? 'dark' : 'light'
  const [preferedTheme, updatePreferedTheme] = useState<'light' | 'dark'>(convertToTheme(mediaQueryList.matches))

  useEffect(() => {
    function handlePrefersColorSchemeChange(event: MediaQueryListEvent) {
      updatePreferedTheme(convertToTheme(event.matches))
    }

    mediaQueryList.addEventListener('change', handlePrefersColorSchemeChange)
    return () => {
      mediaQueryList.removeEventListener('change', handlePrefersColorSchemeChange)
    }
  }, [])

  return preferedTheme
}

function useTheme(defaultThemeType: IConfiguration['theme']): [Theme, (themeType: IConfiguration['theme']) => void] {
  const preferedTheme = usePreferedTheme()
  const getTheme = useCallback((themeType: IConfiguration['theme']): Theme => {
    switch (themeType) {
    case 'system':
      return getTheme(preferedTheme)
    case 'dark':
      return webDarkTheme
    case 'light':
      return webLightTheme
    }
  }, [preferedTheme])
  const [themeType, setThemeType] = useState(defaultThemeType)
  const [theme, setTheme] = useState<Theme>(getTheme(defaultThemeType))

  useEffect(() => {
    setTheme(getTheme(themeType))
  }, [getTheme, preferedTheme, themeType])

  return [
    theme,
    (themeType) => {
      setThemeType(themeType)
      setTheme(getTheme(themeType))
    }
  ]
}

function App() {
  const { t, i18n } = useTranslation()
  const eventAggregator = diContainer.get<IEventAggregator>(crossCuttingTypes.EventAggregator)
  const configurationRepository = diContainer.get<IConfigurationRepository>(configurationTypes.ConfigurationRepository)
  const [theme, setTheme] = useTheme(configurationRepository.getTheme())

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
        i18n.changeLanguage(configurationRepository.getLanguage())
      })

    return () => {
      subscription.unsubscribe()
    }
  })

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
        setTheme(configurationRepository.getTheme())
      })

    return () => {
      subscription.unsubscribe()
    }
  })

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
    <FluentProvider theme={theme}>
      <RouterProvider router={router} />
    </FluentProvider>
  )
}

export default App
