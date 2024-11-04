import { StatusCodes } from 'http-status-codes'

import { ApiError } from '#/cross-cutting/interfaces/errors/IApiError'

import { GenericHttpError } from './GenericHttpError'
import { InternalServerError } from './InternalServerError'
import { NotFoundError } from './NotFoundError'
import { UnauthorizedError } from './UnauthorizedError'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorMapper {
  static mapToApiError(response: Response): ApiError {
    if (response.ok) {
      throw new Error('This function should be passed an error response')
    }

    switch (response.status) {
    case StatusCodes.UNAUTHORIZED:
      return new UnauthorizedError(response)
    case StatusCodes.NOT_FOUND:
      return new NotFoundError(response)
    case StatusCodes.INTERNAL_SERVER_ERROR:
      return new InternalServerError(response)
    default:
      return new GenericHttpError(response)
    }
  }
}
