import { Result } from '#/cross-cutting/utils/Result'

export interface IHttpClient {
  get<ResponseBody>(url: string, config?: unknown): Promise<Result<ResponseBody, Error>>
  post<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody, Error>>
  put<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody, Error>>
  delete<ResponseBody>(url: string, config?: unknown): Promise<Result<ResponseBody, Error>>
  patch<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody, Error>>
}
