import { Result } from '#/cross-cutting/utils/Result'

import { ApiError } from '../errors/IApiError'

export interface IHttpClient {
  get<ResponseBody>(url: string, config?: unknown): Promise<Result<ResponseBody, ApiError>>
  post<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody, ApiError>>
  put<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody, ApiError>>
  delete<ResponseBody>(url: string, config?: unknown): Promise<Result<ResponseBody, ApiError>>
  patch<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody, ApiError>>
}
