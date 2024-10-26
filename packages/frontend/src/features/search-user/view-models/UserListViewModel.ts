import { inject, injectable, type interfaces } from 'inversify'
import { BehaviorSubject, firstValueFrom, last, Observable } from 'rxjs'

import { Invoker } from '#/cross-cutting/commands/Invoker'
import { autoBusyAsync } from '#/cross-cutting/decorators/autoBusy'
import { Result } from '#/cross-cutting/utils/Result'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'
import { FetchUserDetailCommand } from '#/search-user/commands/FetchUserDetailCommand'
import { SearchUserCommand } from '#/search-user/commands/SearchUserCommand'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { ISearchUserReceiver } from '#/search-user/interfaces/receivers/ISearchUserReceiver'
import { IUserListViewModel } from '#/search-user/interfaces/view-models/IUserListViewModel'
import type { IUserPaginatorViewModel } from '#/search-user/interfaces/view-models/IUserPaginatorViewModel'
import { IUserViewModel, IUserViewModelProps } from '#/search-user/interfaces/view-models/IUserViewModel'

import type { IApiClient } from '../interfaces/api/IApiClient'

@injectable()
export class UserListViewModel extends ViewModelBase implements IUserListViewModel, ISearchUserReceiver {
  private _keywordSubject = new BehaviorSubject('')
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

  @autoBusyAsync()
  async receivedSearchUserResult(result: Result<EndpointTypes['spoonApi']['fetchUsers']['response']>): Promise<void> {
    if (result.isError()) {
      return
    }

    const { next, previous, results } = result.value
    const currentUsers = this._usersSubject.getValue()
    const targetIndex = currentUsers.length

    const convertHttpToHttps = (url: string) =>
      (url.startsWith('http:') && window.location.protocol === 'https:')
        // http resource is referenced by https resource
        // but it is not secure, so it will be fallback to https automatically
        ? url.replace(/^http:/gi, 'https:')
        : url

    const indexies = results.filter(user1 => currentUsers.some(user2 => user2.properties.id === user1.id))
      .map(user => user.id)
      .map(id => currentUsers.findIndex(user => user.properties.id === id))

    for (const index of indexies) {
      const userEntity = currentUsers[index]
      const sourceUser = results.find(user => user.id === index)

      if (!sourceUser) {
        continue
      }

      const property: IUserViewModelProps = {
        id: sourceUser.id,
        tag: sourceUser.tag,
        profileIcon: convertHttpToHttps(sourceUser.profile_url),
        nickname: sourceUser.nickname,
        numberOfFollowers: sourceUser.follower_count,
        numberOfFollowing: sourceUser.following_count,
        badges: [],
      }

      if (sourceUser.tier_name) {
        property.badges.push(sourceUser.tier_name)
      }

      const badge_style_ids = sourceUser.badge_style_ids.filter(id => id === 'voice' || id === 'firework_ring')
      if (badge_style_ids.length > 0) {
        property.badges.push(...badge_style_ids)
      }

      userEntity.setProperties(property)
    }

    currentUsers.splice(targetIndex, 0, ...results.map((userEntity) => {
      const property: IUserViewModelProps = {
        id: userEntity.id,
        tag: userEntity.tag,
        profileIcon: convertHttpToHttps(userEntity.profile_url),
        nickname: userEntity.nickname,
        numberOfFollowers: userEntity.follower_count,
        numberOfFollowing: userEntity.following_count,
        badges: [],
      }

      if (userEntity.tier_name) {
        property.badges.push(userEntity.tier_name)
      }

      const badge_style_ids = userEntity.badge_style_ids.filter(id => id === 'voice' || id === 'firework_ring')
      if (badge_style_ids.length > 0) {
        property.badges.push(...badge_style_ids)
      }

      return this.userFactory(property)
    }))

    this.paginator.updateCursors({ previous, next })
    this._usersSubject.next(currentUsers)
  }

  @autoBusyAsync()
  async receivedFetchUserDetailResult(result: Result<EndpointTypes['spoonApi']['getProfile']['response']>): Promise<void> {
    if (result.isError()) {
      return
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
