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
  ): Promise<Result<EndpointTypes['spoonApi']['fetchUsers']['response'], Error>> {
    const query = ApiUtil.convertToURLSearchParams(params)
    const response = await this.httpClient.get<EndpointTypes['spoonApi']['fetchUsers']['response']>(
      `https://${import.meta.env.VITE_BACKEND_HOST}/search/user/?${query}`, {
        method: 'GET',
      }
    )
    return response
  }

  async getProfile(
    params: EndpointTypes['spoonApi']['getProfile']['parameters'],
  ): Promise<Result<EndpointTypes['spoonApi']['getProfile']['response'], Error>> {
    const response = await this.httpClient.get<EndpointTypes['spoonApi']['getProfile']['response']>(
      `https://${import.meta.env.VITE_BACKEND_HOST}/users/${params.id}`, {
        method: 'GET',
      }
    )
    return response
  }
}
