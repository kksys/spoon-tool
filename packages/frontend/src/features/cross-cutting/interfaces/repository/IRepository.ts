export interface IRepository<T extends { id: ID }, ID = T['id']> {
  fetchAll(): Promise<T[]>

  add(entity: T): Promise<void>
  update(entity: T): Promise<void>
  delete(id: T['id']): Promise<void>
  fetchById(id: T['id']): Promise<T | undefined>

  addItems(entities: T[]): Promise<void>
  updateItems(entities: T[]): Promise<void>
  deleteItems(ids: T['id'][]): Promise<void>
  fetchByIds(ids: T['id'][]): Promise<T[]>

  save(): Promise<void>
}
