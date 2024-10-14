import 'reflect-metadata'

import { Container, injectable } from 'inversify'
import { finalize, from, map, Observable, switchMap } from 'rxjs'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IHttpHandler, IHttpInterceptor } from '#/cross-cutting/interfaces/interceptors/IHttpInterceptors'
import { IHttpClientService } from '#/cross-cutting/interfaces/services/IHttpClientService'

import { HttpClientService } from './HttpClientService'

@injectable()
class TestInterceptor1 implements IHttpInterceptor {
  intercept(req: Request, next: IHttpHandler): Observable<Response> {
    console.log('interceptor 1 is started')
    return next.handle(req)
      .pipe(
        switchMap(res => {
          const { headers, status, statusText } = res
          return from(res.json())
            .pipe(map(body => new Response(
              JSON.stringify({ ...body, test1: 'this property is injected by TestInterceptor1' }),
              { headers, status, statusText }
            )))
        }),
        finalize(() => console.log('interceptor 1 is ended'))
      )
  }
}

@injectable()
class TestInterceptor2 implements IHttpInterceptor {
  intercept(req: Request, next: IHttpHandler): Observable<Response> {
    console.log('interceptor 2 is started')
    return next.handle(req)
      .pipe(
        switchMap(res => {
          const { headers, status, statusText } = res
          return from(res.json())
            .pipe(map(body => new Response(
              JSON.stringify({ ...body, test2: 'this property is injected by TestInterceptor2' }),
              { headers, status, statusText }
            )))
        }),
        finalize(() => console.log('interceptor 2 is ended'))
      )
  }
}

describe('HttpClientService', () => {
  let container: Container

  beforeAll(() => {
    container = new Container()

    vi.spyOn(global, 'fetch')
      .mockImplementation((input) => {
        const result = JSON.stringify({
          'userId': 1,
          'id': 1,
          'title': 'delectus aut autem',
          'completed': false
        })
        if (input instanceof Request && input.url === 'https://example.com/test') {
          return Promise.resolve(new Response(result, {status: 200, statusText: 'OK'}))
        }
        return Promise.resolve(new Response(result, {status: 404, statusText: 'Not Found'}))
      })
  })

  beforeEach(() => {
    container.bind<IHttpClientService>(crossCuttingTypes.HttpClientService)
      .to(HttpClientService)
      .inSingletonScope()
  })

  afterEach(() => {
    container.unbindAll()
  })

  it('should be returned correct value when interceptor has been registered', async () => {
    container.bind<IHttpInterceptor[]>(crossCuttingTypes.HttpInterceptors)
      .toConstantValue([
        new TestInterceptor1(),
        new TestInterceptor2(),
      ])

    const httpClient = container.get<IHttpClientService>(crossCuttingTypes.HttpClientService)

    const result = await httpClient.get('https://example.com/test')

    expect(result.isSuccess)
      .toBe(true)
    expect(result.success)
      .toEqual({
        'userId': 1,
        'id': 1,
        'test1': 'this property is injected by TestInterceptor1',
        'test2': 'this property is injected by TestInterceptor2',
        'title': 'delectus aut autem',
        'completed': false
      })
  })

  it('should be returned correct value when interceptor has not been registered', async () => {
    container.bind<IHttpInterceptor[]>(crossCuttingTypes.HttpInterceptors)
      .toConstantValue([])

    const httpClient = container.get<IHttpClientService>(crossCuttingTypes.HttpClientService)

    const result = await httpClient.get('https://example.com/test')

    expect(result.isSuccess)
      .toBe(true)
    expect(result.success)
      .toEqual({
        'userId': 1,
        'id': 1,
        'title': 'delectus aut autem',
        'completed': false
      })
  })
})
