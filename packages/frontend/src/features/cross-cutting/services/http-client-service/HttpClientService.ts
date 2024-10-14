import { inject, injectable } from 'inversify'
import { catchError, from, lastValueFrom, map, Observable, of, switchMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IHttpHandler, IHttpInterceptor } from '#/cross-cutting/interfaces/interceptors/IHttpInterceptors'
import { IHttpClientService } from '#/cross-cutting/interfaces/services/IHttpClientService'
import { Result } from '#/cross-cutting/utils/Result'

@injectable()
export class HttpClientService implements IHttpClientService {
  constructor(
    @inject(crossCuttingTypes.HttpInterceptors) private readonly interceptors: IHttpInterceptor[],
  ) {}

  private getHttpStream<ResponseBody>(request: Request): Observable<Result<ResponseBody>> {
    const initHandler = {
      handle(request: Request) {
        return fromFetch(request)
      }
    } satisfies IHttpHandler

    const handler = this.interceptors.reduceRight((acc, interceptor) => {
      const newHandler = {
        handle(req: Request) {
          return interceptor.intercept(req, acc)
        }
      } satisfies IHttpHandler
      return newHandler
    }, initHandler)

    return of(undefined)
      .pipe(
        switchMap(() => handler.handle(request)),
        switchMap(response => {
          if (response.ok) {
            return from(response.json())
              .pipe(map(body => Result.from<ResponseBody>(body)))
          }

          return of(Result.from<ResponseBody>(new Error(response.statusText)))
        }),
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
