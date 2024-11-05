import { StatusCodes } from 'http-status-codes'

import { IInternalServerError } from '#/cross-cutting/interfaces/errors/IApiError'

import { ApiErrorBase } from '../ApiErrorBase'

export class InternalServerError extends ApiErrorBase<'InternalServerError', StatusCodes.INTERNAL_SERVER_ERROR> implements IInternalServerError {
  readonly name = 'InternalServerError'
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  constructor(readonly response: Response) {
    super('Internal server error')
  }
}
