interface IResultType {
  payload: unknown
}

class SuccessResultType<T> implements IResultType {
  constructor(
    public readonly payload: T
  ) {}
}

class FailureResultType implements IResultType {
  constructor(
    public readonly payload: Error
  ) {}
}

export interface IResult {
  get isSuccess(): boolean
  get isError(): boolean

  get success(): unknown
  get error(): Error
}

export class Result<T> implements IResult {
  private constructor(
    private readonly payload: IResultType,
  ) {}

  static from<T>(error: Error): Result<T>
  static from<T>(data: T): Result<T>
  static from<T>(payload: T | Error): Result<T> {
    return new Result(payload instanceof Error
      ? new FailureResultType(payload)
      : new SuccessResultType(payload)
    )
  }

  get isSuccess(): boolean {
    return this.payload instanceof SuccessResultType
  }

  get isError(): boolean {
    return this.payload instanceof FailureResultType
  }

  get success(): T {
    if (this.isError) {
      throw new Error('this result is not a success')
    }

    return this.payload.payload as T
  }

  get error(): Error {
    if (this.isSuccess) {
      throw new Error('this result is not an error')
    }

    return this.payload.payload as Error
  }
}
