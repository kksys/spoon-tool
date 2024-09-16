import { injectable } from 'inversify'

import { ViewModelBase } from '#/cross-cutting/view-models/ViewModelBase'
import { IUserViewModel, IUserViewModelDetail, IUserViewModelProps } from '#/search-user/interfaces/view-models/IUserViewModel'

@injectable()
export class UserViewModel extends ViewModelBase implements IUserViewModel {
  properties!: IUserViewModelProps
  setProperties(props: IUserViewModelProps): void {
    this.properties = { ...props }
  }

  detail: IUserViewModelDetail | undefined
  setDetail(detail: IUserViewModelDetail): void {
    this.detail = { ...detail }
  }
}
