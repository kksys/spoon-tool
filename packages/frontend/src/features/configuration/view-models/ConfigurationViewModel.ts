import { inject, injectable } from 'inversify'
import { firstValueFrom, map, Observable } from 'rxjs'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { EventType } from '#/cross-cutting/interfaces/event-aggregator/IEvent'
import type { IEventAggregator } from '#/cross-cutting/interfaces/event-aggregator/IEventAggregator'
import type { IConfiguration, IConfigurationRepository } from '#/cross-cutting/interfaces/repositories/IConfigurationRepository'
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
    this.eventAggregator
      .getEvent<'configurationChanged' | 'configurationResetted', EventType>('configurationChanged', 'configurationResetted')
      .publish(event)
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

  language$: Observable<IConfiguration['language']> = this.repository.currentConfiguration$
    .pipe(
      map(config => config.language)
    )

  setLanguage(language: IConfiguration['language']) {
    this.repository.setLanguage(language)
  }

  theme$: Observable<IConfiguration['theme']> = this.repository.currentConfiguration$
    .pipe(
      map(config => config.theme)
    )

  setTheme(theme: IConfiguration['theme']): void {
    this.repository.setTheme(theme)
  }
}
