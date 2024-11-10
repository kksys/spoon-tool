import { ContainerModule, interfaces } from 'inversify'

import { HttpClient } from '#/cross-cutting/http-client/HttpClient'
import { IUserPaginatorViewModel } from '#/search-user/interfaces/view-models/IUserPaginatorViewModel'
import { IUserViewModel, IUserViewModelProps } from '#/search-user/interfaces/view-models/IUserViewModel'
import { UserPaginatorViewModel } from '#/search-user/view-models/UserPaginatorViewModel'
import { UserViewModel } from '#/search-user/view-models/UserViewModel'

import { ApiClient } from '../api/ApiClient'
import { UserRepository } from '../infrastructures/repositories/UserRepository'
import { IApiClient } from '../interfaces/api/IApiClient'
import { IUserRepository } from '../interfaces/repository/IUserRepository'
import { IUserDetailViewModel } from '../interfaces/view-models/IUserDetailViewModel'
import { IUserListViewModel } from '../interfaces/view-models/IUserListViewModel'
import { UserDetailViewModel } from '../view-models/UserDetailViewModel'
import { UserListViewModel } from '../view-models/UserListViewModel'
import { searchUserTypes } from './searchUserTypes'

export const searchUserModule = new ContainerModule((bind) => {
  bind<IApiClient>(searchUserTypes.ApiClient)
    .toDynamicValue(() => {
      const httpClient = new HttpClient([])
      return new ApiClient(httpClient)
    })
    .inSingletonScope()

  bind<IUserPaginatorViewModel>(searchUserTypes.UserPaginatorViewModel)
    .to(UserPaginatorViewModel)
    .inSingletonScope()

  bind<IUserViewModel>(searchUserTypes.UserViewModel)
    .to(UserViewModel)
    .inTransientScope()

  bind<interfaces.Factory<IUserViewModel>>(searchUserTypes.UserViewModelFactory)
    .toFactory<IUserViewModel, IUserViewModelProps[]>(
      (context: interfaces.Context) => {
        return (props: IUserViewModelProps): IUserViewModel => {
          const vm = context.container.get<IUserViewModel>(searchUserTypes.UserViewModel)
          vm.setProperties(props)
          return vm
        }
      },
    )

  bind<IUserListViewModel>(searchUserTypes.UserListViewModel)
    .to(UserListViewModel)
    .inSingletonScope()

  bind<IUserDetailViewModel>(searchUserTypes.UserDetailViewModel)
    .to(UserDetailViewModel)
    .inSingletonScope()

  bind<IUserRepository>(searchUserTypes.UserRepository)
    .to(UserRepository)
    .inSingletonScope()
})
