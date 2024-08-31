import { injectable } from 'inversify'
import { BehaviorSubject, map } from 'rxjs'

import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { IUserPaginatorViewModel } from '#/search-user/interfaces/view-models/IUserPaginatorViewModel'

@injectable()
export class UserPaginatorViewModel extends ViewModelBase implements IUserPaginatorViewModel {
  #currentPage = 1
  #itemCount = 0
  readonly itemsPerPage: number = 30
  #cursorSubject = new BehaviorSubject({ previous: '', next: '' })

  get currentPage(): number {
    return this.#currentPage
  }

  get itemCount(): number {
    return this.#itemCount
  }

  get totalPages(): number {
    return this.#itemCount > 0 ? Math.ceil(this.#itemCount / this.itemsPerPage) : 1
  }

  updateCursors(cursors: { previous: string; next: string }): void {
    this.#cursorSubject.next(cursors)
  }

  cursors$ = this.#cursorSubject.asObservable()

  hasNextPage$ = this.#cursorSubject.asObservable()
    .pipe(map(cursor => !!cursor.next))

  hasPreviousPage$ = this.#cursorSubject.asObservable()
    .pipe(map(cursor => !!cursor.previous))

  setItemCount(value: number): void {
    if (value < 0) {
      throw new Error('itemCount should be positive number or zero')
    }
    this.#itemCount = value
  }
}
