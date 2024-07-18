import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { CSSProperties, FC, memo, MouseEventHandler, ReactNode } from 'react'

interface IFlexProps {
  children?: ReactNode
  /**
   * customized style
   */
  style?: CSSProperties
  /**
   * `flexDirection` on CSSProperties
   * @default row
   */
  direction?: 'column' | 'row'
  grow?: boolean
  /**
   * click handler if you want
   */
  onClick?: MouseEventHandler<never> | undefined
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: 'auto',
    height: 'auto',
    flexShrink: 1,
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  grow: {
    flexGrow: '1'
  },
  shrink: {
    flexShrink: '1'
  }
})

export const Flex: FC<IFlexProps> = memo(({ children, style, direction, grow, onClick }) => {
  const styles = useStyles()
  const interpolatedDirection = direction || 'row'

  return (
    <div
      className={mergeClasses(styles.root, styles[interpolatedDirection], grow ? styles.grow : undefined)}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
})

Flex.displayName = 'Flex'
