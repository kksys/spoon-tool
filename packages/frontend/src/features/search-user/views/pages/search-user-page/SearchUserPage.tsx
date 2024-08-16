import { FC, memo } from 'react'
import { useObservable } from 'react-use'

import { diContainer } from '~/inversify.config'

import { Page } from '#/cross-cutting/views/pages/Page'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'
import { SearchUserHeader } from '#/search-user/views/components/search-user-header/SearchUserHeader'
import { SearchUserList } from '#/search-user/views/components/search-user-list/SearchUserList'

export const SearchUserPage: FC = memo(() => {
  const viewModel = diContainer.get<IUserListViewModel>(searchUserTypes.UserListViewModel)

  const isBusy = useObservable(viewModel.isLocalBusy$, false)
  const userList = useObservable(viewModel.userList$, [])
  const hasNextPage = useObservable(viewModel.paginator.hasNextPage$, false)

  return (
    <Page fixedLayout={true}>
      <div style={{ display: 'flex', flexDirection: 'column', gridTemplateRows: 'auto 1fr', gridTemplateColumns: '1fr', minHeight: 0, height: '100%' }}>
        <SearchUserHeader />
        <SearchUserList
          userList={userList}
          hasNextPage={hasNextPage}
          isBusy={isBusy}
          loadNextItems={async (_startIndex: number, _stopIndex: number): Promise<void> => {
            await viewModel.fetchNextUserList()
          } }
        />
      </div>
    </Page>
  )
})

SearchUserPage.displayName = 'SearchUserPage'
