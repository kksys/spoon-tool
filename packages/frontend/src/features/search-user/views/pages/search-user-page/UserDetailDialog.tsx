import { AvatarProps, Button, DialogActions, DialogBody, DialogContent, DialogTitle, DialogTrigger, Link, Text } from '@fluentui/react-components'
import { Avatar } from '@fluentui/react-components'
import { i18n } from 'i18next'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { diContainer } from '~/inversify.config'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IStDialogProps, StDialog } from '#/cross-cutting/views/components/st-dialog/StDialog'
import { Stack } from '#/cross-cutting/views/components/stack/Stack'
import { StackItem } from '#/cross-cutting/views/components/stack-item/StackItem'
import { User } from '#/search-user/interfaces/models/User'

import { SearchUserBadge, SearchUserBadgeType } from '../../components/search-user-badge/SearchUserBadge'
import { FollowerListDialog } from './FollowerListDialog'
import { FollowingListDialog } from './FollowingListDialog'

interface IUserDetailDialogProps extends Pick<IStDialogProps, 'open' | 'onOpenChange'> {
  user: User
  onClickClose: () => void | Promise<void>
}

export const UserDetailDialog: FC<IUserDetailDialogProps> = memo(({ open, onOpenChange, user, onClickClose }) => {
  const { t } = useTranslation()

  const i18n = diContainer.get<i18n>(crossCuttingTypes.I18n)

  const [icon, setIcon] = useState<string | undefined>(() => {
    let profileIcon = user.profile.profileIcon

    if (profileIcon.startsWith('http:') && window.location.protocol === 'https:') {
      // http resource is referenced by https resource
      // but it is not secure, so it will be fallback to https automatically
      profileIcon = profileIcon.replace(/^http:/gi, 'https:')
    }

    return profileIcon
  })

  useEffect(() => {
    let profileIcon = user.profile.profileIcon

    if (profileIcon.startsWith('http:') && window.location.protocol === 'https:') {
      // http resource is referenced by https resource
      // but it is not secure, so it will be fallback to https automatically
      profileIcon = profileIcon.replace(/^http:/gi, 'https:')
    }

    setIcon(profileIcon)
  }, [user.profile.profileIcon])

  const handleAvatarError = useCallback<NonNullable<AvatarProps['onError']>>(() => {
    setIcon(undefined)
  }, [])

  const handleClickClose = useCallback(async () => {
    await onClickClose()
  }, [onClickClose])

  const [isFollowingsOpen, setIsFollowingsOpen] = useState(false)
  const [isFollowersOpen, setIsFollowersOpen] = useState(false)

  return (
    <>
      <StDialog
        open={ open }
        onOpenChange={ onOpenChange }
      >
        <DialogBody>
          <DialogTitle></DialogTitle>
          <DialogContent>
            <Stack
              horizontal
              gap={ 12 }
            >
              <StackItem>
                <div style={ { position: 'relative' } }>
                  <div>
                    <Avatar
                      image={ { src: icon } }
                      onError={ handleAvatarError }
                      size={ 120 }
                    />
                  </div>
                  <div style={ { position: 'absolute', inset: 0, display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end', alignContent: 'end' } }>
                    { user.status.badges.includes('Original') && (
                      <SearchUserBadge type={ SearchUserBadgeType.Original } />
                    )}

                    { user.status.badges.includes('Red_Choice') && (
                      <SearchUserBadge type={ SearchUserBadgeType.Red_Choice } />
                    )}

                    { user.status.badges.includes('Orange_Choice') && (
                      <SearchUserBadge type={ SearchUserBadgeType.Orange_Choice } />
                    )}

                    { user.status.badges.includes('Yellow_Choice') && (
                      <SearchUserBadge type={ SearchUserBadgeType.Yellow_Choice } />
                    )}

                    { user.status.badges.includes('voice') && (
                      <SearchUserBadge type={ SearchUserBadgeType.Voice } />
                    )}
                  </div>
                </div>
              </StackItem>
              <StackItem grow>
                <Stack>
                  <Text data-testid="user-detail-dialog.nickname">
                    { user.profile.nickname }
                  </Text>
                  <Text data-testid="user-detail-dialog.tag">
                    { `@${user.profile.tag}` }
                  </Text>
                  <br />
                  <Text data-testid="user-detail-dialog.number-of-followers">
                    <Link onClick={ () => { setIsFollowersOpen(true) } }>
                      { t('numberOfFollowers.format', { ns: 'search-user', followers: user.statistics.numberOfFollowers.toLocaleString() }) }
                    </Link>
                  </Text>
                  <Text data-testid="user-detail-dialog.number-of-following">
                    <Link onClick={ () => { setIsFollowingsOpen(true) } }>
                      { t('numberOfFollowing.format', { ns: 'search-user', following: user.statistics.numberOfFollowing.toLocaleString() }) }
                    </Link>
                  </Text>
                  <br />
                  <Text data-testid="user-detail-dialog.joined-date-time">
                    { t('joinedDateTime.format', { ns: 'search-user', datetime: user.profile.joinedDate?.toLocaleString(i18n.language) }) }
                  </Text>
                </Stack>
              </StackItem>
            </Stack>
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

      <FollowerListDialog
        open={ isFollowersOpen }
        user={ user }
        onClickClose={ () => setIsFollowersOpen(false) }
      />
      <FollowingListDialog
        open={ isFollowingsOpen }
        user={ user }
        onClickClose={ () => setIsFollowingsOpen(false) }
      />
    </>
  )
})

UserDetailDialog.displayName = 'UserDetailDialog'
