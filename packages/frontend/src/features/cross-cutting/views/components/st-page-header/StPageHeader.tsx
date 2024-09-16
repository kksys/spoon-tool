import { Toolbar } from '@fluentui/react-components'
import { FC, memo, ReactNode } from 'react'

interface IStPageHeaderProps {
  children: ReactNode
}

export const StPageHeader: FC<IStPageHeaderProps> = memo(({ children }) => {
  return (
    <Toolbar style={ { minHeight: '36px' } }>
      { children }
    </Toolbar>
  )
})

StPageHeader.displayName = 'StPageHeader'
