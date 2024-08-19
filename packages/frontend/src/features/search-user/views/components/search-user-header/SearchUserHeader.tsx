import { Button, makeStyles, SearchBox, SearchBoxProps, Spinner, Title3, tokens } from '@fluentui/react-components'
import { PeopleSearchRegular } from '@fluentui/react-icons'
import { FC, memo, MouseEvent, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'react-use'

import { StPageHeader } from '~/features/cross-cutting/views/components/st-page-header/StPageHeader'
import { diContainer } from '~/inversify.config'

import { Flex } from '#/cross-cutting/views/components/flex/Flex'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'

const searchBoxWidth = 402
const searchButtonWidth = 110

const useStyle = makeStyles({
  pageTitle: {
    textWrap: 'nowrap',
    height: 'fit-content',
  },
  spacer: {
    height: '36px'
  },
  searchBoxContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: '155px',
    flexBasis: `calc(${searchBoxWidth}px + ${searchButtonWidth}px + ${tokens.spacingHorizontalS})`
  },
  searchBox: {
    flex: '1 1 0',
    minWidth: 0,
    maxWidth: `${searchBoxWidth}px`
  },
  searchButton: {
    width: `${searchButtonWidth}px`
  }
})

export const SearchUserHeader: FC = memo(() => {
  const { t } = useTranslation()
  const styles = useStyle()

  const viewModel = diContainer.get<IUserListViewModel>(searchUserTypes.UserListViewModel)

  const keyword = useObservable(viewModel.keyword$, '')
  const isBusy = useObservable(viewModel.isLocalBusy$, false)

  const handleKeywordChange = useCallback<NonNullable<SearchBoxProps['onChange']>>(
    (_event, data) => {
      viewModel.updateKeyword(data.value)
    },
    [viewModel],
  )

  const handleSearchButton = useCallback(
    (_event: MouseEvent<HTMLButtonElement>) => {
      viewModel.transaction(async () => {
        await viewModel.resetResult()
        await viewModel.fetchUserList()
      })
    },
    [viewModel],
  )

  return (
    <StPageHeader>
      <Flex style={{ width: '100%', minHeight: '36px', flexFlow: 'wrap', flexWrap: 'wrap', rowGap: '16px', columnGap: '8px', justifyContent: 'start' }}>
        <Flex style={{ alignItems: 'center' }}>
          <Title3
            align="start"
            className={styles.pageTitle}
          >
            { t('top.title') }
          </Title3>
        </Flex>

        <Flex
          direction='row'
          grow={true}
          className={styles.spacer}
        />

        <Flex
          direction='row'
          grow={true}
          className={styles.searchBoxContainer}
        >
          <SearchBox
            type="text"
            className={styles.searchBox}
            disabled={isBusy}
            value={keyword}
            onChange={handleKeywordChange}
            contentBefore={<PeopleSearchRegular />}
          />
          <Button
            className={styles.searchButton}
            disabled={!keyword || isBusy}
            disabledFocusable={!keyword || isBusy}
            appearance="primary"
            onClick={handleSearchButton}
            icon={isBusy ? <Spinner size="tiny" /> : undefined}
          >
            {isBusy ? t('common.loading') : t('common.search')}
          </Button>
        </Flex>
      </Flex>
    </StPageHeader>
  )
})

SearchUserHeader.displayName = 'SearchUserHeader'
