import { IConnectionRefusedError } from '#/cross-cutting/interfaces/errors/IApiError'

import { ApiErrorBase } from '../ApiErrorBase'

export class ConnectionRefusedError extends ApiErrorBase<'ConnectionRefusedError', -3, false> implements IConnectionRefusedError {
  readonly response = undefined
  readonly name = 'ConnectionRefusedError'
  readonly statusCode = -3

  constructor(error: TypeError) {
    super('Connection refused')

    this.stack = error.stack
  }
}
