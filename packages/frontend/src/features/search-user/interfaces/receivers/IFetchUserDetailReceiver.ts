import { IReceiver } from '#/cross-cutting/interfaces/IReceiver'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'

export interface IFetchUserDetailReceiver extends IReceiver {
  receivedFetchUserDetailResult(result: EndpointTypes['spoonApi']['getProfile']['response']): Promise<void>
}
