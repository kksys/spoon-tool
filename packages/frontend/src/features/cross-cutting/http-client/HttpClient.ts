import { injectable } from 'inversify'
import { catchError, lastValueFrom, of, switchMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

import { IHttpClient } from '#/cross-cutting/interfaces/http-client/IHttpClient'
import { IHttpHandler, IHttpInterceptor } from '#/cross-cutting/interfaces/http-client/IHttpInterceptors'
import { Result } from '#/cross-cutting/utils/Result'

@injectable()
export class HttpClient implements IHttpClient {
  constructor(
    private readonly interceptors: IHttpInterceptor[],
  ) {}

  private getHttpStream(request: Request): Promise<Result<Response, Error>> {
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
            : Result.error<Response, Error>(new Error(response.statusText))
        )),
        catchError(error => of(Result.error<Response, Error>(error))),
      )

    return lastValueFrom(stream$)
  }

  async get<ResponseBody>(url: string, _config?: unknown): Promise<Result<ResponseBody, Error>> {
    const request = new Request(url, {
      method: 'GET',
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, Error>(result.error)
  }

  async post<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody, Error>> {
    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, Error>(result.error)
  }

  async put<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody, Error>> {
    const request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, Error>(result.error)
  }

  async delete<ResponseBody>(url: string, _config?: unknown): Promise<Result<ResponseBody, Error>> {
    const request = new Request(url, {
      method: 'DELETE',
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, Error>(result.error)
  }

  async patch<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody, Error>> {
    const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    const result = await this.getHttpStream(request)

    return result.isSuccess()
      ? Result.ok<ResponseBody>(await result.value.json())
      : Result.error<ResponseBody, Error>(result.error)
  }
}
