import i18next, { i18n } from 'i18next'
import { ContainerModule } from 'inversify'

import { EventAggregator } from '../event-aggregator/EventAggregator'
import { IDrawerViewModel } from '../interfaces/IDrawerViewModel'
import { IEventAggregator } from '../interfaces/IEventAggregator'
import { ILoggerService } from '../interfaces/ILoggerService'
import { DebugLoggerService } from '../services/DebugLoggerService'
import { EmptyLoggerService } from '../services/EmptyLoggerService'
import { DrawerViewModel } from '../view-models/DrawerViewModel'
import { crossCuttingTypes } from './crossCuttingTypes'

export const crossCuttingModule = new ContainerModule((bind) => {
  bind<IDrawerViewModel>(crossCuttingTypes.DrawerViewModel)
    .to(DrawerViewModel)
    .inSingletonScope()
  bind<ILoggerService>(crossCuttingTypes.LoggerService)
    .to(import.meta.env.DEV ? DebugLoggerService : EmptyLoggerService)
    .inSingletonScope()
  bind<i18n>(crossCuttingTypes.I18n)
    .toConstantValue(i18next)
  bind<IEventAggregator>(crossCuttingTypes.EventAggregator)
    .to(EventAggregator)
    .inSingletonScope()
})
