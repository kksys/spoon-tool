import { ContainerModule } from "inversify"

import { IConfigurationRepository } from "#/cross-cutting/interfaces/IConfigurationRepository"

import { ConfigurationRepository } from "../repository/ConfigurationRepository"
import { configurationTypes } from "./configurationTypes"

export const configurationModule = new ContainerModule((bind) => {
  bind<IConfigurationRepository>(configurationTypes.ConfigurationRepository)
    .to(ConfigurationRepository)
    .inSingletonScope()
    .onActivation(async (_ctx, repository) => {
      console.log('auto load')
      // auto load
      await repository.load()
      return repository
    })
    .whenTargetIsDefault()
    .onDeactivation(async (repository) => {
      console.log('auto save')
      // auto save
      await repository.save()
    })
    .whenTargetIsDefault()
})
