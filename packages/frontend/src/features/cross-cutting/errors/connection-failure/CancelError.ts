import { ICancelError } from '#/cross-cutting/interfaces/errors/IApiError'

import { ApiErrorBase } from '../ApiErrorBase'

export class CancelError extends ApiErrorBase<'CancelError', -2, false> implements ICancelError {
  readonly response = undefined
  readonly name = 'CancelError'
  readonly statusCode = -2

  constructor(error: DOMException) {
    super('Cancel')

    this.stack = error.stack
  }
}
