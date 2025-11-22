import { Button, DialogActions, DialogBody, DialogContent, DialogTitle, DialogTrigger } from '@fluentui/react-components'
import { FC, memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'react-use'

import { diContainer } from '~/inversify.config'

import { IStDialogProps, StDialog } from '#/cross-cutting/views/components/st-dialog/StDialog'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { User } from '#/search-user/interfaces/models/User'
import { IUserDetailViewModel } from '#/search-user/interfaces/view-models/IUserDetailViewModel'

import { SearchUserList } from '../../components/search-user-list/SearchUserList'

interface IFollowerListDialogProps extends Pick<IStDialogProps, 'open' | 'onOpenChange'> {
  user: User
  onClickClose: () => void | Promise<void>
}

export const FollowerListDialog: FC<IFollowerListDialogProps> = memo(({ open, onOpenChange, user, onClickClose }) => {
  const { t } = useTranslation()
  const userDetailViewModel = diContainer.get<IUserDetailViewModel>(searchUserTypes.UserDetailViewModel)
  const isBusy = useObservable(userDetailViewModel.isLocalBusy$, false)
  const hasNextPage = useObservable(userDetailViewModel.followersPaginator.hasNextPage$, false)

  const handleClickClose = useCallback(async () => {
    await onClickClose()
  }, [onClickClose])

  useEffect(() => {
    if (open) {
      userDetailViewModel.fetchFollowers(user.id)
    }
  }, [open])

  return (
    <StDialog
      open={ open }
      onOpenChange={ onOpenChange }
      surfaceStyle={ { height: 'calc(100dvh - 100px)' } }
    >
      <DialogBody style={ { maxHeight: 'calc(100%)', height: '100%' } }>
        <DialogTitle>
          { t('follower-list-dialog.title', { ns: 'search-user', username: user.profile.nickname }) }
        </DialogTitle>
        <DialogContent style={ { position: 'relative' } }>
          <div style={ { display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, height: '100%', marginLeft: '12px', marginRight: '12px', position: 'absolute', inset: '0' } }>
            <SearchUserList
              userList={ user.relations.followers }
              hasNextPage={ hasNextPage }
              isBusy={ isBusy }
              loadNextItems={ async (_startIndex: number, _stopIndex: number): Promise<void> => {
                await userDetailViewModel.fetchNextFollowers(user.id)
              } }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <DialogTrigger action="close">
            <Button
              appearance="secondary"
              aria-label="close"
              onClick={ handleClickClose }
            >
              { t('common.close', { ns: 'common' }) }
            </Button>
          </DialogTrigger>
        </DialogActions>
      </DialogBody>
    </StDialog>
  )
})

FollowerListDialog.displayName = 'FollowerListDialog'
