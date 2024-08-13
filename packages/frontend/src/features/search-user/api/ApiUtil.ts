export class ApiUtil {
  static convertToURLSearchParams<T extends Record<string, unknown>>(params: T): URLSearchParams {
    return new URLSearchParams(
      Object.fromEntries(Object.entries(params)
        .flatMap(([key, value]) => (value !== undefined ? [[key, `${value}`]] : []))),
    )
  }
}
