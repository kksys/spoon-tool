import { makeStyles } from '@fluentui/react-components'
import { AppGeneric20Regular, DocumentBulletList20Filled, DocumentChevronDouble20Filled, Info20Filled } from '@fluentui/react-icons'
import { NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavProps } from '@fluentui/react-nav'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Flex } from '../flex/Flex'

interface IDrawerMenuProps {
  open: boolean
  onOpenChanged: (value: boolean) => void
}

function getDrawerMode(): 'inline' | 'overlay' {
  return window.innerWidth >= 1024 ? 'inline' : 'overlay'
}

const useStyle = makeStyles({
  spacerForHeader: {
    height: '68px'
  }
})

export const DrawerMenu: FC<IDrawerMenuProps> = memo(({ open, onOpenChanged }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const styles = useStyle()

  const [ drawerMode, setDrawerMode ] = useState<'inline' | 'overlay'>(getDrawerMode())
  const [ navItemSelect, setNavItemSelect ] = useState<'top' | 'configuration' | 'repository' | 'license' | 'about'>(() => {
    const currentRoute = location.pathname

    switch (currentRoute) {
    case '/configuration':
      return 'configuration'
    case '/repository':
      return 'repository'
    case '/license':
      return 'license'
    case '/about':
      return 'about'
    default:
      return 'top'
    }
  })

  const onNavItemSelect = useCallback<NonNullable<NavProps['onNavItemSelect']>>((_event, data) => {
    const selector = data.value

    if (!(selector === 'top' || selector === 'configuration' || selector === 'repository' || selector === 'license' || selector === 'about')) {
      return
    }

    setNavItemSelect(selector)

    // close menu
    if (getDrawerMode() === 'overlay') {
      onOpenChanged(false)
    }
  }, [onOpenChanged])

  useEffect(() => {
    const handleResize = (_event: UIEvent) => {
      setDrawerMode(getDrawerMode())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <NavDrawer
      type={ drawerMode }
      separator
      position="start"
      open={ open }
      onOpenChange={ (_, { open }) => onOpenChanged(open) }
      selectedValue={ navItemSelect }
      onNavItemSelect={ onNavItemSelect }
    >
      { drawerMode === 'overlay' && (
        <Flex
          direction='row'
          className={ styles.spacerForHeader }
        >
        </Flex>
      ) }
      <NavDrawerHeader>
      </NavDrawerHeader>
      <NavDrawerBody>
        <NavItem
          icon={ <AppGeneric20Regular /> }
          value="top"
          onClick={ () => navigate('/') }
        >
          { t('title.top', { ns: 'common' }) }
        </NavItem>
        <NavItem
          icon={ <DocumentChevronDouble20Filled /> }
          value="configuration"
          onClick={ () => navigate('/configuration') }
        >
          { t('title.configuration', { ns: 'common' }) }
        </NavItem>
        <NavItem
          icon={ <DocumentChevronDouble20Filled /> }
          value="repository"
          onClick={ () => navigate('/repository') }
        >
          { t('title.repository', { ns: 'common' }) }
        </NavItem>
        <NavItem
          icon={ <DocumentBulletList20Filled /> }
          value="license"
          onClick={ () => navigate('/license') }
        >
          { t('title.license', { ns: 'common' }) }
        </NavItem>
        <NavItem
          icon={ <Info20Filled /> }
          value="about"
          onClick={ () => navigate('/about') }
        >
          { t('title.about', { ns: 'common' }) }
        </NavItem>
      </NavDrawerBody>
    </NavDrawer>
  )
})

DrawerMenu.displayName = 'DrawerMenu'
