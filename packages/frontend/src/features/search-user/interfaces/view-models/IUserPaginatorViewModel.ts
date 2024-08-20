import { Observable } from 'rxjs'

import { IViewModel } from '#/cross-cutting/interfaces/IViewModel'

export interface IUserPaginatorViewModel extends IViewModel {
  readonly currentPage: number
  readonly itemCount: number
  readonly itemsPerPage: number
  readonly totalPages: number

  updateCursors(cursors: { previous: string; next: string }): void
  cursors$: Observable<{ previous: string; next: string }>
  hasNextPage$: Observable<boolean>
  hasPreviousPage$: Observable<boolean>

  setItemCount(value: number): void
}
