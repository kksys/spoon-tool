import { Avatar, Skeleton } from '@fluentui/react-components'
import { FC, memo, MouseEventHandler, ReactElement, useState } from 'react'

import { Flex } from '#/cross-cutting/views/components/flex/Flex'
import { IUserViewModel } from '#/search-user/interfaces/view-models/IUserViewModel'

const SearchUserItemSize = {
  height: 64,
  padding: 12
}

// eslint-disable-next-line react-refresh/only-export-components
export const getSearchUserItemHeight = () => {
  return SearchUserItemSize.height + SearchUserItemSize.padding * 2
}

interface ISearchUserItemBaseProps {
  renderIcon: () => ReactElement
  renderNickName: () => ReactElement
  renderTag: () => ReactElement
  renderNumberOfFollowers: () => ReactElement
  renderNumberOfFollowing: () => ReactElement
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
      {renderIcon()}
      <Flex>
        <Flex>
          {renderNickName()}
        </Flex>
        <Flex>
          {renderTag()}
        </Flex>
        <Flex>
          <span>
            Number Of Followers
          </span>
          {renderNumberOfFollowers()}
        </Flex>
        <Flex>
          <span>
            Number Of Following
          </span>
          {renderNumberOfFollowing()}
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
      renderIcon={() => (
        <Skeleton style={{ width: `${SearchUserItemSize.height}px`, height: `${SearchUserItemSize.height}px` }} />
      )}
      renderNickName={() => (
        <span>
          <Skeleton />
        </span>
      )}
      renderTag={() => (
        <span>
          <Skeleton />
        </span>
      )}
      renderNumberOfFollowers={() => (
        <span>
          <Skeleton />
        </span>
      )}
      renderNumberOfFollowing={() => (
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
  const [icon, setIcon] = useState<string | undefined>(user.profileIcon)

  return (
    <SearchUserItemBase
      renderIcon={() => (
        <>
          <Avatar
            image={{src: icon}}
            onError={() => setIcon(undefined)}
            style={{ width: `${SearchUserItemSize.height}px`, height: `${SearchUserItemSize.height}px` }}
          />
        </>
      )}
      renderNickName={() => (
        <span>
          {user.nickname}
        </span>
      )}
      renderTag={() => (
        <span>
          {`@${user.tag}`}
        </span>
      )}
      renderNumberOfFollowers={() => (
        <span>
          {user.numberOfFollowers}
        </span>
      )}
      renderNumberOfFollowing={() => (
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
