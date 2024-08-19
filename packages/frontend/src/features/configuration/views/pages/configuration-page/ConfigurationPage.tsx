import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, InfoLabel, makeStyles, Title3, tokens } from "@fluentui/react-components"
import { Info16Regular } from "@fluentui/react-icons"
import { FC, memo, useCallback, useId, useState } from "react"
import { useTranslation } from "react-i18next"

import { diContainer } from "~/inversify.config"

import { configurationTypes } from "#/configuration/di/configurationTypes"
import { IConfigurationRepository } from "#/cross-cutting/interfaces/IConfigurationRepository"
import { LangSelector } from "#/cross-cutting/views/components/lang-selector/LangSelector"
import { StField } from "#/cross-cutting/views/components/st-field/StField"
import { StPageHeader } from "#/cross-cutting/views/components/st-page-header/StPageHeader"
import { Page } from "#/cross-cutting/views/pages/Page"

const useStyles = makeStyles({
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
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

  const configurationRepository = diContainer.get<IConfigurationRepository>(configurationTypes.ConfigurationRepository)

  const [warningDialog, setWarningDialog] = useState(false)
  const [completeDialog, setCompleteDialog] = useState(false)

  const handleResetButton = useCallback(async () => {
    await configurationRepository.reset()
    setCompleteDialog(true)
  }, [configurationRepository])

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
          <LangSelector id={langId} />
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
          <Button onClick={() => setWarningDialog(true)}>
            { t('reset-configuration.label') }
          </Button>
        </StField>
      </div>
      <Dialog
        open={warningDialog}
        onOpenChange={(_event, data) => setWarningDialog(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              Confirmation
            </DialogTitle>
            <DialogContent>
              Are you sure you want to reset the configuration? Once this operation is completed, it cannot be undone.
            </DialogContent>
            <DialogActions>
              <DialogTrigger action="close">
                <Button
                  appearance="secondary"
                  aria-label="close"
                >
                  Close
                </Button>
              </DialogTrigger>
              <DialogTrigger action="close">
                <Button
                  appearance="primary"
                  style={{
                    backgroundColor: tokens.colorStatusDangerBackground3
                  }}
                  onClick={handleResetButton}
                >
                  Reset
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Dialog
        open={completeDialog}
        onOpenChange={(_event, data) => setCompleteDialog(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              Reset Configuration
            </DialogTitle>
            <DialogContent>
              The configuration is resetted.
            </DialogContent>
            <DialogActions>
              <DialogTrigger action="close">
                <Button
                  appearance="secondary"
                  aria-label="close"
                >
                  Close
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Page>
  )
})

ConfigurationPage.displayName = 'ConfigurationPage'
