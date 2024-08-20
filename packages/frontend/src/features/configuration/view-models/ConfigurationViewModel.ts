import type { i18n } from 'i18next'
import { inject, injectable } from 'inversify'
import { map, Observable } from 'rxjs'

import type { IConfigurationRepository } from '#/cross-cutting/interfaces/IConfigurationRepository'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'

import { configurationTypes } from '../di/configurationTypes'
import { IConfigurationViewModel } from '../interfaces/IConfigurationViewModel'

@injectable()
export class ConfigurationViewModel extends ViewModelBase implements IConfigurationViewModel {
  constructor(
    @inject(configurationTypes.ConfigurationRepository) private repository: IConfigurationRepository
  ) {
    super()
  }

  unchanged$: Observable<boolean> = this.repository.hasChange$.pipe(map(v => !v))

  async save(): Promise<void> {
    await this.repository.save()
  }

  async restore(): Promise<void> {
    await this.repository.restore()
  }

  async reset(): Promise<void> {
    await this.repository.reset()
  }

  language$: Observable<i18n['language']> = this.repository.currentConfiguration$
    .pipe(
      map(config => config.language)
    )

  setLanguage(language: i18n['language']) {
    this.repository.setLanguage(language)
  }
}
