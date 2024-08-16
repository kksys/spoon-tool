import { Field, InfoLabel, makeStyles, Title3, tokens, Toolbar } from "@fluentui/react-components"
import { Info16Regular } from "@fluentui/react-icons"
import { FC, memo, useId } from "react"
import { useTranslation } from "react-i18next"

import { LangSelector } from "~/features/cross-cutting/views/components/lang-selector/LangSelector"

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
      <Toolbar style={{ minHeight: '60px' }}>
        <Title3 align="start">
          { t('configuration.title') }
        </Title3>
      </Toolbar>

      <div className={styles.field}>
        <Field
          label={(
            <InfoLabel
              infoButton={<Info16Regular />}
              info={ t('lang-selector.info') }
              htmlFor={langId}
            >
              { t('lang-selector.title') }
            </InfoLabel>
          )}
          orientation="horizontal"
          validationState="none"
        >
          <LangSelector id={langId} />
        </Field>
      </div>
    </Page>
  )
})

ConfigurationPage.displayName = 'ConfigurationPage'
