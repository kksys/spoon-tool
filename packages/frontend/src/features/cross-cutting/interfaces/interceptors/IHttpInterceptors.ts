import { Observable } from 'rxjs'

export interface IHttpHandler {
  handle(request: Request): Observable<Response>
}

export interface IHttpInterceptor {
  intercept(request: Request, next: IHttpHandler): Observable<Response>
}
