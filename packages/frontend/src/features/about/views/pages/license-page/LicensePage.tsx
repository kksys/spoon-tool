import { Link, makeStyles, Title3, tokens } from '@fluentui/react-components'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'

import Licenses from '@/autogen/licenses.json'

import { StPageHeader } from '#/cross-cutting/views/components/st-page-header/StPageHeader'
import { Page } from '#/cross-cutting/views/pages/Page'

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
  licenseTitle: {
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground4,
  },
  licenseBody: {
    whiteSpace: 'pre',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    textWrap: 'wrap',
  }
})

export const LicensePage: FC = memo(() => {
  const styles = useStyles()
  const { t } = useTranslation()

  return (
    <Page>
      <StPageHeader>
        <Title3
          align="start"
          className={styles.pageTitle}
        >
          { t('license.title') }
        </Title3>
      </StPageHeader>

      <div className={styles.field}>
        { Licenses.map((license, index) => (
          <div key={index}>
            <div className={styles.licenseTitle}>
              <h3>{license.name}@{license.version}</h3>
              <p><Link href={license.repository} target='_blank'>{license.repository}</Link></p>
              <p>{license.publisher || '(unknown)'}</p>
              <p>{license.licenses}</p>
            </div>
            <p className={styles.licenseBody}>{license.licenseText}</p>
          </div>
        ))}
      </div>
    </Page>
  )
})

LicensePage.displayName = 'LicensePage'
