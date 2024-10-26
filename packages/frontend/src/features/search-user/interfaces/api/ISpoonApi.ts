import { Result } from '#/cross-cutting/utils/Result'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'

export interface ISpoonApi {
  fetchUsers(
    params: EndpointTypes['spoonApi']['fetchUsers']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['fetchUsers']['response'], Error>>

  getProfile(
    params: EndpointTypes['spoonApi']['getProfile']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['getProfile']['response'], Error>>
}
