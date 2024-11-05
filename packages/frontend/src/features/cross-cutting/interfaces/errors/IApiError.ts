import { StatusCodes } from 'http-status-codes'

export interface IApiError<Name extends Readonly<string> = Readonly<string>, StatusCode extends number = number, HasResponse extends boolean = true> extends Error {
  readonly name: Name
  readonly message: string
  readonly statusCode: StatusCode
  readonly response: HasResponse extends true ? Response : undefined
}

export type IUnauthorizedError = IApiError<'UnauthorizedError', StatusCodes.UNAUTHORIZED>
export type INotFoundError = IApiError<'NotFoundError', StatusCodes.NOT_FOUND>
export type IInternalServerError = IApiError<'InternalServerError', StatusCodes.INTERNAL_SERVER_ERROR>
export type IGenericHttpError = IApiError<'GenericHttpError', StatusCodes | -1>

export type HttpError = IUnauthorizedError | INotFoundError | IInternalServerError | IGenericHttpError

export type ICancelError = IApiError<'CancelError', -2, false>
export type IConnectionRefusedError = IApiError<'ConnectionRefusedError', -3, false>
export type IUnknownConnectionError = IApiError<'UnknownConnectionError', -4, false>
export type ConnectionError = ICancelError | IConnectionRefusedError | IUnknownConnectionError

export type ApiError = HttpError | ConnectionError
