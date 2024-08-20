import { i18n } from 'i18next'
import { Observable } from 'rxjs'

import { IViewModel } from '#/cross-cutting/interfaces/IViewModel'

export interface IConfigurationViewModel extends IViewModel {
  unchanged$: Observable<boolean>
  save(): Promise<void>
  restore(): Promise<void>
  disableReset$: Observable<boolean>
  reset(): Promise<void>

  language$: Observable<i18n['language']>
  setLanguage(language: i18n['language']): void
}
