export const searchUserTypes = {
  ApiClient: Symbol.for('IApiClient'),
  UserListViewModel: Symbol.for('IUserListViewModel'),
  UserDetailViewModel: Symbol.for('IUserDetailViewModel'),
  UserPaginatorViewModel: Symbol.for('IUserPaginatorViewModel'),
  UserViewModel: Symbol.for('IUserViewModel'),
  UserViewModelFactory: Symbol.for('Factory<IUserViewModel>'),
  UserRepository: Symbol.for('IUserRepository'),
}
