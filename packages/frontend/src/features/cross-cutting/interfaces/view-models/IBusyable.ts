import { Observable } from 'rxjs'

export interface IBusyable {
  readonly isBusy$: Observable<boolean>
  readonly isLocalBusy$: Observable<boolean>

  setIsBusy(value: boolean): void
}
