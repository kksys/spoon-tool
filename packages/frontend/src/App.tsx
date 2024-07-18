import './App.css'

import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

import { AboutPage } from '#/about/views/pages/about-page/AboutPage'
import { RepositoryPage } from '#/about/views/pages/repository-page/RepositoryPage'
import { Layout } from '#/cross-cutting/views/components/layout/Layout'
import { Page } from '#/cross-cutting/views/pages/Page'
import { SearchUserPage } from '#/search-user/views/pages/search-user-page/SearchUserPage'

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
  const [prefersColorSchemeDark, updatePrefersColorSchemeDark] = useState(mediaQueryList.matches)

  useEffect(() => {
    function handlePrefersColorSchemeChange(event: MediaQueryListEvent) {
      updatePrefersColorSchemeDark(event.matches)
    }

    mediaQueryList.addEventListener('change', handlePrefersColorSchemeChange)
    return () => {
      mediaQueryList.removeEventListener('change', handlePrefersColorSchemeChange)
    }
  }, [])

  return (
    <FluentProvider theme={prefersColorSchemeDark ? webDarkTheme : webLightTheme}>
      <RouterProvider router={router} />
    </FluentProvider>
  )
}

export default App
