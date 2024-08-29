import { makeStyles, Portal, Spinner, tokens } from '@fluentui/react-components'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'

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

export const StSpinnerScreen: FC = memo(() => {
  const { t } = useTranslation()
  const styles = useStyles()

  return (
    <Portal>
      <div className={ styles.backdrop } />
      <div className={ styles.contents }>
        <div className={ styles.surface }>
          <Spinner
            labelPosition="below"
            label={ t('configuration.resetting') }
          />
        </div>
      </div>
    </Portal>
  )
})

StSpinnerScreen.displayName = 'StSpinnerScreen'
