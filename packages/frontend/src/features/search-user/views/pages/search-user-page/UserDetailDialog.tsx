import { AvatarProps, Button, DialogActions, DialogBody, DialogContent, DialogTitle, DialogTrigger, Text } from '@fluentui/react-components'
import { Avatar } from '@fluentui/react-components'
import { i18n } from 'i18next'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { diContainer } from '~/inversify.config'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IStDialogProps, StDialog } from '#/cross-cutting/views/components/st-dialog/StDialog'
import { Stack } from '#/cross-cutting/views/components/stack/Stack'
import { StackItem } from '#/cross-cutting/views/components/stack-item/StackItem'
import { IUserViewModel } from '#/search-user/interfaces/view-models/IUserViewModel'

import { SearchUserBadge, SearchUserBadgeType } from '../../components/search-user-badge/SearchUserBadge'

interface IUserDetailDialogProps extends Pick<IStDialogProps, 'open' | 'onOpenChange'> {
  user: IUserViewModel
  onClickClose: () => void | Promise<void>
}

export const UserDetailDialog: FC<IUserDetailDialogProps> = memo(({ open, onOpenChange, user, onClickClose }) => {
  const { t } = useTranslation()

  const i18n = diContainer.get<i18n>(crossCuttingTypes.I18n)

  const [icon, setIcon] = useState<string | undefined>(() => {
    let profileIcon = user.properties.profileIcon

    if (profileIcon.startsWith('http:') && window.location.protocol === 'https:') {
      // http resource is referenced by https resource
      // but it is not secure, so it will be fallback to https automatically
      profileIcon = profileIcon.replace(/^http:/gi, 'https:')
    }

    return profileIcon
  })

  useEffect(() => {
    let profileIcon = user.properties.profileIcon

    if (profileIcon.startsWith('http:') && window.location.protocol === 'https:') {
      // http resource is referenced by https resource
      // but it is not secure, so it will be fallback to https automatically
      profileIcon = profileIcon.replace(/^http:/gi, 'https:')
    }

    setIcon(profileIcon)
  }, [user.properties.profileIcon])

  const handleAvatarError = useCallback<NonNullable<AvatarProps['onError']>>(() => {
    setIcon(undefined)
  }, [])

  const handleClickClose = useCallback(async () => {
    await onClickClose()
  }, [onClickClose])

  return (
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
                  { user.properties.badges.includes('Original') && (
                    <SearchUserBadge type={ SearchUserBadgeType.Original } />
                  )}

                  { user.properties.badges.includes('Red_Choice') && (
                    <SearchUserBadge type={ SearchUserBadgeType.Red_Choice } />
                  )}

                  { user.properties.badges.includes('Orange_Choice') && (
                    <SearchUserBadge type={ SearchUserBadgeType.Orange_Choice } />
                  )}

                  { user.properties.badges.includes('Yellow_Choice') && (
                    <SearchUserBadge type={ SearchUserBadgeType.Yellow_Choice } />
                  )}

                  { user.properties.badges.includes('voice') && (
                    <SearchUserBadge type={ SearchUserBadgeType.Voice } />
                  )}
                </div>
              </div>
            </StackItem>
            <StackItem grow>
              <Stack>
                <Text>
                  { user.properties.nickname }
                </Text>
                <Text>
                  { `@${user.properties.tag}` }
                </Text>
                <br />
                <Text>
                  { t('numberOfFollowers.format', { followers: user.properties.numberOfFollowers.toLocaleString() }) }
                </Text>
                <Text>
                  { t('numberOfFollowing.format', { following: user.properties.numberOfFollowing.toLocaleString() }) }
                </Text>
                <Text>
                  { t('joinedDateTime.format', { datetime: user.detail?.joinedDate?.toLocaleString(i18n.language) }) }
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
              { t('common.close') }
            </Button>
          </DialogTrigger>
        </DialogActions>
      </DialogBody>
    </StDialog>
  )
})

UserDetailDialog.displayName = 'UserDetailDialog'
