import type { i18n } from 'i18next'
import { inject, injectable } from 'inversify'
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IConfiguration, IConfigurationRepository } from '#/cross-cutting/interfaces/repositories/IConfigurationRepository'

@injectable()
export class ConfigurationRepository implements IConfigurationRepository {
  private fallbackConfiguration: IConfiguration = {
    language: 'system',
    theme: 'system',
  }

  private localStorageKey = 'configuration' as const

  @inject(crossCuttingTypes.Languages) private languages!: i18n['language'][]

  private configurationSubject = new BehaviorSubject<IConfiguration>(this.fallbackConfiguration)
  private changedConfigurationSubject = new BehaviorSubject<Partial<IConfiguration>>({})

  savedConfiguration$: Observable<IConfiguration> = this.configurationSubject.asObservable()
  changedConfiguration$: Observable<Partial<IConfiguration>> = this.changedConfigurationSubject.asObservable()
  currentConfiguration$: Observable<IConfiguration> = this.changedConfigurationSubject.asObservable()
    .pipe(
      combineLatestWith(this.savedConfiguration$),
      map(([changedConfiguration, savedConfiguration]) => ({
        ...savedConfiguration,
        ...changedConfiguration
      })),
    )
  hasChange$: Observable<boolean> = this.changedConfigurationSubject.asObservable()
    .pipe(
      map(changed => Object.keys(changed).length > 0)
    )
  hasConfiguration$: Observable<boolean> = this.changedConfigurationSubject.asObservable()
    .pipe(
      combineLatestWith(this.savedConfiguration$),
      map(() => window.localStorage.getItem(this.localStorageKey) !== null),
    )

  private getCurrentConfiguration(): IConfiguration {
    const temp = {
      ...this.configurationSubject.getValue(),
      ...this.changedConfigurationSubject.getValue(),
    }
    return {
      language: temp.language,
      theme: temp.theme,
    }
  }

  async load(): Promise<void> {
    let loadedConfiguration: IConfiguration
    try {
      const temp = {
        ...this.fallbackConfiguration,
        ...(JSON.parse(window.localStorage.getItem(this.localStorageKey) || 'undefined') as IConfiguration || {})
      }
      loadedConfiguration = {
        language: temp.language,
        theme: temp.theme,
      }
    } catch {
      loadedConfiguration = { ...this.fallbackConfiguration }
    }

    this.configurationSubject.next(loadedConfiguration)
    this.changedConfigurationSubject.next({})
  }

  async save(): Promise<void> {
    const newConfiguration = this.getCurrentConfiguration()

    window.localStorage.setItem(this.localStorageKey, JSON.stringify(newConfiguration))

    this.configurationSubject.next(newConfiguration)
    this.changedConfigurationSubject.next({})
  }

  async restore(): Promise<void> {
    this.changedConfigurationSubject.next({})
  }

  async reset(): Promise<void> {
    window.localStorage.removeItem(this.localStorageKey)

    this.configurationSubject.next({ ...this.fallbackConfiguration })
    this.changedConfigurationSubject.next({})
  }

  setLanguage(language: IConfiguration['language']): void {
    let changedValue = this.changedConfigurationSubject.getValue()

    if (this.configurationSubject.getValue().language !== language) {
      changedValue = {
        ...changedValue,
        language
      }
    } else {
      delete changedValue.language
    }

    this.changedConfigurationSubject.next(changedValue)
  }

  getLanguage(): IConfiguration['language'] {
    return this.configurationSubject.getValue().language
  }

  getCalculatedLanguage(): Exclude<IConfiguration['language'], 'system'> {
    const language = this.getLanguage()

    return language === 'system'
      ? this.languages.find(l => l.startsWith(window.navigator.language)) || 'en-US'
      : language
  }

  setTheme(theme: IConfiguration['theme']): void {
    let changedValue = this.changedConfigurationSubject.getValue()

    if (this.configurationSubject.getValue().theme !== theme) {
      changedValue = {
        ...changedValue,
        theme
      }
    } else {
      delete changedValue.theme
    }

    this.changedConfigurationSubject.next(changedValue)
  }

  getTheme(): IConfiguration['theme'] {
    return this.configurationSubject.getValue().theme
  }

  getCalculatedTheme(): Exclude<IConfiguration['theme'], 'system'> {
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)')
    const theme = this.getTheme()

    return theme === 'system'
      ? mediaQuery.matches
        ? 'dark'
        : 'light'
      : theme
  }
}
