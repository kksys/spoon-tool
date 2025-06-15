import { makeStyles, Title2, Toolbar } from '@fluentui/react-components'
import { Hamburger } from '@fluentui/react-nav'
import { FC, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import { Flex } from '#/cross-cutting/views/components/flex/Flex'

interface IHeaderProps {
  isDrawerOpen: boolean
  onDrawerVisibilityChanged: (value: boolean) => void
}

const useStyles = makeStyles({
  toolbar: {
    minHeight: '60px'
  },
  title: {
    cursor: 'pointer',
    textWrap: 'nowrap'
  }
})

export const Header: FC<IHeaderProps> = memo(({ isDrawerOpen, onDrawerVisibilityChanged }) => {
  const styles = useStyles()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const onDrawerChanged = useCallback(() => {
    onDrawerVisibilityChanged(!isDrawerOpen)
  }, [isDrawerOpen, onDrawerVisibilityChanged])

  const handleTitleClick = useCallback(() => {
    if (location.pathname === '/') {
      return
    }

    navigate('/')
  }, [location, navigate])

  return (
    <Toolbar className={ styles.toolbar }>
      <Flex style={ { width: '100%', height: '36px', justifyContent: 'space-between', alignItems: 'center' } }>
        <Flex>
          <Hamburger
            size="large"
            onClick={ onDrawerChanged }
            aria-label="Toggle Navigation"
          />
        </Flex>

        <Flex>
          <Title2
            className={ styles.title }
            align="start"
            onClick={ handleTitleClick }
          >
            { t('title.app', { ns: 'common' }) }
          </Title2>
        </Flex>

        <Flex
          direction='row'
          grow
        />
      </Flex>
    </Toolbar>
  )
})

Header.displayName = 'Header'
