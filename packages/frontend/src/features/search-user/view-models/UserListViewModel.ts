import { inject, injectable } from 'inversify'
import { BehaviorSubject, filter, firstValueFrom, last, Observable, switchMap } from 'rxjs'
import { fromPromise } from 'rxjs/internal/observable/innerFrom'

import { Invoker } from '#/cross-cutting/commands/Invoker'
import { autoBusyAsync } from '#/cross-cutting/decorators/autoBusy'
import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { ApiError } from '#/cross-cutting/interfaces/errors/IApiError'
import type { IEventAggregator } from '#/cross-cutting/interfaces/event-aggregator/IEventAggregator'
import { Result } from '#/cross-cutting/utils/Result'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'
import { SearchUserCommand } from '#/search-user/commands/SearchUserCommand'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import type { IApiClient } from '#/search-user/interfaces/api/IApiClient'
import { User } from '#/search-user/interfaces/models/User'
import { ISearchUserReceiver } from '#/search-user/interfaces/receivers/ISearchUserReceiver'
import type { IUserRepository } from '#/search-user/interfaces/repository/IUserRepository'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'
import type { IUserPaginatorViewModel } from '#/search-user/interfaces/view-models/IUserPaginatorViewModel'
import { mapUserEntityToUser } from '#/search-user/utils/UserMapper'

@injectable()
export class UserListViewModel extends ViewModelBase implements IUserListViewModel, ISearchUserReceiver {
  private _keywordSubject = new BehaviorSubject('')
  private _errorBag = new BehaviorSubject<Error | undefined>(undefined)
  private _invoker = new Invoker()

  constructor(
    @inject(crossCuttingTypes.EventAggregator)      private readonly eventAggregator: IEventAggregator,
    @inject(searchUserTypes.ApiClient)              private readonly apiClient: IApiClient,
    @inject(searchUserTypes.UserPaginatorViewModel) public readonly paginator: IUserPaginatorViewModel,
    @inject(searchUserTypes.UserRepository)         private readonly userRepository: IUserRepository,
  ) {
    super()
  }

  readonly keyword$: Observable<string> = this._keywordSubject.asObservable()

  updateKeyword(value: string) {
    this._keywordSubject.next(value)
  }

  readonly errorBag$: Observable<Error> = this._errorBag.asObservable()
    .pipe(filter((error): error is Error => error !== undefined))

  clearErrorBag() {
    this._errorBag.next(undefined)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async load(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async unload(): Promise<void> {}

  readonly userList$: Observable<User[]> = this.eventAggregator.getEvent('user-repository-save').subscribe$
    .pipe(
      switchMap(_ => fromPromise(this.userRepository.fetchAll())),
    )

  @autoBusyAsync()
  async resetResult(): Promise<void> {
    await this.userRepository.clear()
    await this.userRepository.save()
    this.paginator.updateCursors({ previous: '', next: '' })
  }

  @autoBusyAsync()
  async fetchUserList(): Promise<void> {
    const searchUserCommand = new SearchUserCommand(
      this,
      this.apiClient,
      {
        keyword: this._keywordSubject.value,
        cursor: undefined,
        page_size: this.paginator.itemsPerPage,
      } as const
    )

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async fetchPreviousUserList(): Promise<void> {
    const cursors = await firstValueFrom(this.paginator.cursors$.pipe(last()))
    const url = new URL(cursors.previous)

    const searchUserCommand = new SearchUserCommand(
      this,
      this.apiClient,
      {
        keyword: url.searchParams.get('keyword') || '',
        page_size: undefined,
        cursor: url.searchParams.get('cursor') || '',
      } as const
    )

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async fetchNextUserList(): Promise<void> {
    const cursors = await firstValueFrom(this.paginator.cursors$)
    const url = new URL(cursors.next)

    const searchUserCommand = new SearchUserCommand(
      this,
      this.apiClient,
      {
        keyword: url.searchParams.get('keyword') || '',
        page_size: undefined,
        cursor: url.searchParams.get('cursor') || '',
      } as const
    )

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async receivedSearchUserResult(result: Result<EndpointTypes['spoonApi']['fetchUsers']['response'], ApiError>): Promise<void> {
    if (result.isError) {
      this._errorBag.next(result.error)
      throw result.error
    }

    const { next, previous, results } = result.value
    const currentUsers = await this.userRepository.fetchAll()

    // update existing user
    const ids = results.filter(user1 => currentUsers.some(user2 => user2.id === user1.id))
      .map(user => user.id)

    results.filter(entry => entry.id in ids)
      .forEach((sourceUser) => {
        this.userRepository.update(mapUserEntityToUser(sourceUser))
      })

    // create new user
    results.filter(entry => !(entry.id in ids))
      .forEach((userEntity) => {
        this.userRepository.add(mapUserEntityToUser(userEntity))
      })

    this.paginator.updateCursors({ previous, next })
    this.userRepository.save()
  }
}
