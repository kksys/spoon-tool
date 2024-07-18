import { Label, makeStyles, Title2, tokens, Toolbar } from '@fluentui/react-components'
import { Hamburger } from '@fluentui/react-nav-preview'
import { FC, memo, useCallback, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Flex } from '#/cross-cutting/views/components/flex/Flex'

import { LangSelector } from '../lang-selector/LangSelector'

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
  const langId = useId()

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

        <Flex
          direction='row'
          style={{
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: tokens.spacingHorizontalS,
          }}
        >
          <Label htmlFor={langId}>
            { t('lang-selector.title') }
          </Label>
          <LangSelector id={langId} />
        </Flex>
      </Flex>
    </Toolbar>
  )
})

Header.displayName = 'Header'
