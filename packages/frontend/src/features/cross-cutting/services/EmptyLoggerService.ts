/* eslint-disable @typescript-eslint/no-empty-function */
import { injectable } from 'inversify'

import { ILoggerService } from '../interfaces/services/ILoggerService'

@injectable()
export class EmptyLoggerService implements ILoggerService {
  debug(..._args: unknown[]): void {}
  info(..._args: unknown[]): void {}
  log(..._args: unknown[]): void {}
  warn(..._args: unknown[]): void {}
  error(..._args: unknown[]): void {}

  clear(): void {}
}
