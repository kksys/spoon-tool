import { FC, memo, ReactNode, useCallback } from "react";
import { useObservable } from "react-use";

import { diContainer } from "~/inversify.config";

import { crossCuttingTypes } from "#/cross-cutting/di/crossCuttingTypes";
import { IDrawerViewModel } from "#/cross-cutting/interfaces/IDrawerViewModel";

import { DrawerMenu } from "../drawer-menu/DrawerMenu";
import { Flex } from "../flex/Flex";
import { Header } from "../header/Header";

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
      style={{ width: '100vw', height: '100vh', position: 'fixed' }}
    >
      <Flex
        direction='column'
        style={{ width: '100vw', height: '100vh' }}
      >
        <Header
          isDrawerOpen={open}
          onDrawerVisibilityChanged={handleChangedOpen}
        />
        <Flex
          direction="row"
          grow={true}
        >
          <DrawerMenu
            open={open}
            onOpenChanged={handleChangedOpen}
          />
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
})

Layout.displayName = 'Layout'