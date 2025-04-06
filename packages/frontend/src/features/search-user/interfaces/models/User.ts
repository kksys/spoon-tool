import { BadgeStyleId, TierName } from '#/search-user/api/EndpointTypes'

export interface ProfileInfo {
  tag: string
  profileIcon: string
  nickname: string
  joinedDate: Date | undefined
}

export interface StatisticsInfo {
  numberOfFollowers: number
  numberOfFollowing: number
}

export interface FollowRelationsInfo {
  followers: User[]
  followings: User[]
}

export interface StatusInfo {
  badges: (Exclude<TierName, ''> | Extract<BadgeStyleId, 'voice' | 'firework_ring'>)[]
}

export interface User {
  id: number
  profile: ProfileInfo
  statistics: StatisticsInfo
  relations: FollowRelationsInfo
  status: StatusInfo
}
