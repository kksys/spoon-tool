import { StatusCodes } from 'http-status-codes'

import { INotFoundError } from '#/cross-cutting/interfaces/errors/IApiError'

import { ApiErrorBase } from '../ApiErrorBase'

export class NotFoundError extends ApiErrorBase<'NotFoundError', StatusCodes.NOT_FOUND> implements INotFoundError {
  readonly name = 'NotFoundError'
  readonly statusCode = StatusCodes.NOT_FOUND

  constructor(readonly response: Response) {
    super('Not found')
  }
}
