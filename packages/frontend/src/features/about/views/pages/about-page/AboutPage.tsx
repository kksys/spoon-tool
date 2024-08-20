import { makeStyles, Text, Title3, tokens } from '@fluentui/react-components';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { appName, author, revision, version } from '~/assets/autogen/app-info.json'

import { StField } from '#/cross-cutting/views/components/st-field/StField';
import { StPageHeader } from '#/cross-cutting/views/components/st-page-header/StPageHeader';
import { Page } from '#/cross-cutting/views/pages/Page';

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
      <StPageHeader>
        <Title3
          align="start"
          className={styles.pageTitle}
        >
          { t('about.title') }
        </Title3>
      </StPageHeader>

      <div className={styles.field}>
        <StField
          label={ t('app.name') }
        >
          <Text className={fieldStyles.value}>
            { appName }
          </Text>
        </StField>
        <StField
          label={ t('app.version') }
        >
          <Text className={fieldStyles.value}>
            { `v${ version } (${ revision })` }
          </Text>
        </StField>
        {
          import.meta.env.DEV
            ? (
              <StField
                label={ t('app.dev-mode') }
              >
                <Text className={fieldStyles.value}>
                  { t('common.enabled') }
                </Text>
              </StField>
            )
            : undefined
        }
        <StField
          label={ t('app.author') }
        >
          <Text className={fieldStyles.value}>
            { author }
          </Text>
        </StField>
      </div>
    </Page>
  )
})

AboutPage.displayName = 'AboutPage'
