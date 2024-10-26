import { IReceiver } from '#/cross-cutting/interfaces/receivers/IReceiver'
import { Result } from '#/cross-cutting/utils/Result'
import { EndpointTypes } from '#/search-user/api/EndpointTypes'

export interface ISearchUserReceiver extends IReceiver {
  receivedSearchUserResult(result: Result<EndpointTypes['spoonApi']['fetchUsers']['response']>): Promise<void>
}
