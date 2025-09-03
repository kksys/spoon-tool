import {
  CSSProperties,
  FC,
  memo,
  MouseEventHandler,
  useCallback,
  useRef,
  useState
} from 'react'
import { List, type RowComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { User } from '#/search-user/interfaces/models/User'

import { getSearchUserItemHeight, SearchUserItem } from '../search-user-item/SearchUserItem'

interface SearchUserRowProps {
  userList: User[]
  onSelectUser?: (userId: number) => void
}

const SearchUserRow = memo(({ index, style, userList, onSelectUser }: RowComponentProps<SearchUserRowProps>) => {
  const [styleProp, setStyleProp] = useState<Pick<CSSProperties, 'backgroundColor'>>({ backgroundColor: 'unset' })
  const handleOver = useCallback<MouseEventHandler<HTMLDivElement>>(() => {
    setStyleProp({
      ...styleProp,
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
    })
  }, [styleProp])
  const handleOut = useCallback<MouseEventHandler<HTMLDivElement>>(() => {
    setStyleProp({
      ...styleProp,
      backgroundColor: 'unset'
    })
  }, [styleProp])

  const user = userList[index]
  return (
    <div
      style={ { ...style, ...styleProp, cursor: 'pointer', transition: 'background-color .3s linear' } }
      onMouseOver={ handleOver }
      onMouseOut={ handleOut }
    >
      {user
        ? (
          <SearchUserItem
            key={ `user-id-${user.id}` }
            user={ user }
            onClick={ () => onSelectUser?.(user.id) }
          />
        )
        : (
          <SearchUserItem
            key={ `loading.${index}` }
            loading
          />
        )
      }
    </div>
  )
})

interface ISearchUserListProps {
  userList: User[]
  hasNextPage: boolean
  isBusy: boolean
  loadNextItems: (startIndex: number, stopIndex: number) => Promise<void> | void
  onSelectUser?: (userId: number) => void
}

export const SearchUserList: FC<ISearchUserListProps> = memo(({ userList, hasNextPage, isBusy, loadNextItems, onSelectUser }) => {
  const itemCount = userList.length + (hasNextPage ? 1 : 0)

  const isItemLoaded = (index: number) => !hasNextPage || index < userList.length

  const loadMoreItems = useCallback((startIndex: number, stopIndex: number) => {
    if (isBusy) {
      return
    }

    loadNextItems(startIndex, stopIndex)
  }, [isBusy, loadNextItems])

  const containerRef = useRef<HTMLDivElement>(null)

  const ListComponent = useCallback<InfiniteLoader['props']['children']>(({ onItemsRendered, ref }) => {
    return (
      <List
        rowComponent={SearchUserRow}
        rowCount={itemCount}
        rowHeight={getSearchUserItemHeight()}
        listRef={ref}
        onRowsRendered={({ startIndex, stopIndex }) => {
          onItemsRendered({
            overscanStartIndex: startIndex,
            overscanStopIndex: stopIndex,
            visibleStartIndex: startIndex,
            visibleStopIndex: stopIndex,
          })
        }}
        rowProps={{ userList, onSelectUser }}
      />
    )
  }, [itemCount, userList, onSelectUser])

  return (
    <div
      style={ { width: 'calc(100% + 24px)', marginLeft: '-12px', marginRight: '-12px', position: 'relative', flex: '1 1 auto', minHeight: '0' } }
      ref={ containerRef }
      data-testid='search-user-list'
    >
      <InfiniteLoader
        isItemLoaded={ isItemLoaded }
        itemCount={ itemCount }
        loadMoreItems={ loadMoreItems }
      >
        { ListComponent }
      </InfiniteLoader>
    </div>
  )
})

SearchUserList.displayName = 'SearchUserList'
