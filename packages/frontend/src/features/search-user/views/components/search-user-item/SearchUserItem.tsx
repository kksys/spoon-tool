import { Avatar, AvatarProps, makeStyles, Skeleton, tokens } from '@fluentui/react-components'
import { FC, memo, MouseEventHandler, ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { diContainer } from '~/inversify.config'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { ILoggerService } from '#/cross-cutting/interfaces/services/ILoggerService'
import { Flex } from '#/cross-cutting/views/components/flex/Flex'
import { Stack } from '#/cross-cutting/views/components/stack/Stack'
import { StackItem } from '#/cross-cutting/views/components/stack-item/StackItem'
import { User } from '#/search-user/interfaces/models/User'

import { SearchUserBadge, SearchUserBadgeType } from '../search-user-badge/SearchUserBadge'

const SearchUserItemSize = {
  height: 64,
  padding: 12
}

// eslint-disable-next-line react-refresh/only-export-components
export const getSearchUserItemHeight = () => {
  return SearchUserItemSize.height + SearchUserItemSize.padding * 2
}

const useStyles = makeStyles({
  propertyContainer: {
    justifyContent: 'center'
  },
  badgeContainer: {
    paddingBottom: tokens.spacingVerticalS,
  },
  propertyRow: {
    display: 'flex',
    gap: tokens.spacingVerticalM,
  }
})

interface ISearchUserItemBaseProps {
  testId?: string
  renderIcon: ReactElement
  renderBadge?: ReactElement | undefined
  renderNickName: ReactElement
  renderTag: ReactElement
  renderNumberOfFollowers: ReactElement
  renderNumberOfFollowing: ReactElement
  onClick?: MouseEventHandler<never>
}

const SearchUserItemBase: FC<ISearchUserItemBaseProps> = memo(({
  testId,
  renderIcon,
  renderBadge,
  renderNickName,
  renderTag,
  renderNumberOfFollowers,
  renderNumberOfFollowing,
  onClick
}) => {
  const styles = useStyles()

  return (
    <Flex
      style={ { padding: `${SearchUserItemSize.padding}px`, columnGap: `${SearchUserItemSize.padding}px` } }
      onClick={ onClick }
      data-testid={ testId }
    >
      {renderIcon}
      <Stack className={ styles.propertyContainer }>
        { renderBadge && (
          <StackItem className={ styles.badgeContainer }>
            {renderBadge}
          </StackItem>
        ) }
        <StackItem className={ styles.propertyRow }>
          <span>
            { renderNickName }
          </span>
          <span>
            { renderTag }
          </span>
        </StackItem>
        <StackItem className={ styles.propertyRow }>
          <span>
            { renderNumberOfFollowers }
          </span>
          <span>
            { renderNumberOfFollowing }
          </span>
        </StackItem>
      </Stack>
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
      renderIcon={ (
        <Skeleton style={ { width: `${SearchUserItemSize.height}px`, height: `${SearchUserItemSize.height}px` } } />
      ) }
      renderNickName={ (
        <span>
          <Skeleton />
        </span>
      ) }
      renderTag={ (
        <span>
          <Skeleton />
        </span>
      ) }
      renderNumberOfFollowers={ (
        <span>
          <Skeleton />
        </span>
      ) }
      renderNumberOfFollowing={ (
        <span>
          <Skeleton />
        </span>
      ) }
    />
  )
})

SearchUserItemLoading.displayName = 'SearchUserItemLoading'

interface ISearchUserItemNormalProps {
  loading?: false
  user: User
  onClick: MouseEventHandler<never>
}

const AvatarForSearchUserItemNormal: FC<{ user: User }> = memo(({ user }) => {
  const loggerService = diContainer.get<ILoggerService>(crossCuttingTypes.LoggerService)

  const [icon, setIcon] = useState<string | undefined>(user.profile.profileIcon)

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
    <div style={ { position: 'relative' } }>
      <div>
        <Avatar
          key={ `${user.id}-icon` }
          image={ { src: icon } }
          onLoadedData={ handleAvatarChange }
          onLoad={ handleAvatarLoad }
          onError={ handleAvatarError }
          style={ { width: `${SearchUserItemSize.height}px`, height: `${SearchUserItemSize.height}px` } }
        />
      </div>
    </div>
  )
})

AvatarForSearchUserItemNormal.displayName = 'AvatarForSearchUserItemNormal'

const SearchUserItemNormal: FC<Omit<ISearchUserItemNormalProps, 'loading'>> = memo(({ user, onClick }) => {
  const { t } = useTranslation()

  return (
    <SearchUserItemBase
      key={ `${user.id}` }
      testId={ `search-user-item.${user.id}` }
      renderIcon={ (
        <AvatarForSearchUserItemNormal user={ user } />
      ) }
      renderBadge={ user.status.badges.length > 0
        ? (
          <div style={ { display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-start', alignContent: 'center' } }>
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
        )
        : undefined
      }
      renderNickName={ (
        <span>
          {user.profile.nickname}
        </span>
      ) }
      renderTag={ (
        <span>
          {`@${user.profile.tag}`}
        </span>
      ) }
      renderNumberOfFollowers={ (
        <span>
          { t('numberOfFollowers.format', { ns: 'search-user', followers: user.statistics.numberOfFollowers.toLocaleString() }) }
        </span>
      ) }
      renderNumberOfFollowing={ (
        <span>
          { t('numberOfFollowing.format', { ns: 'search-user', following: user.statistics.numberOfFollowing.toLocaleString() }) }
        </span>
      ) }
      onClick={ onClick }
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
        user={ user }
        onClick={ onClick }
      />
    )
})

SearchUserItem.displayName = 'SearchUserItem'
