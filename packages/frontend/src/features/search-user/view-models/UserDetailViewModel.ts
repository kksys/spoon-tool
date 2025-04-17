import { inject, injectable, named } from 'inversify'
import { BehaviorSubject, filter, firstValueFrom, last, lastValueFrom, Observable } from 'rxjs'

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

import { FetchFollowerListCommand } from '../commands/FetchFollowerListCommand'
import { FetchFollowingListCommand } from '../commands/FetchFollowingListCommand'
import { userPaginatorViewModelName } from '../di/userPaginatorViewModelName'
import { User } from '../interfaces/models/User'
import { IFetchFollowerListReceiver } from '../interfaces/receivers/IFetchFollowerListReceiver'
import { IFetchFollowingListReceiver } from '../interfaces/receivers/IFetchFollowingListReceiver'
import type { IUserPaginatorViewModel } from '../interfaces/view-models/IUserPaginatorViewModel'
import { mapUserEntityToRelationUser } from '../utils/UserMapper'

@injectable()
export class UserDetailViewModel extends ViewModelBase implements IUserDetailViewModel, IFetchUserDetailReceiver, IFetchFollowerListReceiver, IFetchFollowingListReceiver {
  private _errorBag = new BehaviorSubject<Error | undefined>(undefined)
  private _invoker = new Invoker()

  constructor(
    @inject(searchUserTypes.ApiClient)              private readonly apiClient: IApiClient,
    @inject(searchUserTypes.UserRepository)         private readonly userRepository: IUserRepository,
    @inject(searchUserTypes.UserPaginatorViewModel)
    @named(userPaginatorViewModelName.followings)   public readonly followingsPaginator: IUserPaginatorViewModel,
    @inject(searchUserTypes.UserPaginatorViewModel)
    @named(userPaginatorViewModelName.followers)    public readonly followersPaginator: IUserPaginatorViewModel,
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

  @autoBusyAsync()
  async fetchFollowers(userId: number): Promise<void> {
    const fetchFollowerCommand = new FetchFollowerListCommand(
      this,
      this.apiClient,
      {
        id: userId,
        cursor: undefined,
        page_size: this.followersPaginator.itemsPerPage,
      }
    )

    await this._invoker.execute(fetchFollowerCommand)
  }

  @autoBusyAsync()
  async fetchPreviousFollowers(userId: number): Promise<void> {
    const cursors = await firstValueFrom(this.followersPaginator.cursors$.pipe(last()))
    const url = new URL(cursors.previous)

    const searchUserCommand = new FetchFollowerListCommand(
      this,
      this.apiClient,
      {
        id: userId,
        page_size: undefined,
        cursor: url.searchParams.get('cursor') || '',
      } as const
    )

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async fetchNextFollowers(userId: number): Promise<void> {
    const cursors = await firstValueFrom(this.followersPaginator.cursors$)
    const url = new URL(cursors.next)

    const searchUserCommand = new FetchFollowerListCommand(
      this,
      this.apiClient,
      {
        id: userId,
        page_size: undefined,
        cursor: url.searchParams.get('cursor') || '',
      } as const
    )

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async fetchFollowings(userId: number): Promise<void> {
    const fetchFollowingListCommand = new FetchFollowingListCommand(
      this,
      this.apiClient,
      {
        id: userId,
        cursor: undefined,
        page_size: this.followingsPaginator.itemsPerPage,
      }
    )

    await this._invoker.execute(fetchFollowingListCommand)
  }

  @autoBusyAsync()
  async fetchPreviousFollowings(userId: number): Promise<void> {
    const cursors = await firstValueFrom(this.followingsPaginator.cursors$.pipe(last()))
    const url = new URL(cursors.previous)

    const searchUserCommand = new FetchFollowingListCommand(
      this,
      this.apiClient,
      {
        id: userId,
        page_size: undefined,
        cursor: url.searchParams.get('cursor') || '',
      } as const
    )

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async fetchNextFollowings(userId: number): Promise<void> {
    const cursors = await firstValueFrom(this.followingsPaginator.cursors$)
    const url = new URL(cursors.next)

    const searchUserCommand = new FetchFollowingListCommand(
      this,
      this.apiClient,
      {
        id: userId,
        page_size: undefined,
        cursor: url.searchParams.get('cursor') || '',
      } as const
    )

    await this._invoker.execute(searchUserCommand)
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

  async receivedFetchFollowingListResult(result: Result<EndpointTypes['spoonApi']['fetchFollowings']['response'], ApiError>): Promise<void> {
    if (result.isError) {
      this._errorBag.next(result.error)
      throw result.error
    }

    if (this.activeUser === undefined) {
      const error = new Error('activeUser is undefined')
      this._errorBag.next(error)
      throw error
    }

    const { next, previous, results } = result.value
    const currentUser = await this.userRepository.fetchById(this.activeUser.id)

    if (currentUser === undefined) {
      const error = new Error('currentUser is undefined')
      this._errorBag.next(error)
      throw error
    }

    // update existing user
    const ids = results.filter(user1 => currentUser.relations.followings.some(user2 => user2.id === user1.id))
      .map(user => user.id)

    results.filter(entry => ids.includes(entry.id))
      .forEach((sourceUser) => {
        const targetUser = currentUser.relations.followings.find(user => user.id === sourceUser.id)
        const user = mapUserEntityToRelationUser(sourceUser)

        if (targetUser === undefined) {
          return
        }

        targetUser.profile = user.profile
        targetUser.relations = user.relations
        targetUser.statistics = user.statistics
        targetUser.status = user.status
      })

    // create new user
    results.filter(entry => !(entry.id in ids))
      .forEach((userEntity) => {
        currentUser?.relations.followings.push(mapUserEntityToRelationUser(userEntity))
      })

    this.userRepository.update(currentUser)

    this.followingsPaginator.updateCursors({ previous, next })
    this.userRepository.save()
  }

  async receivedFetchFollowerListResult(result: Result<EndpointTypes['spoonApi']['fetchFollowers']['response'], ApiError>): Promise<void> {
    if (result.isError) {
      this._errorBag.next(result.error)
      throw result.error
    }

    if (this.activeUser === undefined) {
      const error = new Error('activeUser is undefined')
      this._errorBag.next(error)
      throw error
    }

    const { next, previous, results } = result.value
    const currentUser = await this.userRepository.fetchById(this.activeUser.id)

    if (currentUser === undefined) {
      const error = new Error('currentUser is undefined')
      this._errorBag.next(error)
      throw error
    }

    // update existing user
    const ids = results.filter(user1 => currentUser?.relations.followers.some(user2 => user2.id === user1.id))
      .map(user => user.id)

    results.filter(entry => ids.includes(entry.id))
      .forEach((sourceUser) => {
        const targetUser = currentUser.relations.followers.find(user => user.id === sourceUser.id)
        const user = mapUserEntityToRelationUser(sourceUser)

        if (targetUser === undefined) {
          return
        }

        targetUser.profile = user.profile
        targetUser.relations = user.relations
        targetUser.statistics = user.statistics
        targetUser.status = user.status
      })

    // create new user
    results.filter(entry => !(entry.id in ids))
      .forEach((userEntity) => {
        currentUser?.relations.followers.push(mapUserEntityToRelationUser(userEntity))
      })

    this.userRepository.update(currentUser);

    (async () => {
      const currentNext = (await lastValueFrom(this.followersPaginator.cursors$)).next

      console.debug({ currentNext, next })
    })()

    this.followersPaginator.updateCursors({ previous, next })
    this.userRepository.save()
  }
}
