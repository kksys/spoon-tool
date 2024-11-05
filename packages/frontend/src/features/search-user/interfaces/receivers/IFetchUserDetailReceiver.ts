import { ApiError } from '#/cross-cutting/interfaces/errors/IApiError'
import { IReceiver } from '#/cross-cutting/interfaces/receivers/IReceiver'
import { Result } from '#/cross-cutting/utils/Result'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'

export interface IFetchUserDetailReceiver extends IReceiver {
  receivedFetchUserDetailResult(result: Result<EndpointTypes['spoonApi']['getProfile']['response'], ApiError>): Promise<void>
}
