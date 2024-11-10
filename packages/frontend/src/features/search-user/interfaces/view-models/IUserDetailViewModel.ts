import { Observable } from 'rxjs'

import { IViewModel } from '#/cross-cutting/interfaces/view-models/IViewModel'

import { User } from '../models/User'

export interface IUserDetailViewModel extends IViewModel {
  readonly errorBag$: Observable<Error>
  clearErrorBag(): void

  fetchUserDetail(userId: number): Promise<void>

  activeUser: User | undefined
  setActiveUser(userId: number): void
}
