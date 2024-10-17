import { injectable } from 'inversify'
import { catchError, from, lastValueFrom, map, Observable, of, switchMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

import { IHttpClient } from '#/cross-cutting/interfaces/http-client/IHttpClient'
import { IHttpHandler, IHttpInterceptor } from '#/cross-cutting/interfaces/http-client/IHttpInterceptors'
import { Result } from '#/cross-cutting/utils/Result'

@injectable()
export class HttpClient implements IHttpClient {
  constructor(
    private readonly interceptors: IHttpInterceptor[],
  ) {}

  private getHttpStream<ResponseBody>(request: Request): Observable<Result<ResponseBody>> {
    const handler = {
      handle: (req: Request) => fromFetch(req)
    } satisfies IHttpHandler

    const handlerChain = this.interceptors.reduceRight((acc, interceptor) => ({
      handle: (req: Request) => interceptor.intercept(req, acc)
    } satisfies IHttpHandler), handler)

    return handlerChain.handle(request)
      .pipe(
        switchMap(response =>
          response.ok
            ? from(response.json())
              .pipe(map(body => Result.from<ResponseBody>(body)))
            : of(Result.from<ResponseBody>(new Error(response.statusText)))
        ),
        catchError(error => of(Result.from<ResponseBody>(error))),
      )
  }

  get<ResponseBody>(url: string, _config?: unknown): Promise<Result<ResponseBody>> {
    const request = new Request(url, {
      method: 'GET',
    })

    return lastValueFrom(this.getHttpStream(request))
  }

  post<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody>> {
    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return lastValueFrom(this.getHttpStream(request))
  }

  put<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody>> {
    const request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    return lastValueFrom(this.getHttpStream(request))
  }

  delete<ResponseBody>(url: string, _config?: unknown): Promise<Result<ResponseBody>> {
    const request = new Request(url, {
      method: 'DELETE',
    })

    return lastValueFrom(this.getHttpStream(request))
  }

  patch<RequestBody, ResponseBody>(url: string, data: RequestBody, _config?: unknown): Promise<Result<ResponseBody>> {
    const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    return lastValueFrom(this.getHttpStream(request))
  }
}
