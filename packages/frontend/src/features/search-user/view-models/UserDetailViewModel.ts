import { inject, injectable } from 'inversify'
import { BehaviorSubject, filter, Observable } from 'rxjs'

import { Invoker } from '#/cross-cutting/commands/Invoker'
import { autoBusyAsync } from '#/cross-cutting/decorators/autoBusy'
import { ApiError } from '#/cross-cutting/interfaces/errors/IApiError'
import { Result } from '#/cross-cutting/utils/Result'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'
import { FetchUserDetailCommand } from '#/search-user/commands/FetchUserDetailCommand'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import type { IApiClient } from '#/search-user/interfaces/api/IApiClient'
import { IFetchUserDetailReceiver } from '#/search-user/interfaces/receivers/IFetchUserDetailReceiver'
import type { IUserRepository } from '#/search-user/interfaces/repository/IUserRepository'
import { IUserDetailViewModel } from '#/search-user/interfaces/view-models/IUserDetailViewModel'

import { User } from '../interfaces/models/User'

@injectable()
export class UserDetailViewModel extends ViewModelBase implements IUserDetailViewModel, IFetchUserDetailReceiver {
  private _errorBag = new BehaviorSubject<Error | undefined>(undefined)
  private _invoker = new Invoker()

  constructor(
    @inject(searchUserTypes.ApiClient)              private readonly apiClient: IApiClient,
    @inject(searchUserTypes.UserRepository)         private readonly userRepository: IUserRepository,
  ) {
    super()
  }

  readonly errorBag$: Observable<Error> = this._errorBag.asObservable()
    .pipe(filter((error): error is Error => error !== undefined))

  clearErrorBag() {
    this._errorBag.next(undefined)
  }

  @autoBusyAsync()
  async fetchUserDetail(userId: number): Promise<void> {
    const fetchUserDetailCommand = new FetchUserDetailCommand(
      this,
      this.apiClient,
      {
        user_id: userId
      }
    )

    await this._invoker.execute(fetchUserDetailCommand)
  }

  private _activeUser: User | undefined

  get activeUser(): User | undefined {
    return this._activeUser
  }

  setActiveUser(userId: number): void {
    this.userRepository.fetchById(userId)
      .then(user => {
        this._activeUser = user
      })
  }

  @autoBusyAsync()
  async receivedFetchUserDetailResult(result: Result<EndpointTypes['spoonApi']['getProfile']['response'], ApiError>): Promise<void> {
    if (result.isError) {
      this._errorBag.next(result.error)
      throw result.error
    }

    const { results } = result.value
    const targetUser = await this.userRepository.fetchById(results[0].id)
    const user = results[0]

    if (targetUser && user) {
      targetUser.profile.joinedDate = new Date(user.date_joined)
      this.userRepository.update(targetUser)
    }

    this.userRepository.save()
  }
}
