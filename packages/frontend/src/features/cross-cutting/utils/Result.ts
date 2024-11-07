interface ISuccessResult<T, _E extends Error> {
  readonly value: T

  readonly isSuccess: true
  readonly isError: false
}

interface IErrorResult<_T, E extends Error> {
  readonly error: E

  readonly isSuccess: false
  readonly isError: true
}

class SuccessResult<T, E extends Error> implements ISuccessResult<T, E> {
  constructor(
    private readonly payload: T,
  ) {}

  get value(): T {
    return this.payload
  }

  readonly isSuccess = true
  readonly isError = false
}

class ErrorResult<T, E extends Error> implements IErrorResult<T, E> {
  constructor(
    private readonly payload: E,
  ) {}

  get error(): E {
    return this.payload
  }

  readonly isSuccess = false
  readonly isError = true
}

export type Result<T, E extends Error = Error> = ISuccessResult<T, E> | IErrorResult<T, E>

export const Result = {
  ok<T, E extends Error = never>(payload: T): Result<T, E> {
    return new SuccessResult<T, E>(payload)
  },
  error<T, E extends Error>(error: E): Result<T, E> {
    return new ErrorResult<T, E>(error)
  }
}
