import { AppGeneric20Regular, DocumentChevronDouble20Filled, Info20Filled } from "@fluentui/react-icons"
import { NavDrawer, NavDrawerBody, NavItem,NavProps } from "@fluentui/react-nav-preview"
import { FC, memo, useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"

interface IDrawerMenuProps {
  open: boolean
  onOpenChanged: (value: boolean) => void
}

function getDrawerMode(): 'inline' | 'overlay' {
  return window.innerWidth >= 1024 ? 'inline' : 'overlay'
}

export const DrawerMenu: FC<IDrawerMenuProps> = memo(({ open, onOpenChanged }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('translation')
  const [ drawerMode, setDrawerMode ] = useState<'inline' | 'overlay'>(getDrawerMode())
  const [ navItemSelect, setNavItemSelect ] = useState<'top' | 'repository' | 'about'>(() => {
    const currentRoute = location.pathname

    switch (currentRoute) {
    case '/repository':
      return 'repository'
    case '/about':
      return 'about'
    default:
      return 'top'
    }
  })

  const onNavItemSelect = useCallback<NonNullable<NavProps['onNavItemSelect']>>((_event, data) => {
    const selector = data.value

    if (!(selector === 'top' || selector === 'repository' || selector === 'about')) {
      return
    }

    setNavItemSelect(selector)
  }, [])

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
      type={drawerMode}
      separator
      position="start"
      open={open}
      onOpenChange={(_, { open }) => onOpenChanged(open)}
      selectedValue={navItemSelect}
      onNavItemSelect={onNavItemSelect}
    >
      <NavDrawerBody>
        <NavItem
          icon={<AppGeneric20Regular />}
          value="top"
          onClick={() => navigate('/')}
        >
          { t('top.title') }
        </NavItem>
        <NavItem
          icon={<DocumentChevronDouble20Filled />}
          value="repository"
          onClick={() => navigate('/repository')}
        >
          { t('repository.title') }
        </NavItem>
        <NavItem
          icon={<Info20Filled />}
          value="about"
          onClick={() => navigate('/about')}
        >
          { t('about.title') }
        </NavItem>
      </NavDrawerBody>
    </NavDrawer>
  )
})

DrawerMenu.displayName = 'DrawerMenu'
