import { injectable } from 'inversify'

import type { IHttpClient } from '#/cross-cutting/interfaces/http-client/IHttpClient'

import { IApiClient } from '../interfaces/api/IApiClient'
import { SpoonApi } from './SpoonApi'

@injectable()
export class ApiClient implements IApiClient{
  constructor(
    private readonly httpClient: IHttpClient
  ) {}

  readonly spoonApi = new SpoonApi(this.httpClient)
}
