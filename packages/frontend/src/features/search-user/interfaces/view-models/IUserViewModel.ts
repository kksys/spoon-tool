import { IViewModel } from '#/cross-cutting/interfaces/IViewModel'

export interface IUserViewModelProps {
  id: number
  tag: string
  profileIcon: string
  nickname: string
  numberOfFollowers: number
  numberOfFollowing: number
}

export interface IUserViewModel extends IViewModel, IUserViewModelProps {
  setProperties(props: IUserViewModelProps): void
}
