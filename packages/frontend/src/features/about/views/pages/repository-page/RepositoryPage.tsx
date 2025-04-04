import { Link, makeStyles, Title3, tokens } from '@fluentui/react-components'
import { WindowNewRegular } from '@fluentui/react-icons'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'

import { repositoryUrl } from '~/assets/autogen/app-info.json'

import { StPageHeader } from '#/cross-cutting/views/components/st-page-header/StPageHeader'
import { Page } from '#/cross-cutting/views/pages/Page'

const useStyles = makeStyles({
  field: {
    display: 'flex',
    marginTop: '4px',
    marginLeft: '8px',
    flexDirection: 'column',
    gridRowGap: tokens.spacingVerticalS,
  },
  pageTitle: {
    textWrap: 'nowrap'
  },
})

export const RepositoryPage: FC = memo(() => {
  const styles = useStyles()
  const { t } = useTranslation()

  return (
    <Page>
      <StPageHeader>
        <Title3
          align="start"
          className={ styles.pageTitle }
        >
          { t('title.repository', { ns: 'common' }) }
        </Title3>
      </StPageHeader>

      <div className={ styles.field }>
        <div>
          { t('repository.description.maintainancedByGithub', { ns: 'about' }) }
          { t('repository.description.pleaseDownloadFromGithub', { ns: 'about' }) }
          <br/>
          <br/>
          { t('repository.description.link', { ns: 'about' }) }
          <Link
            href={ repositoryUrl }
            target="_blank"
          >
            { repositoryUrl }
            <WindowNewRegular />
          </Link>
        </div>
      </div>
    </Page>
  )
})

RepositoryPage.displayName = 'RepositoryPage'
