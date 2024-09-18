import { IBusyable } from './IBusyable'

export interface IViewModel extends IBusyable {
  transaction<F extends (...args: unknown[]) => unknown>(callback: F): Promise<void>

  load(): Promise<void>
  unload(): Promise<void>
}
