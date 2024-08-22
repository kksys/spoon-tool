import { Button, InfoLabel, makeStyles, Title3, tokens } from '@fluentui/react-components'
import { Info16Regular } from '@fluentui/react-icons'
import { FC, memo, useCallback, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'react-use'

import { languages } from '~/i18n.resources'
import { diContainer } from '~/inversify.config'

import { configurationTypes } from '#/configuration/di/configurationTypes'
import { IConfigurationViewModel } from '#/configuration/interfaces/IConfigurationViewModel'
import { ILangSelectorProps, LangSelector } from '#/configuration/views/components/lang-selector/LangSelector'
import { useDeviceLayout } from '#/cross-cutting/hooks/useDeviceLayout'
import { sleep } from '#/cross-cutting/utils/sleep'
import { Flex } from '#/cross-cutting/views/components/flex/Flex'
import { StField } from '#/cross-cutting/views/components/st-field/StField'
import { StPageHeader } from '#/cross-cutting/views/components/st-page-header/StPageHeader'
import { StSpinnerScreen } from '#/cross-cutting/views/components/st-spinner-screen/StSpinnerScreen'
import { Page } from '#/cross-cutting/views/pages/Page'

import { ResetCompleteDialog } from './ResetCompleteDialog'
import { ResetWarningDialog } from './ResetWarningDialog'

const useStyles = makeStyles({
  field: {
    display: 'flex',
    marginTop: '4px',
    marginLeft: '8px',
    flexDirection: 'column',
    gridRowGap: tokens.spacingVerticalL,
  },
  pageTitle: {
    textWrap: 'nowrap'
  },
})

export const ConfigurationPage: FC = memo(() => {
  const styles = useStyles()
  const { t } = useTranslation()
  const langId = useId()
  const device = useDeviceLayout()

  const configurationViewModel = diContainer.get<IConfigurationViewModel>(configurationTypes.ConfigurationViewModel)

  const [warningDialog, setWarningDialog] = useState(false)
  const [completeDialog, setCompleteDialog] = useState(false)

  const isBusy = useObservable(configurationViewModel.isBusy$, false)
  const disableReset = useObservable(configurationViewModel.disableReset$, true)
  const unchanged = useObservable(configurationViewModel.unchanged$, true)
  const language = useObservable(configurationViewModel.language$, 'ja-JP')

  const handleLanguageSelect = useCallback<NonNullable<ILangSelectorProps['onChange']>>((_event, data) => {
    configurationViewModel.setLanguage(data.selectedLanguage)
  }, [configurationViewModel])

  const handleResetButton = useCallback(async () => {
    setWarningDialog(true)
  }, [])

  const handleConfirmedToResetButton = useCallback(async () => {
    await configurationViewModel.transaction(async () => {
      await sleep(1500)
      await configurationViewModel.reset()
      setCompleteDialog(true)
    })
  }, [configurationViewModel])

  const handleCompletedToResetButton = useCallback(async () => {
    await sleep(500)
    configurationViewModel.notifyReset()
  }, [configurationViewModel])

  const handleSaveButton = useCallback(async () => {
    await configurationViewModel.save()
  }, [configurationViewModel])

  const handleCancelButton = useCallback(async () => {
    await configurationViewModel.restore()
  }, [configurationViewModel])

  return (
    <Page>
      <StPageHeader>
        <Title3
          align="start"
          className={styles.pageTitle}
        >
          { t('configuration.title') }
        </Title3>
      </StPageHeader>

      <div className={styles.field}>
        <StField
          label={(
            <InfoLabel
              infoButton={<Info16Regular />}
              info={ t('lang-selector.info') }
              htmlFor={langId}
            >
              { t('lang-selector.title') }
            </InfoLabel>
          )}
          validationState="none"
        >
          <LangSelector
            id={langId}
            languages={languages}
            language={language}
            onChange={handleLanguageSelect}
          />
        </StField>
        <StField
          label={(
            <InfoLabel
              infoButton={<Info16Regular />}
              info={ t('reset-configuration.info') }
            >
              { t('reset-configuration.title') }
            </InfoLabel>
          )}
          validationState="none"
        >
          <Button
            onClick={handleResetButton}
            appearance="primary"
            style={{
              backgroundColor: disableReset ? undefined : tokens.colorStatusDangerBackground3
            }}
            disabled={disableReset}
          >
            { t('reset-configuration.label') }
          </Button>
        </StField>

        <Flex style={{ justifyContent: 'end', gap: tokens.spacingVerticalM, flexWrap: 'wrap', marginTop: tokens.spacingVerticalXXXL }}>
          {
            device === 'pc' ? <Flex grow={true} /> : undefined
          }
          <Button
            appearance="primary"
            onClick={handleSaveButton}
            disabled={unchanged}
            style={ device === 'mobile' ? ({ width: '100%' }) : undefined }
          >
            { t('common.save') }
          </Button>
          <Button
            appearance="secondary"
            onClick={handleCancelButton}
            disabled={unchanged}
            style={ device === 'mobile' ? ({ width: '100%' }) : undefined }
          >
            { t('common.cancel') }
          </Button>
        </Flex>
      </div>

      <ResetWarningDialog
        open={warningDialog}
        onOpenChange={(_event, data) => setWarningDialog(data.open)}
        onClickYes={handleConfirmedToResetButton}
      />
      <ResetCompleteDialog
        open={completeDialog}
        onOpenChange={(_event, data) => setCompleteDialog(data.open)}
        onClickClose={handleCompletedToResetButton}
      />

      { isBusy
        ? <StSpinnerScreen />
        : undefined
      }
    </Page>
  )
})

ConfigurationPage.displayName = 'ConfigurationPage'
