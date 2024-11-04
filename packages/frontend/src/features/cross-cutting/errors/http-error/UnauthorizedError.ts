import { StatusCodes } from 'http-status-codes'

import { IUnauthorizedError } from '#/cross-cutting/interfaces/errors/IApiError'

import { ApiErrorBase } from '../ApiErrorBase'

export class UnauthorizedError extends ApiErrorBase<'UnauthorizedError', StatusCodes.UNAUTHORIZED> implements IUnauthorizedError {
  readonly name = 'UnauthorizedError'
  readonly statusCode = StatusCodes.UNAUTHORIZED

  constructor(readonly response: Response) {
    super('Unauthorized')
  }
}
