import i18next, { i18n } from 'i18next'
import { ContainerModule } from 'inversify'

import { languages } from '~/i18n.resources'

import { EventAggregator } from '../event-aggregator/EventAggregator'
import { HttpClient } from '../http-client/HttpClient'
import { IEventAggregator } from '../interfaces/event-aggregator/IEventAggregator'
import { IHttpClient } from '../interfaces/http-client/IHttpClient'
import { IHttpInterceptor } from '../interfaces/http-client/IHttpInterceptors'
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
  bind<IHttpClient>(crossCuttingTypes.HttpClient)
    .toDynamicValue(context => {
      const interceptors = context.container.get<IHttpInterceptor[]>(crossCuttingTypes.HttpInterceptors)
      return new HttpClient(interceptors)
    })
    .inSingletonScope()
  bind<i18n>(crossCuttingTypes.I18n)
    .toConstantValue(i18next)
  bind<IEventAggregator>(crossCuttingTypes.EventAggregator)
    .to(EventAggregator)
    .inSingletonScope()
  bind<i18n['languages']>(crossCuttingTypes.Languages)
    .toConstantValue(languages)
})
