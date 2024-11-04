import { IApiError } from '../interfaces/errors/IApiError'

export abstract class ApiErrorBase<Name extends Readonly<string>, StatusCode extends number, HasResponse extends boolean = true>
  extends Error
  implements IApiError<Name, StatusCode> {
  abstract readonly name: Name
  abstract readonly statusCode: StatusCode
  abstract readonly response: HasResponse extends true ? Response : undefined
}
