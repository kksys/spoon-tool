import { inject, injectable, type interfaces } from 'inversify'
import { BehaviorSubject, filter, firstValueFrom, last, Observable } from 'rxjs'

import { Invoker } from '#/cross-cutting/commands/Invoker'
import { autoBusyAsync } from '#/cross-cutting/decorators/autoBusy'
import { ApiError } from '#/cross-cutting/interfaces/errors/IApiError'
import { Result } from '#/cross-cutting/utils/Result'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { EndpointTypes, UserEntry } from '#/search-user/api/EndpointTypes'
import { FetchUserDetailCommand } from '#/search-user/commands/FetchUserDetailCommand'
import { SearchUserCommand } from '#/search-user/commands/SearchUserCommand'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import type { IApiClient } from '#/search-user/interfaces/api/IApiClient'
import { IFetchUserDetailReceiver } from '#/search-user/interfaces/receivers/IFetchUserDetailReceiver'
import { ISearchUserReceiver } from '#/search-user/interfaces/receivers/ISearchUserReceiver'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'
import type { IUserPaginatorViewModel } from '#/search-user/interfaces/view-models/IUserPaginatorViewModel'
import { IUserViewModel, IUserViewModelProps } from '#/search-user/interfaces/view-models/IUserViewModel'

@injectable()
export class UserListViewModel extends ViewModelBase implements IUserListViewModel, ISearchUserReceiver, IFetchUserDetailReceiver {
  private _keywordSubject = new BehaviorSubject('')
  private _errorBag = new BehaviorSubject<Error | undefined>(undefined)
  private _usersSubject = new BehaviorSubject<IUserViewModel[]>([])
  private _invoker = new Invoker()

  constructor(
    @inject(searchUserTypes.ApiClient)              private readonly apiClient: IApiClient,
    @inject(searchUserTypes.UserPaginatorViewModel) public readonly paginator: IUserPaginatorViewModel,
    @inject(searchUserTypes.UserViewModelFactory)   private readonly userFactory: interfaces.SimpleFactory<IUserViewModel, [IUserViewModelProps]>
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

  readonly userList$: Observable<IUserViewModel[]> = this._usersSubject.asObservable()

  @autoBusyAsync()
  async resetResult(): Promise<void> {
    this._usersSubject.next([])
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

  private _activeUser: IUserViewModel | undefined

  get activeUser(): IUserViewModel | undefined {
    return this._activeUser
  }

  setActiveUser(userId: number): void {
    this._activeUser = this._usersSubject.getValue()
      .find(user => user.properties.id === userId)
  }

  private mapUserToUserViewModelProps(user: UserEntry): IUserViewModelProps {
    const convertHttpToHttps = (url: string) =>
      (url.startsWith('http:') && window.location.protocol === 'https:')
        // http resource is referenced by https resource
        // but it is not secure, so it will be fallback to https automatically
        ? url.replace(/^http:/gi, 'https:')
        : url

    const property: IUserViewModelProps = {
      id: user.id,
      tag: user.tag,
      profileIcon: convertHttpToHttps(user.profile_url),
      nickname: user.nickname,
      numberOfFollowers: user.follower_count,
      numberOfFollowing: user.following_count,
      badges: [],
    }

    if (user.tier_name) {
      property.badges.push(user.tier_name)
    }

    const badge_style_ids = user.badge_style_ids.filter(id => id === 'voice' || id === 'firework_ring')
    if (badge_style_ids.length > 0) {
      property.badges.push(...badge_style_ids)
    }

    return property
  }

  @autoBusyAsync()
  async receivedSearchUserResult(result: Result<EndpointTypes['spoonApi']['fetchUsers']['response'], ApiError>): Promise<void> {
    if (result.isError) {
      this._errorBag.next(result.error)
      throw result.error
    }

    const { next, previous, results } = result.value
    const currentUsers = this._usersSubject.getValue()
    const targetIndex = currentUsers.length

    // update existing user
    const ids = results.filter(user1 => currentUsers.some(user2 => user2.properties.id === user1.id))
      .map(user => user.id)

    results.filter(entry => entry.id in ids)
      .forEach((sourceUser) => {
        const userEntity = currentUsers.find(user => user.properties.id === sourceUser.id)
        userEntity?.setProperties(this.mapUserToUserViewModelProps(sourceUser))
      })

    // create new user
    currentUsers.splice(targetIndex, 0, ...results.filter(entry => !(entry.id in ids))
      .map((userEntity) => {
        return this.userFactory(this.mapUserToUserViewModelProps(userEntity))
      }))

    this.paginator.updateCursors({ previous, next })
    this._usersSubject.next(currentUsers)
  }

  @autoBusyAsync()
  async receivedFetchUserDetailResult(result: Result<EndpointTypes['spoonApi']['getProfile']['response'], ApiError>): Promise<void> {
    if (result.isError) {
      this._errorBag.next(result.error)
      throw result.error
    }

    const { results } = result.value
    const currentUsers = this._usersSubject.getValue()
    const targetUser = currentUsers.find(user => user.properties.id === results[0].id)
    const user = results[0]

    if (user) {
      targetUser?.setDetail({
        joinedDate: new Date(user.date_joined),
      })
    }

    this._usersSubject.next(currentUsers)
  }
}
