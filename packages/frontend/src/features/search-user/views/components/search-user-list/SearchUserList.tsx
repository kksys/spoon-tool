import {
  CSSProperties,
  FC,
  memo,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { User } from '#/search-user/interfaces/models/User'

import { getSearchUserItemHeight, SearchUserItem } from '../search-user-item/SearchUserItem'

interface ISearchUserListProps {
  userList: User[]
  hasNextPage: boolean
  isBusy: boolean
  loadNextItems: (startIndex: number, stopIndex: number) => Promise<void> | void
  onSelectUser: (userId: number) => void
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
  const [listHeight, setListHeight] = useState(64)

  useEffect(() => {
    const ref = containerRef.current
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const contentRect = entry.contentRect
        setListHeight(contentRect.height)
      }
    })

    if (!ref) {
      return
    }

    resizeObserver.observe(ref)

    return () => {
      resizeObserver.unobserve(ref)
    }
  }, [])

  const Row = memo(({ index, style }: { index: number; style: CSSProperties }) => {
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
              key={ index }
              user={ user }
              onClick={ () => onSelectUser(user.id) }
            />
          )
          : (
            <SearchUserItem
              key={ index }
              loading
            />
          )
        }
      </div>
    )
  })

  const List = useCallback<InfiniteLoader['props']['children']>(({ onItemsRendered, ref }) => {
    return (
      <FixedSizeList
        itemCount={ itemCount }
        itemSize={ getSearchUserItemHeight() }
        width='100%'
        height={ listHeight }
        ref={ ref }
        onItemsRendered={ onItemsRendered }
      >
        {Row}
      </FixedSizeList>
    )
  }, [itemCount, listHeight])

  return (
    <div
      style={ { width: 'calc(100% + 24px)', marginLeft: '-12px', marginRight: '-12px', position: 'relative', flex: '1 1 auto', minHeight: '0' } }
      ref={ containerRef }
    >
      <InfiniteLoader
        isItemLoaded={ isItemLoaded }
        itemCount={ itemCount }
        loadMoreItems={ loadMoreItems }
      >
        { List }
      </InfiniteLoader>
    </div>
  )
})

SearchUserList.displayName = 'SearchUserList'
