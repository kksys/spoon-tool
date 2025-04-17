import { Dialog, DialogProps, DialogSurface, DialogSurfaceProps } from '@fluentui/react-components'
import { FC, memo, useMemo } from 'react'
import { useWindowSize } from 'react-use'

export interface IStDialogProps extends Omit<DialogProps, 'children'>, Pick<DialogSurfaceProps, 'children'> {
  surfaceStyle?: React.CSSProperties
}

export const StDialog: FC<IStDialogProps> = memo(({ children, surfaceStyle, ...props }) => {
  const { width } = useWindowSize()

  const dialogBaseWidth = 600
  const minimumColumnMargin = 60

  const maxWidth = useMemo(() => {
    return width > (dialogBaseWidth + minimumColumnMargin) ? `${dialogBaseWidth}px` : `calc(100% - ${minimumColumnMargin}px)`
  }, [width])

  return (
    <Dialog { ...props }>
      <DialogSurface style={ { maxWidth, ...surfaceStyle } }>
        { children }
      </DialogSurface>
    </Dialog>
  )
})

StDialog.displayName = 'StDialog'
