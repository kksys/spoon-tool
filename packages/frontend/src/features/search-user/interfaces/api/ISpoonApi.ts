import { ApiError } from '#/cross-cutting/interfaces/errors/IApiError'
import { Result } from '#/cross-cutting/utils/Result'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'

export interface ISpoonApi {
  fetchUsers(
    params: EndpointTypes['spoonApi']['fetchUsers']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['fetchUsers']['response'], ApiError>>

  getProfile(
    params: EndpointTypes['spoonApi']['getProfile']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['getProfile']['response'], ApiError>>

  fetchFollowers(
    params: EndpointTypes['spoonApi']['fetchFollowers']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['fetchFollowers']['response'], ApiError>>

  fetchFollowings(
    params: EndpointTypes['spoonApi']['fetchFollowings']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['fetchFollowings']['response'], ApiError>>
}
