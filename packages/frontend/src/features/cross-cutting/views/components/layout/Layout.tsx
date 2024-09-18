import { tokens } from '@fluentui/react-components'
import { FC, memo, ReactNode, useCallback } from 'react'
import { useObservable } from 'react-use'

import { diContainer } from '~/inversify.config'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IDrawerViewModel } from '#/cross-cutting/interfaces/view-models/IDrawerViewModel'

import { DrawerMenu } from '../drawer-menu/DrawerMenu'
import { Flex } from '../flex/Flex'
import { Header } from '../header/Header'

interface ILayoutProps {
  children: ReactNode
}

export const Layout: FC<ILayoutProps> = memo(({ children }) => {
  const drawerViewModel = diContainer.get<IDrawerViewModel>(crossCuttingTypes.DrawerViewModel)

  const open = useObservable(drawerViewModel.open$, false)

  const handleChangedOpen = useCallback((isOpen: boolean) => {
    drawerViewModel.updateOpen(isOpen)
  }, [drawerViewModel])

  return (
    <Flex
      direction='row'
      style={ { width: '100vw', height: '100dvh', position: 'fixed', backgroundColor: tokens.colorNeutralBackground4 } }
    >
      <Flex
        direction='column'
        style={ { width: '100vw', height: '100dvh' } }
      >
        <Header
          isDrawerOpen={ open }
          onDrawerVisibilityChanged={ handleChangedOpen }
        />
        <Flex
          direction="row"
          grow
        >
          <DrawerMenu
            open={ open }
            onOpenChanged={ handleChangedOpen }
          />
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
})

Layout.displayName = 'Layout'
