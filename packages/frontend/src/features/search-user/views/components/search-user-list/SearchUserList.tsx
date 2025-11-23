import {
  CSSProperties,
  FC,
  memo,
  MouseEventHandler,
  useCallback,
  useRef,
  useState
} from 'react'
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window'
import { useInfiniteLoader } from 'react-window-infinite-loader'

import { User } from '#/search-user/interfaces/models/User'

import { getSearchUserItemHeight, SearchUserItem } from '../search-user-item/SearchUserItem'

interface SearchUserRowProps {
  userList: User[]
  onSelectUser?: (userId: number) => void
}

const SearchUserRow = ({ index, style, userList, onSelectUser }: RowComponentProps<SearchUserRowProps>) => {
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
      { user
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
}

interface ISearchUserListProps {
  userList: User[]
  hasNextPage: boolean
  isBusy: boolean
  loadNextItems: (startIndex: number, stopIndex: number) => Promise<void> | void
  onSelectUser?: (userId: number) => void
}

export const SearchUserList: FC<ISearchUserListProps> = memo(({ userList, hasNextPage, isBusy, loadNextItems, onSelectUser }) => {
  const rowCount = userList.length + (hasNextPage ? 1 : 0)

  const isRowLoaded = (index: number) => !hasNextPage || index < userList.length

  const loadMoreRows = useCallback((startIndex: number, stopIndex: number) => {
    if (isBusy) {
      return Promise.resolve()
    }

    const result = loadNextItems(startIndex, stopIndex)
    return Promise.resolve(result)
  }, [isBusy, loadNextItems])

  const containerRef = useRef<HTMLDivElement>(null)

  const onRowsRendered = useInfiniteLoader({
    isRowLoaded,
    loadMoreRows,
    rowCount,
  })

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: getSearchUserItemHeight(),
  })

  return (
    <div
      style={ { width: 'calc(100% + 24px)', marginLeft: '-12px', marginRight: '-12px', position: 'relative', flex: '1 1 auto', minHeight: '0' } }
      ref={ containerRef }
      data-testid='search-user-list'
    >
      <List
        rowComponent={ SearchUserRow }
        rowCount={ rowCount }
        rowHeight={ dynamicRowHeight }
        onRowsRendered={ onRowsRendered }
        rowProps={ { userList, onSelectUser } }
      />
    </div>
  )
})

SearchUserList.displayName = 'SearchUserList'
