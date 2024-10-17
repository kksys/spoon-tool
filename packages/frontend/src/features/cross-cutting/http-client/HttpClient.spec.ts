import { finalize, from, map, Observable, switchMap } from 'rxjs'
import { assert, beforeAll, describe, expect, it, vi } from 'vitest'

import { IHttpHandler, IHttpInterceptor } from '#/cross-cutting/interfaces/http-client/IHttpInterceptors'

import { HttpClient } from './HttpClient'

class TestInterceptor1 implements IHttpInterceptor {
  intercept(req: Request, next: IHttpHandler): Observable<Response> {
    console.log('interceptor 1 is started')
    return next.handle(req)
      .pipe(
        switchMap(res => {
          const { headers, status, statusText } = res
          return from(res.json())
            .pipe(map(body => Response.json(
              { ...body, test1: 'this property is injected by TestInterceptor1' },
              { headers, status, statusText }
            )))
        }),
        finalize(() => console.log('interceptor 1 is ended'))
      )
  }
}

class TestInterceptor2 implements IHttpInterceptor {
  intercept(req: Request, next: IHttpHandler): Observable<Response> {
    console.log('interceptor 2 is started')
    return next.handle(req)
      .pipe(
        switchMap(res => {
          const { headers, status, statusText } = res
          return from(res.json())
            .pipe(map(body => Response.json(
              { ...body, test2: 'this property is injected by TestInterceptor2' },
              { headers, status, statusText }
            )))
        }),
        finalize(() => console.log('interceptor 2 is ended'))
      )
  }
}

describe('HttpClient', () => {
  beforeAll(() => {
    vi.spyOn(global, 'fetch')
      .mockImplementation((input) => {
        const result = {
          'userId': 1,
          'id': 1,
          'title': 'delectus aut autem',
          'completed': false
        }
        if (input instanceof Request && input.url === 'https://example.com/test') {
          return Promise.resolve(Response.json(result, {status: 200, statusText: 'OK'}))
        }
        return Promise.resolve(Response.json(result, {status: 404, statusText: 'Not Found'}))
      })
  })

  it('should be returned correct value when interceptor has been registered', async () => {
    const httpClient = new HttpClient([
      new TestInterceptor1(),
      new TestInterceptor2(),
    ])

    const result = await httpClient.get('https://example.com/test')

    assert(result.isSuccess(), 'result should be success')
    expect(result.value)
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
    const httpClient = new HttpClient([])

    const result = await httpClient.get('https://example.com/test')

    assert(result.isSuccess(), 'result should be success')
    expect(result.value)
      .toEqual({
        'userId': 1,
        'id': 1,
        'title': 'delectus aut autem',
        'completed': false
      })
  })
})
