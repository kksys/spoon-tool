import { IClearable } from '#/cross-cutting/interfaces/repository/IClearable'
import { IRepository } from '#/cross-cutting/interfaces/repository/IRepository'
import { User } from '#/search-user/interfaces/models/User'

export interface IUserRepository extends IRepository<User>, IClearable {}
