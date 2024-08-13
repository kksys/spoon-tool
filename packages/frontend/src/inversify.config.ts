import { Container } from 'inversify'

import { crossCuttingModule } from '#/cross-cutting/di/crossCuttingModule'
import { searchUserModule } from '#/search-user/di/searchUserModule'

export const diContainer = new Container()
diContainer.load(crossCuttingModule, searchUserModule)
