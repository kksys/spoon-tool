import { Link, makeStyles, Title3, tokens, Toolbar } from "@fluentui/react-components";
import { WindowNewRegular } from "@fluentui/react-icons";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { repositoryUrl } from "~/assets/autogen/app-info.json"

import { Page } from "#/cross-cutting/views/pages/Page";

const useStyles = makeStyles({
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
    gridRowGap: tokens.spacingVerticalS,
  },
})

export const RepositoryPage: FC = memo(() => {
  const styles = useStyles()
  const { t } = useTranslation()

  return (
    <Page>
      <Toolbar style={{ minHeight: '60px' }}>
        <Title3 align="start">
          { t('repository.title') }
        </Title3>
      </Toolbar>

      <div className={styles.field}>
        <div>
          { t('repository.description.maintainancedByGithub') }
          { t('repository.description.pleaseDownloadFromGithub') }
          <br/>
          <br/>
          { t('repository.description.link') }
          <Link
            href={repositoryUrl}
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
