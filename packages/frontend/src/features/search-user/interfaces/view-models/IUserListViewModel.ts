import { Observable } from 'rxjs'

import { IViewModel } from '#/cross-cutting/interfaces/view-models/IViewModel'

import { User } from '../models/User'
import { IUserPaginatorViewModel } from './IUserPaginatorViewModel'

export interface IUserListViewModel extends IViewModel {
  readonly paginator: IUserPaginatorViewModel

  readonly keyword$: Observable<string>
  updateKeyword(value: string): void

  readonly errorBag$: Observable<Error>
  clearErrorBag(): void

  readonly userList$: Observable<User[]>
  resetResult(): Promise<void>
  fetchUserList(): Promise<void>
  fetchPreviousUserList(): Promise<void>
  fetchNextUserList(): Promise<void>
}
