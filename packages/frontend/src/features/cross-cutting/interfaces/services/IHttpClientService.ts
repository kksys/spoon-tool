import { Result } from '#/cross-cutting/utils/Result'

export interface IHttpClientService {
  get<ResponseBody>(url: string, config?: unknown): Promise<Result<ResponseBody>>
  post<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody>>
  put<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody>>
  delete<ResponseBody>(url: string, config?: unknown): Promise<Result<ResponseBody>>
  patch<RequestBody, ResponseBody>(url: string, data: RequestBody, config?: unknown): Promise<Result<ResponseBody>>
}
