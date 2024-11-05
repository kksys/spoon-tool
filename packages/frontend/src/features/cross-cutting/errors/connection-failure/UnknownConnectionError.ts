import { IUnknownConnectionError } from '#/cross-cutting/interfaces/errors/IApiError'

import { ApiErrorBase } from '../ApiErrorBase'

export class UnknownConnectionError extends ApiErrorBase<'UnknownConnectionError', -4, false> implements IUnknownConnectionError {
  readonly response = undefined
  readonly name = 'UnknownConnectionError'
  readonly statusCode = -4

  constructor(error: Error) {
    super('Connection refused')

    this.stack = error.stack
  }
}
