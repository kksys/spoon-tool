import { makeStyles } from '@fluentui/react-components'
import { FC, memo, ReactNode } from 'react'

interface IStackItemProps {
  children?: ReactNode
}

const useStyles = makeStyles({
  item: {
    height: 'auto',
    width: 'auto',
    flexShrink: 1,
  },
})

export const StackItem: FC<IStackItemProps> = memo(({ children }) => {
  const styles = useStyles()

  return (
    <div className={styles.item}>
      {children}
    </div>
  )
})

StackItem.displayName = 'StackItem'
