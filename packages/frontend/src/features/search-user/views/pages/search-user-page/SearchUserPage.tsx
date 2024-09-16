import { FC, memo, useState } from 'react'
import { useObservable } from 'react-use'

import { diContainer } from '~/inversify.config'

import { Page } from '#/cross-cutting/views/pages/Page'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'
import { SearchUserHeader } from '#/search-user/views/components/search-user-header/SearchUserHeader'
import { SearchUserList } from '#/search-user/views/components/search-user-list/SearchUserList'

import { UserDetailDialog } from './UserDetailDialog'

export const SearchUserPage: FC = memo(() => {
  const viewModel = diContainer.get<IUserListViewModel>(searchUserTypes.UserListViewModel)

  const isBusy = useObservable(viewModel.isLocalBusy$, false)
  const userList = useObservable(viewModel.userList$, [])
  const hasNextPage = useObservable(viewModel.paginator.hasNextPage$, false)

  const [openUserDetailDialog, setOpenUserDetailDialog] = useState(false)

  return (
    <>
      <Page fixedLayout>
        <div style={ { display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, height: '100%' } }>
          <SearchUserHeader />
          <SearchUserList
            userList={ userList }
            hasNextPage={ hasNextPage }
            isBusy={ isBusy }
            loadNextItems={ async (_startIndex: number, _stopIndex: number): Promise<void> => {
              await viewModel.fetchNextUserList()
            } }
            onSelectUser={ async (userId: number): Promise<void> => {
              viewModel.setActiveUser(userId)
              await viewModel.fetchUserDetail(userId)
              setOpenUserDetailDialog(true)
            } }
          />
        </div>
      </Page>

      {viewModel.activeUser && (
        <UserDetailDialog
          user={ viewModel.activeUser }
          open={ openUserDetailDialog }
          onOpenChange={ (_event, data) => setOpenUserDetailDialog(data.open) }
          onClickClose={ () => setOpenUserDetailDialog(false) }
        />
      )}
    </>
  )
})

SearchUserPage.displayName = 'SearchUserPage'
