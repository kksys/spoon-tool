import { injectable } from "inversify";
import { BehaviorSubject, combineLatestWith, map, Observable } from "rxjs";

import { IConfiguration, IConfigurationRepository } from "#/cross-cutting/interfaces/IConfigurationRepository";

@injectable()
export class ConfigurationRepository implements IConfigurationRepository {
  private fallbackConfiguration: IConfiguration = {
    language: 'ja-JP'
  }

  private configurationSubject = new BehaviorSubject<IConfiguration>(this.fallbackConfiguration)
  private changedConfigurationSubject = new BehaviorSubject<Partial<IConfiguration>>({})

  savedConfiguration$: Observable<IConfiguration> = this.configurationSubject.asObservable()
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

  private getCurrentConfiguration(): IConfiguration {
    return {
      ...this.configurationSubject.getValue(),
      ...this.changedConfigurationSubject.getValue(),
    }
  }

  async load(): Promise<void> {
    let loadedConfiguration: IConfiguration
    try {
      loadedConfiguration = JSON.parse(window.localStorage.getItem('configuration') || 'undefined') as IConfiguration || this.fallbackConfiguration
    } catch {
      loadedConfiguration = this.fallbackConfiguration
    }

    this.configurationSubject.next(loadedConfiguration)
    this.changedConfigurationSubject.next({})
  }

  async save(): Promise<void> {
    const newConfiguration = this.getCurrentConfiguration()

    window.localStorage.setItem('configuration', JSON.stringify(newConfiguration))

    this.configurationSubject.next(newConfiguration)
    this.changedConfigurationSubject.next({})
  }

  async restore(): Promise<void> {
    this.changedConfigurationSubject.next({})
  }

  async reset(): Promise<void> {
    window.localStorage.removeItem('configuration')
  }

  setLanguage(language: NonNullable<IConfiguration["language"]>): void {
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

  getLanguage(): IConfiguration["language"] {
    return this.getCurrentConfiguration().language
  }
}
