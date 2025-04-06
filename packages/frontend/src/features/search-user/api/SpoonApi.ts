import { ApiError } from '#/cross-cutting/interfaces/errors/IApiError'
import type { IHttpClient } from '#/cross-cutting/interfaces/http-client/IHttpClient'
import { Result } from '#/cross-cutting/utils/Result'

import { ISpoonApi } from '../interfaces/api/ISpoonApi'
import { ApiUtil } from './ApiUtil'
import { EndpointTypes } from './EndpointTypes'

export class SpoonApi implements ISpoonApi {
  constructor(
    private readonly httpClient: IHttpClient
  ) {}

  async fetchUsers(
    params: EndpointTypes['spoonApi']['fetchUsers']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['fetchUsers']['response'], ApiError>> {
    const query = ApiUtil.convertToURLSearchParams(params)

    const result = await this.httpClient.get<EndpointTypes['spoonApi']['fetchUsers']['response']>(
      `${import.meta.env.VITE_BACKEND_HOST}/search/user/?${query}`, {
        method: 'GET',
      }
    )

    return result
  }

  async getProfile(
    params: EndpointTypes['spoonApi']['getProfile']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['getProfile']['response'], ApiError>> {
    const result = await this.httpClient.get<EndpointTypes['spoonApi']['getProfile']['response']>(
      `${import.meta.env.VITE_BACKEND_HOST}/users/${params.id}`, {
        method: 'GET',
      }
    )

    return result
  }

  async fetchFollowers(params: EndpointTypes['spoonApi']['fetchFollowers']['parameters']): Promise<Result<EndpointTypes['spoonApi']['fetchFollowers']['response'], ApiError>> {
    const { id: userId, ...queryParams } = params
    const query = ApiUtil.convertToURLSearchParams(queryParams)

    const result = await this.httpClient.get<EndpointTypes['spoonApi']['fetchFollowers']['response']>(
      `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/followers?${query}`, {
        method: 'GET',
      }
    )

    return result
  }

  async fetchFollowings(params: EndpointTypes['spoonApi']['fetchFollowings']['parameters']): Promise<Result<EndpointTypes['spoonApi']['fetchFollowings']['response'], ApiError>> {
    const { id: userId, ...queryParams } = params
    const query = ApiUtil.convertToURLSearchParams(queryParams)

    const result = await this.httpClient.get<EndpointTypes['spoonApi']['fetchFollowings']['response']>(
      `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/followings?${query}`, {
        method: 'GET',
      }
    )

    return result
  }
}
