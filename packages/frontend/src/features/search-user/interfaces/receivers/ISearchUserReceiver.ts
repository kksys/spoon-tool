import { IReceiver } from '#/cross-cutting/interfaces/IReceiver'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'

export interface ISearchUserReceiver extends IReceiver {
  receivedResult(result: EndpointTypes['spoonApi']['fetchUsers']['response']): Promise<void>
}
