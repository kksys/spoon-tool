import { Observable } from 'rxjs'

import { IViewModel } from '#/cross-cutting/interfaces/view-models/IViewModel'

import { IUserPaginatorViewModel } from './IUserPaginatorViewModel'
import { IUserViewModel } from './IUserViewModel'

export interface IUserListViewModel extends IViewModel {
  readonly paginator: IUserPaginatorViewModel

  readonly keyword$: Observable<string>
  updateKeyword(value: string): void

  readonly errorBag$: Observable<Error>
  clearErrorBag(): void

  readonly userList$: Observable<IUserViewModel[]>
  resetResult(): Promise<void>
  fetchUserList(): Promise<void>
  fetchPreviousUserList(): Promise<void>
  fetchNextUserList(): Promise<void>
  fetchUserDetail(userId: number): Promise<void>

  activeUser: IUserViewModel | undefined
  setActiveUser(userId: number): void
}
