import { InfoLabel, makeStyles, Title3, tokens } from "@fluentui/react-components"
import { Info16Regular } from "@fluentui/react-icons"
import { FC, memo, useId } from "react"
import { useTranslation } from "react-i18next"

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
    gridRowGap: tokens.spacingVerticalS,
  },
})

export const ConfigurationPage: FC = memo(() => {
  const styles = useStyles()
  const { t } = useTranslation()
  const langId = useId()

  return (
    <Page>
      <StPageHeader>
        <Title3 align="start">
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
      </div>
    </Page>
  )
})

ConfigurationPage.displayName = 'ConfigurationPage'
