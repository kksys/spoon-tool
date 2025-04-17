import { Observable } from 'rxjs'

import { IViewModel } from '#/cross-cutting/interfaces/view-models/IViewModel'

import { User } from '../models/User'
import { IUserPaginatorViewModel } from './IUserPaginatorViewModel'

export interface IUserDetailViewModel extends IViewModel {
  readonly followingsPaginator: IUserPaginatorViewModel
  readonly followersPaginator: IUserPaginatorViewModel

  readonly errorBag$: Observable<Error>
  clearErrorBag(): void

  fetchUserDetail(userId: number): Promise<void>
  fetchFollowers(userId: number): Promise<void>
  fetchPreviousFollowers(userId: number): Promise<void>
  fetchNextFollowers(userId: number): Promise<void>
  fetchFollowings(userId: number): Promise<void>
  fetchPreviousFollowings(userId: number): Promise<void>
  fetchNextFollowings(userId: number): Promise<void>

  activeUser: User | undefined
  setActiveUser(userId: number): void
}
