import { makeStyles } from '@fluentui/react-components'
import { FC, memo, ReactNode } from 'react'

interface IStackProps {
  children?: ReactNode
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: 'auto',
    height: 'auto',
    boxSizing: 'border-box',
    '> *': {
      textOverflow: 'ellipsis',
    },
    '> :not(:first-child)': {
      marginTop: '0px',
    },
    '> *:not(.ms-StackItem)': {
      flexShrink: 1,
    },
  },
})

export const Stack: FC<IStackProps> = memo(({ children }) => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      {children}
    </div>
  )
})

Stack.displayName = 'Stack'
