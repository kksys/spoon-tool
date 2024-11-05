import { ApiError, IApiError } from '../interfaces/errors/IApiError'

export abstract class ApiErrorBase<Name extends Readonly<string>, StatusCode extends number, HasResponse extends boolean = true>
  extends Error
  implements IApiError<Name, StatusCode, HasResponse> {
  abstract readonly name: Name
  abstract readonly statusCode: StatusCode
  abstract readonly response: HasResponse extends true ? Response : undefined
}

export function isApiError(error: Error): error is ApiError {
  return error instanceof ApiErrorBase
}
