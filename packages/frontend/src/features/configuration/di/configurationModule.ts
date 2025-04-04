import { ContainerModule } from 'inversify'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import { IConfigurationRepository } from '#/cross-cutting/interfaces/repositories/IConfigurationRepository'
import { ILoggerService } from '#/cross-cutting/interfaces/services/ILoggerService'

import { IConfigurationViewModel } from '../interfaces/IConfigurationViewModel'
import { ConfigurationRepository } from '../repository/ConfigurationRepository'
import { ConfigurationViewModel } from '../view-models/ConfigurationViewModel'
import { configurationTypes } from './configurationTypes'

export const configurationModule = new ContainerModule(({ bind }) => {
  {
    let loggerService: ILoggerService

    bind<IConfigurationRepository>(configurationTypes.ConfigurationRepository)
      .to(ConfigurationRepository)
      .inSingletonScope()
      .onActivation(async (ctx, repository) => {
        loggerService = ctx.get<ILoggerService>(crossCuttingTypes.LoggerService)
        loggerService.log('auto load')
        // auto load
        await repository.load()
        return repository
      })
      .whenDefault()
      .onDeactivation(async (repository) => {
        loggerService.log('auto save')
        // auto save
        await repository.save()
      })
      .whenDefault()
  }

  bind<IConfigurationViewModel>(configurationTypes.ConfigurationViewModel)
    .to(ConfigurationViewModel)
    .inSingletonScope()
})
