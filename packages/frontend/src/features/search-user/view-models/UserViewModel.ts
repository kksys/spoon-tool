import { injectable } from 'inversify'

import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { IUserViewModel, IUserViewModelProps } from '#/search-user/interfaces/view-models/IUserViewModel'

@injectable()
export class UserViewModel extends ViewModelBase implements IUserViewModel {
  id!: number
  tag!: string
  profileIcon!: string
  nickname!: string
  numberOfFollowers!: number
  numberOfFollowing!: number

  setProperties(props: IUserViewModelProps): void {
    this.id = props.id
    this.tag = props.tag
    this.profileIcon = props.profileIcon
    this.nickname = props.nickname
    this.numberOfFollowers = props.numberOfFollowers
    this.numberOfFollowing = props.numberOfFollowing
  }
}
