import { Field, makeStyles, Text, Title3, tokens, Toolbar } from "@fluentui/react-components";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { appName, author, revision, version } from "~/assets/autogen/app-info.json"
import { Page } from "~/features/cross-cutting/views/pages/Page";

const useStyles = makeStyles({
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
    gridRowGap: tokens.spacingVerticalS,
  },
})

const useFieldStyles = makeStyles({
  label: {
    width: '300px'
  },
  value: {
    paddingTop: tokens.spacingVerticalSNudge,
    paddingBottom: tokens.spacingVerticalSNudge,
    wordBreak: 'break-all'
  }
})

export const AboutPage: FC = memo(() => {
  const styles = useStyles()
  const fieldStyles = useFieldStyles()
  const { t } = useTranslation()

  return (
    <Page>
      <Toolbar style={{ minHeight: '60px' }}>
        <Title3 align="start">
          { t('about.title') }
        </Title3>
      </Toolbar>

      <div className={styles.field}>
        <Field
          label={ t('app.name') }
          orientation="horizontal"
          validationState="none"
        >
          <Text className={fieldStyles.value}>
            { appName }
          </Text>
        </Field>
        <Field
          label={ t('app.version') }
          orientation="horizontal"
        >
          <Text className={fieldStyles.value}>
            { `v${ version } (${ revision })` }
          </Text>
        </Field>
        {
          import.meta.env.DEV
            ? (
              <Field
                label={ t('app.dev-mode') }
                orientation="horizontal"
              >
                <Text className={fieldStyles.value}>
                  { t('common.enabled') }
                </Text>
              </Field>
            )
            : undefined
        }
        <Field
          label={ t('app.author') }
          orientation="horizontal"
        >
          <Text className={fieldStyles.value}>
            { author }
          </Text>
        </Field>
      </div>
    </Page>
  )
})

AboutPage.displayName = 'AboutPage'
