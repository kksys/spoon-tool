import { injectable } from 'inversify'
import { omit } from 'lodash-es'
import { catchError, lastValueFrom, of, retry, switchMap, throwError } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

import { IHttpClient, RequestConfig } from '#/cross-cutting/interfaces/http-client/IHttpClient'
import { IHttpHandler, IHttpInterceptor } from '#/cross-cutting/interfaces/http-client/IHttpInterceptors'
import { Result } from '#/cross-cutting/utils/Result'

import { isApiError } from '../errors/ApiErrorBase'
import { CancelError } from '../errors/connection-failure/CancelError'
import { ConnectionRefusedError } from '../errors/connection-failure/ConnectionRefusedError'
import { UnknownConnectionError } from '../errors/connection-failure/UnknownConnectionError'
import { ErrorMapper } from '../errors/http-error/ErrorMapper'
import { ApiError } from '../interfaces/errors/IApiError'
import { IntRange } from '../interfaces/utils/IntRange'

@injectable()
export class HttpClient implements IHttpClient {
  constructor(
    private readonly interceptors: IHttpInterceptor[],
  ) {}

  private getHttpStream(request: Request, retryCount: IntRange<0, 5> = 5): Promise<Result<Response, ApiError>> {
    const handler = {
      handle: (req: Request) => fromFetch(req)
    } satisfies IHttpHandler

    const handlerChain = this.interceptors.reduceRight((acc, interceptor) => ({
      handle: (req: Request) => interceptor.intercept(req, acc)
    } satisfies IHttpHandler), handler)

    const stream$ = handlerChain.handle(request)
      .pipe(
        switchMap(response => response.ok
          ? of(Result.ok<Response>(response))
          : throwError(() => ErrorMapper.mapToApiError(response))
        ),
        retry(retryCount),
        catchError(error => {
          let result: ApiError

          if (isApiError(error)) {
            result = error
          } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
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

  async get<ResponseBody>(url: string, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      ...omit(config, ['retry']),
      method: 'GET',
    })

    const result = await this.getHttpStream(request, config?.retry)

    return result.isSuccess
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async post<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      ...omit(config, ['retry']),
      method: 'POST',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request, config?.retry)

    return result.isSuccess
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async put<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      ...omit(config, ['retry']),
      method: 'PUT',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request, config?.retry)

    return result.isSuccess
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async delete<ResponseBody>(url: string, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      ...omit(config, ['retry']),
      method: 'DELETE',
    })

    const result = await this.getHttpStream(request, config?.retry)

    return result.isSuccess
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }

  async patch<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>> {
    const request = new Request(url, {
      ...omit(config, ['retry']),
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request, config?.retry)

    return result.isSuccess
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, ApiError>(result.error)
  }
}
