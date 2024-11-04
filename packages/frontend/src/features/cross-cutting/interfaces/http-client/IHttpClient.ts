import { Result } from '#/cross-cutting/utils/Result'

import { ApiError } from '../errors/IApiError'
import { IntRange } from '../utils/IntRange'

export interface RequestConfig extends RequestInit {
  retry?: IntRange<0, 5> | undefined
}

export interface IHttpClient {
  get<ResponseBody>(url: string, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>>
  post<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>>
  put<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>>
  delete<ResponseBody>(url: string, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>>
  patch<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: RequestConfig): Promise<Result<ResponseBody, ApiError>>
}
