import { Observable } from 'rxjs'

import { IConfiguration } from '#/cross-cutting/interfaces/IConfigurationRepository'
import { IViewModel } from '#/cross-cutting/interfaces/IViewModel'

export interface IConfigurationViewModel extends IViewModel {
  unchanged$: Observable<boolean>
  save(): Promise<void>
  restore(): Promise<void>
  disableReset$: Observable<boolean>
  reset(): Promise<void>
  notifyReset(): void

  language$: Observable<IConfiguration['language']>
  setLanguage(language: IConfiguration['language']): void
  theme$: Observable<IConfiguration['theme']>
  setTheme(theme: IConfiguration['theme']): void
}
