import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { FC, memo, ReactNode, useMemo } from 'react'

import { generateCssVar } from '#/cross-cutting/utils/generateCssVar'

interface IStackProps {
  children?: ReactNode | undefined
  horizontal?: boolean | undefined
  gap?: number | undefined
  className?: string | undefined
}

const gapCssVar = generateCssVar()

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
  horizontal: {
    flexDirection: 'row',
  },
  gap: {
    '> *': {
      margin: `var(${gapCssVar})`,
    },
  },
})

export const Stack: FC<IStackProps> = memo(({ children, horizontal, gap, className }) => {
  const styles = useStyles()
  const gapStyle = useMemo(() => ({
    [gapCssVar]: `${gap}px`
  }), [gap])

  return (
    <div
      className={ mergeClasses(
        styles.root,
        horizontal ? styles.horizontal : undefined,
        gap !== undefined ? styles.gap : undefined,
        className
      ) }
      style={ gapStyle }
    >
      {children}
    </div>
  )
})

Stack.displayName = 'Stack'
