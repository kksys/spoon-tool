import { Button, SearchBox, SearchBoxProps, Spinner, Title3 } from '@fluentui/react-components'
import { PeopleSearchRegular } from '@fluentui/react-icons'
import { FC, memo, MouseEvent, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'react-use'

import { StPageHeader } from '~/features/cross-cutting/views/components/st-page-header/StPageHeader'
import { diContainer } from '~/inversify.config'

import { Flex } from '#/cross-cutting/views/components/flex/Flex'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'

export const SearchUserHeader: FC = memo(() => {
  const { t } = useTranslation()

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
      <Flex style={{ width: '100%', minHeight: '36px', flexFlow: 'wrap', flexWrap: 'wrap', rowGap: '16px', columnGap: '8px', justifyContent: 'end' }}>
        <Flex style={{ alignItems: 'center' }}>
          <Title3 style={{ height: 'fit-content' }}>
            { t('top.title') }
          </Title3>
        </Flex>

        <Flex
          direction='row'
          grow={true}
          style={{ height: '36px' }}
        />

        <Flex
          direction='row'
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 'var(--spacingHorizontalS)',
          }}
        >
          <SearchBox
            type="text"
            style={{ maxWidth: '360px' }}
            disabled={isBusy}
            value={keyword}
            onChange={handleKeywordChange}
            contentBefore={<PeopleSearchRegular />}
          />
          <Button
            style={{ maxWidth: '160px' }}
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
