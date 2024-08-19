export interface ILoggerService {
  // logging message functions
  debug(...args: unknown[]): void
  info(...args: unknown[]): void
  log(...args: unknown[]): void
  warn(...args: unknown[]): void
  error(...args: unknown[]): void

  // manage logging function
  clear(): void
}
