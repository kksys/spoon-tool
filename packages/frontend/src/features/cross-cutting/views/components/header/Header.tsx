import { makeStyles, Title2, Toolbar } from '@fluentui/react-components'
import { Hamburger } from '@fluentui/react-nav-preview'
import { FC, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Flex } from '#/cross-cutting/views/components/flex/Flex'

interface IHeaderProps {
  isDrawerOpen: boolean
  onDrawerVisibilityChanged: (value: boolean) => void
}

const useStyles = makeStyles({
  toolbar: {
    minHeight: '60px'
  },
  title: {
    cursor: 'pointer'
  }
})

export const Header: FC<IHeaderProps> = memo(({ isDrawerOpen, onDrawerVisibilityChanged }) => {
  const styles = useStyles()
  const navigate = useNavigate()
  const { t } = useTranslation('translation')

  const onDrawerChanged = useCallback(() => {
    onDrawerVisibilityChanged(!isDrawerOpen)
  }, [isDrawerOpen, onDrawerVisibilityChanged])

  return (
    <Toolbar className={styles.toolbar}>
      <Flex style={{ width: '100%', height: '36px', justifyContent: 'space-between', alignItems: 'center' }}>
        <Flex>
          <Hamburger
            onClick={onDrawerChanged}
            aria-label="Toggle Navigation"
          />
        </Flex>

        <Flex>
          <Title2
            className={styles.title}
            align="start"
            onClick={() => navigate('/')}
          >
            { t('app.title') }
          </Title2>
        </Flex>

        <Flex
          direction='row'
          grow={true}
        />
      </Flex>
    </Toolbar>
  )
})

Header.displayName = 'Header'
