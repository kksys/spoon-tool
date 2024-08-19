import { ContainerModule } from "inversify"

import { IDrawerViewModel } from "../interfaces/IDrawerViewModel"
import { ILoggerService } from "../interfaces/ILoggerService"
import { DebugLoggerService } from "../services/DebugLoggerService"
import { EmptyLoggerService } from "../services/EmptyLoggerService"
import { DrawerViewModel } from "../view-models/DrawerViewModel"
import { crossCuttingTypes } from "./crossCuttingTypes"

export const crossCuttingModule = new ContainerModule((bind) => {
  bind<IDrawerViewModel>(crossCuttingTypes.DrawerViewModel)
    .to(DrawerViewModel)
    .inSingletonScope()
  bind<ILoggerService>(crossCuttingTypes.LoggerService)
    .to(import.meta.env.DEV ? DebugLoggerService : EmptyLoggerService)
    .inSingletonScope()
})
