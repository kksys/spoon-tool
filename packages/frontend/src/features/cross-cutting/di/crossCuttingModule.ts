import i18next, { i18n } from 'i18next'
import { ContainerModule } from 'inversify'

import { languages } from '~/i18n.resources'

import { EventAggregator } from '../event-aggregator/EventAggregator'
import { IEventAggregator } from '../interfaces/event-aggregator/IEventAggregator'
import { ILoggerService } from '../interfaces/services/ILoggerService'
import { IDrawerViewModel } from '../interfaces/view-models/IDrawerViewModel'
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
  bind<i18n['languages']>(crossCuttingTypes.Languages)
    .toConstantValue(languages)
})
