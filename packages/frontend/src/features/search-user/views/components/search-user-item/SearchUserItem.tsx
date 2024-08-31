import { Avatar, AvatarProps, Skeleton } from '@fluentui/react-components'
import { FC, memo, MouseEventHandler, ReactElement, useCallback, useState } from 'react'

import { diContainer } from '~/inversify.config'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { ILoggerService } from '#/cross-cutting/interfaces/ILoggerService'
import { Flex } from '#/cross-cutting/views/components/flex/Flex'
import { IUserViewModel } from '#/search-user/interfaces/view-models/IUserViewModel'

const SearchUserItemSize = {
  height: 64,
  padding: 12
}

export const getSearchUserItemHeight = () => {
  return SearchUserItemSize.height + SearchUserItemSize.padding * 2
}

interface ISearchUserItemBaseProps {
  renderIcon: ReactElement
  renderNickName: ReactElement
  renderTag: ReactElement
  renderNumberOfFollowers: ReactElement
  renderNumberOfFollowing: ReactElement
  onClick?: MouseEventHandler<never>
}

const SearchUserItemBase: FC<ISearchUserItemBaseProps> = memo(({
  renderIcon,
  renderNickName,
  renderTag,
  renderNumberOfFollowers,
  renderNumberOfFollowing,
  onClick
}) => {
  return (
    <Flex
      style={{ padding: `${SearchUserItemSize.padding}px` }}
      onClick={onClick}
    >
      {renderIcon}
      <Flex>
        <Flex>
          { renderNickName }
        </Flex>
        <Flex>
          { renderTag }
        </Flex>
        <Flex>
          <span>
            Number Of Followers
          </span>
          { renderNumberOfFollowers }
        </Flex>
        <Flex>
          <span>
            Number Of Following
          </span>
          { renderNumberOfFollowing }
        </Flex>
      </Flex>
    </Flex>
  )
})

SearchUserItemBase.displayName = 'SearchUserItemBase'

interface ISearchUserItemLoadingProps {
  loading: true
  user?: never
  onClick?: never
}

const SearchUserItemLoading: FC<Omit<ISearchUserItemLoadingProps, 'loading'>> = memo(() => {
  return (
    <SearchUserItemBase
      key='loading'
      renderIcon={(
        <Skeleton style={{ width: `${SearchUserItemSize.height}px`, height: `${SearchUserItemSize.height}px` }} />
      )}
      renderNickName={(
        <span>
          <Skeleton />
        </span>
      )}
      renderTag={(
        <span>
          <Skeleton />
        </span>
      )}
      renderNumberOfFollowers={(
        <span>
          <Skeleton />
        </span>
      )}
      renderNumberOfFollowing={(
        <span>
          <Skeleton />
        </span>
      )}
    />
  )
})

SearchUserItemLoading.displayName = 'SearchUserItemLoading'

interface ISearchUserItemNormalProps {
  loading?: false
  user: IUserViewModel
  onClick: MouseEventHandler<never>
}

const SearchUserItemNormal: FC<Omit<ISearchUserItemNormalProps, 'loading'>> = memo(({ user, onClick }) => {
  const loggerService = diContainer.get<ILoggerService>(crossCuttingTypes.LoggerService)

  const [icon, setIcon] = useState<string | undefined>(() => {
    let profileIcon = user.profileIcon
    loggerService.info(profileIcon)

    if (profileIcon.startsWith('http:') && window.location.protocol === 'https:') {
      // http resource is referenced by https resource
      // but it is not secure, so it will be fallback to https automatically
      profileIcon = profileIcon.replace(/^http:/gi, 'https:')
    }

    return profileIcon
  })

  const handleAvatarChange = useCallback<NonNullable<AvatarProps['onLoadedData']>>((...args) => {
    loggerService.log(`${user.id}-icon`, 'handleAvatarChange', ...args)
  }, [loggerService, user.id])

  const handleAvatarLoad = useCallback<NonNullable<AvatarProps['onLoad']>>((...args) => {
    loggerService.log(`${user.id}-icon`, 'handleAvatarLoad', ...args)
  }, [loggerService, user.id])

  const handleAvatarError = useCallback<NonNullable<AvatarProps['onError']>>((...args) => {
    loggerService.log(`${user.id}-icon`, 'handleAvatarError', ...args)
    setIcon(undefined)
  }, [loggerService, user.id])

  return (
    <SearchUserItemBase
      key={`${user.id}`}
      renderIcon={(
        <Avatar
          key={`${user.id}-icon`}
          image={{ src: icon }}
          onLoadedData={handleAvatarChange}
          onLoad={handleAvatarLoad}
          onError={handleAvatarError}
          style={{ width: `${SearchUserItemSize.height}px`, height: `${SearchUserItemSize.height}px` }}
        />
      )}
      renderNickName={(
        <span>
          {user.nickname}
        </span>
      )}
      renderTag={(
        <span>
          {`@${user.tag}`}
        </span>
      )}
      renderNumberOfFollowers={(
        <span>
          {user.numberOfFollowers}
        </span>
      )}
      renderNumberOfFollowing={(
        <span>
          {user.numberOfFollowing}
        </span>
      )}
      onClick={onClick}
    />
  )
})

SearchUserItemNormal.displayName = 'SearchUserItemNormal'

type ISearchUserItemProps = (ISearchUserItemLoadingProps | ISearchUserItemNormalProps)

export const SearchUserItem: FC<ISearchUserItemProps> = memo(({ loading, user, onClick }) => {
  return loading
    ? (
      <SearchUserItemLoading />
    )
    : (
      <SearchUserItemNormal
        user={user}
        onClick={onClick}
      />
    )
})

SearchUserItem.displayName = 'SearchUserItem'
