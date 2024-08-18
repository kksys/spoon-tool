import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { CSSProperties, FC, memo, MouseEventHandler, ReactNode } from 'react'

interface IFlexProps {
  children?: ReactNode | undefined
  /**
   * customized style
   */
  style?: CSSProperties | undefined
  className?: string | undefined
  /**
   * `flexDirection` on CSSProperties
   * @default row
   */
  direction?: 'column' | 'row'
  grow?: boolean | undefined
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

export const Flex: FC<IFlexProps> = memo(({ children, style, className, direction, grow, onClick }) => {
  const styles = useStyles()
  const interpolatedDirection = direction || 'row'

  return (
    <div
      className={mergeClasses(styles.root, styles[interpolatedDirection], grow ? styles.grow : undefined, className)}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
})

Flex.displayName = 'Flex'
