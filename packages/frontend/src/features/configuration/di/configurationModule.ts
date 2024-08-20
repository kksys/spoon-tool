import { ContainerModule } from "inversify"

import { crossCuttingTypes } from "#/cross-cutting/di/crossCuttingTypes"
import { IConfigurationRepository } from "#/cross-cutting/interfaces/IConfigurationRepository"
import { ILoggerService } from "#/cross-cutting/interfaces/ILoggerService"

import { IConfigurationViewModel } from "../interfaces/IConfigurationViewModel"
import { ConfigurationRepository } from "../repository/ConfigurationRepository"
import { ConfigurationViewModel } from "../view-models/ConfigurationViewModel"
import { configurationTypes } from "./configurationTypes"

export const configurationModule = new ContainerModule((bind) => {
  {
    let loggerService: ILoggerService

    bind<IConfigurationRepository>(configurationTypes.ConfigurationRepository)
      .to(ConfigurationRepository)
      .inSingletonScope()
      .onActivation(async (ctx, repository) => {
        loggerService = ctx.container.get<ILoggerService>(crossCuttingTypes.LoggerService)
        loggerService.log('auto load')
        // auto load
        await repository.load()
        return repository
      })
      .whenTargetIsDefault()
      .onDeactivation(async (repository) => {
        loggerService.log('auto save')
        // auto save
        await repository.save()
      })
      .whenTargetIsDefault()
  }

  bind<IConfigurationViewModel>(configurationTypes.ConfigurationViewModel)
    .to(ConfigurationViewModel)
    .inSingletonScope()
})
