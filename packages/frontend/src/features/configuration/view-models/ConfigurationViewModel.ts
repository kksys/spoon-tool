import type { i18n } from 'i18next'
import { inject, injectable } from 'inversify'
import { map, Observable } from 'rxjs'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import type { IConfigurationRepository } from '#/cross-cutting/interfaces/IConfigurationRepository'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'

import { configurationTypes } from '../di/configurationTypes'
import { IConfigurationViewModel } from '../interfaces/IConfigurationViewModel'

@injectable()
export class ConfigurationViewModel extends ViewModelBase implements IConfigurationViewModel {
  constructor(
    @inject(configurationTypes.ConfigurationRepository) private repository: IConfigurationRepository,
    @inject(crossCuttingTypes.I18n) private i18n: i18n
  ) {
    super()
  }

  unchanged$: Observable<boolean> = this.repository.hasChange$.pipe(map(v => !v))

  async save(): Promise<void> {
    await this.repository.save()

    await this.i18n.changeLanguage(this.repository.getLanguage())
  }

  async restore(): Promise<void> {
    await this.repository.restore()

    await this.i18n.changeLanguage(this.repository.getLanguage())
  }

  disableReset$: Observable<boolean> = this.repository.hasConfiguration$.pipe(map(v => !v))

  async reset(): Promise<void> {
    await this.repository.reset()

    await this.i18n.changeLanguage(this.repository.getLanguage())
  }

  language$: Observable<i18n['language']> = this.repository.currentConfiguration$
    .pipe(
      map(config => config.language)
    )

  setLanguage(language: i18n['language']) {
    this.repository.setLanguage(language)
  }
}
