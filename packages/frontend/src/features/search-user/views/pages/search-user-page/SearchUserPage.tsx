import { Toast, ToastBody, Toaster, ToastTitle, useId, useToastController } from '@fluentui/react-components'
import { FC, memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'react-use'
import { distinctUntilChanged } from 'rxjs'

import { diContainer } from '~/inversify.config'

import { isApiError } from '#/cross-cutting/errors/ApiErrorBase'
import { CancelError } from '#/cross-cutting/errors/connection-failure/CancelError'
import { ConnectionRefusedError } from '#/cross-cutting/errors/connection-failure/ConnectionRefusedError'
import { GenericHttpError } from '#/cross-cutting/errors/http-error/GenericHttpError'
import { InternalServerError } from '#/cross-cutting/errors/http-error/InternalServerError'
import { NotFoundError } from '#/cross-cutting/errors/http-error/NotFoundError'
import { UnauthorizedError } from '#/cross-cutting/errors/http-error/UnauthorizedError'
import { Page } from '#/cross-cutting/views/pages/Page'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'
import { SearchUserHeader } from '#/search-user/views/components/search-user-header/SearchUserHeader'
import { SearchUserList } from '#/search-user/views/components/search-user-list/SearchUserList'

import { UserDetailDialog } from './UserDetailDialog'

interface ToastSwitcherProps {
  error: Error
}

const ToastSwitcher: FC<ToastSwitcherProps> = memo(({ error }) => {
  const { t } = useTranslation()

  if (!isApiError(error)) {
    return (
      <Toast>
        <ToastTitle>
          { t('common.error.title', { ns: 'common' }) }
        </ToastTitle>
        <ToastBody>
          { error.message }
        </ToastBody>
      </Toast>
    )
  } else if (error instanceof NotFoundError) {
    return (
      <Toast>
        <ToastTitle>
          { t('common.error.title', { ns: 'common' }) }
        </ToastTitle>
        <ToastBody>
          指定されたリソースが見つかりませんでした
        </ToastBody>
      </Toast>
    )
  } else if (error instanceof InternalServerError) {
    return (
      <Toast>
        <ToastTitle>
          { t('common.error.title', { ns: 'common' }) }
        </ToastTitle>
        <ToastBody>
          サーバー内部でエラーが発生しました。しばらくしてから再度お試しください
        </ToastBody>
      </Toast>
    )
  } else if (error instanceof UnauthorizedError) {
    return (
      <Toast>
        <ToastTitle>
          { t('common.error.title', { ns: 'common' }) }
        </ToastTitle>
        <ToastBody>
          サインインが必要です
        </ToastBody>
      </Toast>
    )
  } else if (error instanceof GenericHttpError) {
    return (
      <Toast>
        <ToastTitle>
          { t('common.error.title', { ns: 'common' }) }
        </ToastTitle>
        <ToastBody>
          サーバーから対応していないエラーが返されました
        </ToastBody>
      </Toast>
    )
  } else if (error instanceof ConnectionRefusedError) {
    return (
      <Toast>
        <ToastTitle>
          { t('common.error.title', { ns: 'common' }) }
        </ToastTitle>
        <ToastBody>
          通信エラーが発生しました。しばらくしてから再度お試しください
        </ToastBody>
      </Toast>
    )
  } else if (error instanceof CancelError) {
    return (
      <Toast>
        <ToastTitle>
          { t('common.error.title', { ns: 'common' }) }
        </ToastTitle>
        <ToastBody>
          ユーザーによってキャンセルされました
        </ToastBody>
      </Toast>
    )
  }

  return (
    <Toast>
      <ToastTitle>
        { t('common.error.title', { ns: 'common' }) }
      </ToastTitle>
      <ToastBody>
        原因不明のエラーが発生しました
      </ToastBody>
    </Toast>
  )
})

ToastSwitcher.displayName = 'ToastSwitcher'

export const SearchUserPage: FC = memo(() => {
  const viewModel = diContainer.get<IUserListViewModel>(searchUserTypes.UserListViewModel)

  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)

  const isBusy = useObservable(viewModel.isLocalBusy$, false)
  const userList = useObservable(viewModel.userList$, [])
  const hasNextPage = useObservable(viewModel.paginator.hasNextPage$, false)

  useEffect(() => {
    const subscription = viewModel.errorBag$
      .pipe(distinctUntilChanged())
      .subscribe(error => {
        dispatchToast(
          <ToastSwitcher error={ error } />,
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
