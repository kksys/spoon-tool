import { Observable } from 'rxjs'

export interface IViewModel {
  readonly isBusy$: Observable<boolean>
  readonly isLocalBusy$: Observable<boolean>
  setIsBusy(value: boolean): void

  transaction<F extends (...args: unknown[]) => unknown>(callback: F): Promise<void>

  load(): Promise<void>
  unload(): Promise<void>
}
