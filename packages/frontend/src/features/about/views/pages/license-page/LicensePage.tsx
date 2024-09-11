import { Divider, Link, makeStyles, Subtitle1, Title3, tokens } from '@fluentui/react-components'
import { WindowNewRegular } from '@fluentui/react-icons'
import { FC, Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'

import Licenses from '@/autogen/licenses.json'

import { Flex } from '#/cross-cutting/views/components/flex/Flex'
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
    textWrap: 'nowrap',
  },
  licenseTitle: {
    position: 'sticky',
    top: 0,
    paddingBottom: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorNeutralBackground4,
  },
  licenseTitleRow: {
    gap: tokens.spacingHorizontalS,
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
  },
  licenseTitleRowHeader: {
    textWrap: 'nowrap',
  },
  licenseTitleRowValue: {
    gap: tokens.spacingHorizontalS,
    textWrap: 'wrap',
    wordBreak: 'break-all',
  },
  licenseBody: {
    whiteSpace: 'pre',
    fontFamily: 'monospace',
  },
  licenseBodyBlock: {
    wordBreak: 'break-all',
    textWrap: 'wrap',
  },
})

interface ILicenseViewProps {
  license: (typeof Licenses)[number]
}

const LicenseView: FC<ILicenseViewProps> = memo(({ license }) => {
  const styles = useStyles()
  const { t } = useTranslation()

  return (
    <div key={`${license.name}@${license.version}`}>
      <div className={styles.licenseTitle}>
        <Subtitle1>
          {license.name}
          @
          {license.version}
        </Subtitle1>

        <Flex className={styles.licenseTitleRow}>
          <span className={styles.licenseTitleRowHeader}>
            {t('license.repository')}
          </span>
          <span className={styles.licenseTitleRowValue}>
            <Link
              href={license.repository}
              target="_blank"
            >
              {license.repository}
              <WindowNewRegular />
            </Link>
          </span>
        </Flex>

        {license.publisher && (
          <Flex className={styles.licenseTitleRow}>
            <span className={styles.licenseTitleRowHeader}>
              {t('license.publisher')}
            </span>
            <span className={styles.licenseTitleRowValue}>
              {license.publisher}
            </span>
          </Flex>
        )}

        <Flex className={styles.licenseTitleRow}>
          <span className={styles.licenseTitleRowHeader}>
            {t('license.license-type')}
          </span>
          <span className={styles.licenseTitleRowValue}>
            {license.licenses}
          </span>
        </Flex>
      </div>

      <p className={styles.licenseBody}>
        <span className={styles.licenseBodyBlock}>
          {license.licenseText}
        </span>
      </p>
    </div>
  )
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
          {t('license.title')}
        </Title3>
      </StPageHeader>

      <div className={styles.field}>
        {Licenses.map((license, index) => (
          <Fragment key={index}>
            <LicenseView license={license} />

            {index < Licenses.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>
    </Page>
  )
})

LicensePage.displayName = 'LicensePage'
