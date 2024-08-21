import { i18n } from 'i18next'
import { Observable } from 'rxjs'

export interface IConfiguration {
  language: i18n['language']
}

export interface IConfigurationRepository {
  savedConfiguration$: Observable<IConfiguration>
  changedConfiguration$: Observable<Partial<IConfiguration>>
  currentConfiguration$: Observable<IConfiguration>
  hasChange$: Observable<boolean>
  hasConfiguration$: Observable<boolean>

  load(): Promise<void>
  save(): Promise<void>
  restore(): Promise<void>
  reset(): Promise<void>

  setLanguage(language: IConfiguration['language']): void
  getLanguage(): IConfiguration['language']
}
