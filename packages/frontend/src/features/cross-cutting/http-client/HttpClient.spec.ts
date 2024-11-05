import { ObjectTyped } from 'object-typed'
import { finalize, from, map, Observable, switchMap } from 'rxjs'
import { afterEach, assert, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest'

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
  describe('with interceptors', () => {
    let fetchSpy: MockInstance<typeof fetch>

    beforeEach(() => {
      fetchSpy = vi.spyOn(global, 'fetch')
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

    afterEach(() => {
      fetchSpy.mockReset()
    })

    it('should be returned correct value when interceptor has been registered', async () => {
      const httpClient = new HttpClient([
        new TestInterceptor1(),
        new TestInterceptor2(),
      ])

      const result = await httpClient.get('https://example.com/test')

      expect(fetchSpy)
        .toHaveBeenCalledTimes(1)
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

      expect(fetchSpy)
        .toHaveBeenCalledTimes(1)
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

  describe('with retry due to some http error status', () => {
    let fetchSpy: MockInstance<typeof fetch>
    const retryCount = {
      'https://example.com/test/test1': 5,
      'https://example.com/test/test2': 5,
    }

    beforeEach(() => {
      fetchSpy = vi.spyOn(global, 'fetch')
        .mockImplementation((input) => {
          const result = {
            'userId': 1,
            'id': 1,
            'title': 'delectus aut autem',
            'completed': false
          }

          if (!(input instanceof Request)) {
            return Promise.resolve(Response.json(result, {status: 404, statusText: 'Not Found'}))
          }

          switch (input.url) {
          case 'https://example.com/test/test1':
            retryCount[input.url] = retryCount[input.url] - 1
            return Promise.resolve(
              retryCount[input.url] <= 2
                ? Response.json(result, {status: 200, statusText: 'OK'})
                : Response.json(result, {status: 503, statusText: 'Internal Server Error'})
            )
          case 'https://example.com/test/test2':
            retryCount[input.url] = retryCount[input.url] - 1
            return Promise.resolve(Response.json(result, {status: 404, statusText: 'Not Found'}))
          default:
            return Promise.resolve(Response.json(result, {status: 404, statusText: 'Not Found'}))
          }
        })
    })

    afterEach(() => {
      fetchSpy.mockReset()
      ObjectTyped.keys(retryCount)
        .forEach(key => {
          retryCount[key] = 5
        })
    })

    it('should be returned 200 ok', async () => {
      const httpClient = new HttpClient([])

      const result = await httpClient.get('https://example.com/test/test1')

      expect(fetchSpy)
        .toHaveBeenCalledTimes(3)
      assert(result.isSuccess(), 'result should be success')
      expect(result.value)
        .toEqual({
          'userId': 1,
          'id': 1,
          'title': 'delectus aut autem',
          'completed': false
        })
    })

    it('should be returned 404 error', async () => {
      const httpClient = new HttpClient([])

      const result = await httpClient.get('https://example.com/test/test2')

      expect(fetchSpy)
        .toHaveBeenCalledTimes(6)
      assert(result.isError(), 'result should be error')
      expect(result.error.name)
        .toBe('NotFoundError')
    })
  })
})
