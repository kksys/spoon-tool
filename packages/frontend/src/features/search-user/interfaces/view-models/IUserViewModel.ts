import { IViewModel } from '#/cross-cutting/interfaces/view-models/IViewModel'
import { BadgeStyleId, TierName } from '#/search-user/api/EndpointTypes'

export interface IUserViewModelProps {
  id: number
  tag: string
  profileIcon: string
  nickname: string
  numberOfFollowers: number
  numberOfFollowing: number
  badges: (Exclude<TierName, ''> | Extract<BadgeStyleId, 'voice' | 'firework_ring'>)[]
}

export interface IUserViewModelDetail {
  joinedDate: Date
}

export interface IUserViewModel extends IViewModel {
  properties: IUserViewModelProps
  setProperties(props: IUserViewModelProps): void

  detail: IUserViewModelDetail | undefined
  setDetail(detail: IUserViewModelDetail): void
}
