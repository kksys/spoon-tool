import { inject, injectable, type interfaces } from 'inversify'
import { BehaviorSubject, firstValueFrom, last, Observable } from 'rxjs'

import { Invoker } from '#/cross-cutting/commands/Invoker'
import { autoBusyAsync } from '#/cross-cutting/decorators/autoBusy'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'
import { SearchUserCommand } from '#/search-user/commands/SearchUserCommand'
import { searchUserTypes } from '#/search-user/di/searchUserTypes'
import { ISearchUserReceiver } from '#/search-user/interfaces/receivers/ISearchUserReceiver'
import type { IUserPaginatorViewModel } from '#/search-user/interfaces/view-models/IUserPaginatorViewModel'
import { IUserViewModel, IUserViewModelProps } from '#/search-user/interfaces/view-models/IUserViewModel'

import { IUserListViewModel } from '../interfaces/view-models/IUserListViewModel'

@injectable()
export class UserListViewModel extends ViewModelBase implements IUserListViewModel, ISearchUserReceiver {
  private _keywordSubject = new BehaviorSubject('')
  private _usersSubject = new BehaviorSubject<IUserViewModel[]>([])
  private _invoker = new Invoker()

  @inject(searchUserTypes.UserPaginatorViewModel) public readonly paginator!: IUserPaginatorViewModel
  @inject(searchUserTypes.UserViewModelFactory)   private readonly userFactory!: interfaces.SimpleFactory<IUserViewModel, [IUserViewModelProps]>

  constructor() {
    super()
  }

  readonly keyword$: Observable<string> = this._keywordSubject.asObservable()

  updateKeyword(value: string) {
    this._keywordSubject.next(value)
  }

  async load(): Promise<void> {}

  async unload(): Promise<void> {}

  readonly userList$: Observable<IUserViewModel[]> = this._usersSubject.asObservable()

  @autoBusyAsync()
  async resetResult(): Promise<void> {
    this._usersSubject.next([])
    this.paginator.updateCursors({ previous: '', next: '' })
  }

  @autoBusyAsync()
  async fetchUserList(): Promise<void> {
    const searchUserCommand = new SearchUserCommand(this, {
      keyword: this._keywordSubject.value,
      cursor: undefined,
      page_size: this.paginator.itemsPerPage,
    } as const)

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async fetchPreviousUserList(): Promise<void> {
    const cursors = await firstValueFrom(this.paginator.cursors$.pipe(last()))
    const url = new URL(cursors.previous)

    const searchUserCommand = new SearchUserCommand(this, {
      keyword: url.searchParams.get('keyword') || '',
      page_size: undefined,
      cursor: url.searchParams.get('cursor') || '',
    } as const)

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async fetchNextUserList(): Promise<void> {
    const cursors = await firstValueFrom(this.paginator.cursors$)
    const url = new URL(cursors.next)

    const searchUserCommand = new SearchUserCommand(this, {
      keyword: url.searchParams.get('keyword') || '',
      page_size: undefined,
      cursor: url.searchParams.get('cursor') || '',
    } as const)

    await this._invoker.execute(searchUserCommand)
  }

  @autoBusyAsync()
  async receivedResult({ next, previous, results }: EndpointTypes['spoonApi']['fetchUsers']['response']): Promise<void> {
    const currentUsers = [...this._usersSubject.getValue()]
    const targetIndex = currentUsers.length
    currentUsers.splice(targetIndex, 0, ...results.map((userEntity) => this.userFactory({
      id: userEntity.id,
      tag: userEntity.tag,
      profileIcon: userEntity.profile_url,
      nickname: userEntity.nickname,
      numberOfFollowers: userEntity.follower_count,
      numberOfFollowing: userEntity.following_count
    })))

    this.paginator.updateCursors({ previous, next })
    this._usersSubject.next(currentUsers)
  }
}
