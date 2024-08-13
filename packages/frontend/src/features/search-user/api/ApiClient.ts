import { SpoonApi } from './SpoonApi'

export class ApiClient {
  readonly spoonApi = new SpoonApi()
}

export const apiClient = new ApiClient()
