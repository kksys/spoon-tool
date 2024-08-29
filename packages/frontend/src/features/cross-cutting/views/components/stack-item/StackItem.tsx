import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { FC, memo, ReactNode } from 'react'

interface IStackItemProps {
  children?: ReactNode | undefined
  grow?: boolean | undefined
  className?: string | undefined
}

const useStyles = makeStyles({
  item: {
    height: 'auto',
    width: 'auto',
    flexShrink: 1,
  },
  grow: {
    flexGrow: 1,
  },
})

export const StackItem: FC<IStackItemProps> = memo(({ children, grow, className }) => {
  const styles = useStyles()

  return (
    <div className={ mergeClasses(
      styles.item,
      grow ? styles.grow : undefined,
      className
    ) }
    >
      {children}
    </div>
  )
})

StackItem.displayName = 'StackItem'
