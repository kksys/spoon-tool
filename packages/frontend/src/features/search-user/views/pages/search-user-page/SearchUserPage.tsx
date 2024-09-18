import { Toast, ToastBody, Toaster, ToastTitle, useId, useToastController } from '@fluentui/react-components'
import { FC, memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'react-use'
import { distinctUntilChanged } from 'rxjs'

import { diContainer } from '~/inversify.config'

import { Page } from '#/cross-cutting/views/pages/Page'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'
import { SearchUserHeader } from '#/search-user/views/components/search-user-header/SearchUserHeader'
import { SearchUserList } from '#/search-user/views/components/search-user-list/SearchUserList'

import { UserDetailDialog } from './UserDetailDialog'

export const SearchUserPage: FC = memo(() => {
  const viewModel = diContainer.get<IUserListViewModel>(searchUserTypes.UserListViewModel)

  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)
  const { t } = useTranslation()

  const isBusy = useObservable(viewModel.isLocalBusy$, false)
  const userList = useObservable(viewModel.userList$, [])
  const hasNextPage = useObservable(viewModel.paginator.hasNextPage$, false)

  useEffect(() => {
    const subscription = viewModel.errorBag$
      .pipe(distinctUntilChanged())
      .subscribe(error => {
        console.log(error)
        dispatchToast(
          <Toast>
            <ToastTitle>
              { t('error.title') }
            </ToastTitle>
            <ToastBody>
              {error.name}
              {error.message}
              {error.stack}
            </ToastBody>
          </Toast>,
          { intent: 'error' }
        )
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [viewModel.errorBag$])

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

      <Toaster toasterId={ toasterId } />
    </>
  )
})

SearchUserPage.displayName = 'SearchUserPage'
