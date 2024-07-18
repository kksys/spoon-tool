import { CommandBase } from '#/cross-cutting/commands/CommandBase'
import { ICommand } from '#/cross-cutting/interfaces/ICommand'
import { ISearchUserReceiver } from '#/search-user/interfaces/receivers/ISearchUserReceiver'

import { apiClient } from '../api/ApiClient'

export type SearchUserCommandParamsWithCursor = {
  keyword: string
  page_size: undefined
  cursor: string
}

export type SearchUserCommandParamsWithKeyword = {
  keyword: string
  page_size: number
  cursor: undefined
}

export type SearchUserCommandParams = SearchUserCommandParamsWithKeyword | SearchUserCommandParamsWithCursor

export class SearchUserCommand extends CommandBase<ISearchUserReceiver> implements ICommand {
  constructor(
    protected readonly receiver: ISearchUserReceiver,
    private readonly params: SearchUserCommandParams,
  ) {
    super(receiver)
  }

  async execute(): Promise<void> {
    const params = this.params.cursor !== undefined
      ? {
        keyword: this.params.keyword,
        page_size: undefined,
        cursor: this.params.cursor,
      }
      : {
        keyword: this.params.keyword,
        page_size: this.params.page_size,
        cursor: undefined,
      }
    const result = await apiClient.spoonApi.fetchUsers(params)

    await this.receiver.receivedResult(result)
  }
}
