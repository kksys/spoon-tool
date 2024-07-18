import { Observable } from 'rxjs'

import { IViewModel } from '#/cross-cutting/interfaces/IViewModel'

import { IUserPaginatorViewModel } from './IUserPaginatorViewModel'
import { IUserViewModel } from './IUserViewModel'

export interface IUserListViewModel extends IViewModel {
  readonly paginator: IUserPaginatorViewModel

  readonly keyword$: Observable<string>
  updateKeyword(value: string): void

  readonly userList$: Observable<IUserViewModel[]>
  resetResult(): Promise<void>
  fetchUserList(): Promise<void>
  fetchPreviousUserList(): Promise<void>
  fetchNextUserList(): Promise<void>
}
