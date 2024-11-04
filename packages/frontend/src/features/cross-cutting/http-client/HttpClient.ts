import { injectable } from 'inversify'
import { catchError, lastValueFrom, of, switchMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

import { IHttpClient } from '#/cross-cutting/interfaces/http-client/IHttpClient'
import { IHttpHandler, IHttpInterceptor } from '#/cross-cutting/interfaces/http-client/IHttpInterceptors'
import { Result } from '#/cross-cutting/utils/Result'

import { CancelError } from '../errors/connection-failure/CancelError'
import { ConnectionRefusedError } from '../errors/connection-failure/ConnectionRefusedError'
import { UnknownConnectionError } from '../errors/connection-failure/UnknownConnectionError'
import { ErrorMapper } from '../errors/http-error/ErrorMapper'
import { ApiError } from '../interfaces/errors/IApiError'

@injectable()
export class HttpClient implements IHttpClient {
  constructor(
    private readonly interceptors: IHttpInterceptor[],
  ) {}

  private getHttpStream(request: Request): Promise<Result<Response, ApiError>> {
    const handler = {
      handle: (req: Request) => fromFetch(req)
    } satisfies IHttpHandler

    const handlerChain = this.interceptors.reduceRight((acc, interceptor) => ({
      handle: (req: Request) => interceptor.intercept(req, acc)
    } satisfies IHttpHandler), handler)

    const stream$ = handlerChain.handle(request)
      .pipe(
        switchMap(response => of(
          response.ok
            ? Result.ok<Response>(response)
            : Result.error<Response, ApiError>(ErrorMapper.mapToApiError(response))
        )),
        catchError(error => {
          let result: ApiError

          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            result = new ConnectionRefusedError(error)
          } else if (error instanceof DOMException && error.name === 'AbortError') {
            result = new CancelError(error)
          } else {
            result = new UnknownConnectionError(error instanceof Error ? error : new Error('Unknown error'))
          }

          return of(Result.error<Response, ApiError>(result))
        }),
      )

    return lastValueFrom(stream$)
  }

  async get<ResponseBody>(url: string, _config?: unknown): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      method: 'GET',
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async post<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async put<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async delete<ResponseBody>(url: string, _config?: unknown): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      method: 'DELETE',
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async patch<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }
}
