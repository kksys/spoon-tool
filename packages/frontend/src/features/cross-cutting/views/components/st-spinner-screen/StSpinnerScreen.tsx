import { makeStyles, Portal, Spinner, tokens } from '@fluentui/react-components'
import { FC, memo } from 'react'

const useStyles = makeStyles({
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: tokens.colorBackgroundOverlay,
  },
  contents: {
    position: 'fixed',
    inset: 0,
    margin: 'auto',
    width: 'fit-content',
    height: 'fit-content',
  },
  surface: {
    width: 'fit-content',
    height: 'fit-content',
  }
})

interface StSpinnerScreenProps {
  label: string
}

export const StSpinnerScreen: FC<StSpinnerScreenProps> = memo(({ label }) => {
  const styles = useStyles()

  return (
    <Portal>
      <div className={ styles.backdrop } />
      <div className={ styles.contents }>
        <div className={ styles.surface }>
          <Spinner
            labelPosition="below"
            label={ label }
          />
        </div>
      </div>
    </Portal>
  )
})

StSpinnerScreen.displayName = 'StSpinnerScreen'
