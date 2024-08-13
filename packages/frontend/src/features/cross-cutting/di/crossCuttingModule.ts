import { ContainerModule } from "inversify"

import { IDrawerViewModel } from "../interfaces/IDrawerViewModel"
import { DrawerViewModel } from "../view-models/DrawerViewModel"
import { crossCuttingTypes } from "./crossCuttingTypes"

export const crossCuttingModule = new ContainerModule((bind) => {
  bind<IDrawerViewModel>(crossCuttingTypes.DrawerViewModel)
    .to(DrawerViewModel)
    .inSingletonScope()
})
