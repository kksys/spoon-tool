import { Badge, makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { FC, memo, useMemo } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export enum SearchUserBadgeType {
  Original = 'Original',
  Yellow_Choice = 'Yellow_Choice',
  Red_Choice = 'Red_Choice',
  Orange_Choice = 'Orange_Choice',
  Vip = 'Vip',
  VVip = 'VVip',
  SVip = 'SVip',
  Royal = 'Royal',
  Voice = 'Voice',
}

interface ISearchUserItemLoadingProps {
  type: SearchUserBadgeType
}

const useStyles = makeStyles({
  Base: {
    height: '16px',
    letterSpacing: '-0.5px',
    padding: `0 ${tokens.spacingVerticalXS}`,
  },
  Original: {
    backgroundColor: '#FF275C',
    color: tokens.colorNeutralForegroundOnBrand,
  },
  Yellow_Choice: {
    backgroundColor: '#FF9800',
    color: tokens.colorNeutralForeground1,
  },
  Red_Choice: {
    backgroundColor: '#B71C1C',
    color: tokens.colorNeutralForeground1,
  },
  Orange_Choice: {
    backgroundColor: '#FF4100',
    color: tokens.colorNeutralForeground1,
  },
  Vip: {
    backgroundColor: '#DAAC0C',
    color: tokens.colorNeutralForeground1,
  },
  VVip: {
    backgroundColor: '#DAAC0C',
    color: tokens.colorNeutralForeground1,
  },
  SVip: {
    backgroundColor: '#DAAC0C',
    color: tokens.colorNeutralForeground1,
  },
  Royal: {
    backgroundColor: '#DAAC0C',
    color: tokens.colorNeutralForegroundOnBrand,
  },
  Voice: {
    backgroundColor: '#536DFE',
    color: tokens.colorNeutralForegroundOnBrand,
  },
})

export const SearchUserBadge: FC<ISearchUserItemLoadingProps> = memo(({ type }) => {
  const styles = useStyles()

  const literal = useMemo(() => {
    switch (type) {
    case SearchUserBadgeType.Original:
      return 'Original'
    case SearchUserBadgeType.Red_Choice:
    case SearchUserBadgeType.Orange_Choice:
    case SearchUserBadgeType.Yellow_Choice:
      return 'Choice'
    case SearchUserBadgeType.Vip:
    case SearchUserBadgeType.VVip:
    case SearchUserBadgeType.SVip:
      return 'Vip'
    case SearchUserBadgeType.Royal:
      return 'Royal'
    case SearchUserBadgeType.Voice:
      return 'Voice'
    }
  }, [type])

  return (
    <Badge className={ mergeClasses(styles.Base, styles[type]) }>
      { literal }
    </Badge>
  )
})

SearchUserBadge.displayName = 'SearchUserBadge'
