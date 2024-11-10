import { inject } from 'inversify'

import { crossCuttingTypes } from '#/cross-cutting/di/crossCuttingTypes'
import type { IEventAggregator } from '#/cross-cutting/interfaces/event-aggregator/IEventAggregator'
import { User } from '#/search-user/interfaces/models/User'
import { IUserRepository } from '#/search-user/interfaces/repository/IUserRepository'

export class UserRepository implements IUserRepository {
  private users: User[] = []

  constructor(
    @inject(crossCuttingTypes.EventAggregator)  private eventAggregator: IEventAggregator,
  ) {}

  async fetchAll(): Promise<User[]> {
    return this.users.map(user => ({ ...user }))
  }

  async add(entity: User): Promise<void> {
    const index = this.users.findIndex((user) => user.id === entity.id)

    if (index === -1) {
      this.users.push(entity)
    }
  }

  async update(entity: User): Promise<void> {
    const index = this.users.findIndex((user) => user.id === entity.id)

    if (index !== -1) {
      this.users[index] = entity
    }
  }

  async delete(id: number): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
    }
  }

  async fetchById(id: number): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id)
    return user ? { ...user } : undefined
  }

  async addItems(entities: User[]): Promise<void> {
    this.users.push(...entities)
  }

  async updateItems(entities: User[]): Promise<void> {
    entities.forEach((user) => {
      const index = this.users.findIndex((u) => u.id === user.id)
      if (index !== -1) {
        this.users[index] = user
      }
    })
  }

  async deleteItems(ids: number[]): Promise<void> {
    this.users = this.users.filter((user) => !ids.includes(user.id))
  }

  async fetchByIds(ids: number[]): Promise<User[]> {
    return this.users.filter((user) => ids.includes(user.id))
      .map((user) => ({ ...user }))
  }

  async save(): Promise<void> {
    this.eventAggregator.getEvent<'user-repository-save', { event: 'user-repository-save' }>('user-repository-save')
      .publish({ event: 'user-repository-save' })
  }

  async clear(): Promise<void> {
    this.users = []
  }
}
