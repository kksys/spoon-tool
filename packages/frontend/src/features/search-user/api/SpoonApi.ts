import { ApiUtil } from './ApiUtil'
import { EndpointTypes } from './EndpointTypes'

export class SpoonApi {
  async fetchUsers(
    params: EndpointTypes['spoonApi']['fetchUsers']['parameters'],
  ): Promise<EndpointTypes['spoonApi']['fetchUsers']['response']> {
    const query = ApiUtil.convertToURLSearchParams(params)
    const response = await fetch(`https://${import.meta.env.VITE_BACKEND_HOST}/search/user/?${query}`, {
      method: 'GET',
    })
    return response.json()
  }

  async getProfile(
    params: EndpointTypes['spoonApi']['getProfile']['parameters'],
  ): Promise<EndpointTypes['spoonApi']['getProfile']['response']> {
    const response = await fetch(`https://${import.meta.env.VITE_BACKEND_HOST}/users/${params.id}`, {
      method: 'GET',
    })
    return response.json()
  }
}
