import type { i18n } from 'i18next'
import { inject, injectable } from 'inversify'
import { firstValueFrom, map, Observable } from 'rxjs'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import type { IConfigurationRepository } from '#/cross-cutting/interfaces/IConfigurationRepository'
import { EventType } from '#/cross-cutting/interfaces/IEvent'
import type { IEventAggregator } from '#/cross-cutting/interfaces/IEventAggregator'
import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'

import { configurationTypes } from '../di/configurationTypes'
import { IConfigurationViewModel } from '../interfaces/IConfigurationViewModel'

@injectable()
export class ConfigurationViewModel extends ViewModelBase implements IConfigurationViewModel {
  constructor(
    @inject(configurationTypes.ConfigurationRepository) private repository: IConfigurationRepository,
    @inject(crossCuttingTypes.EventAggregator) private eventAggregator: IEventAggregator
  ) {
    super()
  }

  unchanged$: Observable<boolean> = this.repository.hasChange$.pipe(map(v => !v))

  private notifyEvent(event: EventType): void {
    this.eventAggregator.publish(event)
  }

  async save(): Promise<void> {
    const changed = await firstValueFrom(this.repository.changedConfiguration$)

    await this.repository.save()

    this.notifyEvent({
      event: 'configurationChanged',
      data: { changed }
    })
  }

  async restore(): Promise<void> {
    await this.repository.restore()
  }

  disableReset$: Observable<boolean> = this.repository.hasConfiguration$.pipe(map(v => !v))

  async reset(): Promise<void> {
    await this.repository.reset()
  }

  notifyReset(): void {
    this.notifyEvent({
      event: 'configurationResetted'
    })
  }

  language$: Observable<i18n['language']> = this.repository.currentConfiguration$
    .pipe(
      map(config => config.language)
    )

  setLanguage(language: i18n['language']) {
    this.repository.setLanguage(language)
  }
}
