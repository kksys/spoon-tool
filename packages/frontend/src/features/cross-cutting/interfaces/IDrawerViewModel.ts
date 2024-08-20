import { Observable } from 'rxjs';

import { IViewModel } from './IViewModel';

export interface IDrawerViewModel extends IViewModel {
  readonly open$: Observable<boolean>

  updateOpen(value: boolean): void
}
