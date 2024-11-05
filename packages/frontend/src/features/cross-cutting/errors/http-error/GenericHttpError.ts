import { StatusCodes } from 'http-status-codes'

import { IGenericHttpError } from '#/cross-cutting/interfaces/errors/IApiError'

import { ApiErrorBase } from '../ApiErrorBase'

export class GenericHttpError extends ApiErrorBase<'GenericHttpError', StatusCodes | -1> implements IGenericHttpError {
  readonly name = 'GenericHttpError'
  readonly statusCode: StatusCodes

  constructor(readonly response: Response) {
    super(response.statusText)

    this.statusCode = response.status in StatusCodes ? response.status : -1
  }
}
