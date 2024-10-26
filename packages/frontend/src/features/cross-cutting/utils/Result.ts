interface ISuccessResult<T, _E extends Error> {
  readonly type: 'SuccessResult'
  readonly value: T
}

interface IErrorResult<_T, E extends Error> {
  readonly type: 'ErrorResult'
  readonly error: E
}

interface IResult<T, _E extends Error> {
  isSuccess(): this is ISuccessResult<T, _E>
  isError(): this is IErrorResult<T, _E>
}


abstract class ResultBase<T, E extends Error> {
  static ok<T, E extends Error = never>(payload: T): Result<T, E> {
    return new SuccessResult<T, E>(payload)
  }

  static error<T, E extends Error>(error: E): Result<T, E> {
    return new ErrorResult<T, E>(error)
  }

  protected abstract readonly type: 'SuccessResult' | 'ErrorResult'

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {}

  isSuccess(): this is ISuccessResult<T, E> {
    return this.type === 'SuccessResult'
  }

  isError(): this is IErrorResult<T, E> {
    return this.type === 'ErrorResult'
  }
}

class SuccessResult<T, E extends Error> extends ResultBase<T, E> implements IResult<T, E>, ISuccessResult<T, E> {
  constructor(
    private readonly payload: T,
  ) {
    super()
  }

  readonly type = 'SuccessResult'

  get value(): T {
    return this.payload
  }
}

class ErrorResult<T, E extends Error> extends ResultBase<T, E> implements IResult<T, E>, IErrorResult<T, E> {
  constructor(
    private readonly payload: E,
  ) {
    super()
  }

  readonly type = 'ErrorResult'

  get error(): E {
    return this.payload
  }
}

export type Result<T, E extends Error = Error> = IResult<T, E> & (ISuccessResult<T, E> | IErrorResult<T, E>)

export const Result = {
  ok: ResultBase['ok'],
  error: ResultBase['error'],
}
