import { CommandBase } from '#/cross-cutting/commands/CommandBase'
import { ICommand } from '#/cross-cutting/interfaces/commands/ICommand'

import { IApiClient } from '../interfaces/api/IApiClient'
import { IFetchFollowingListReceiver } from '../interfaces/receivers/IFetchFollowingListReceiver'

export interface IFetchFollowingListCommandParamsWithCursor {
  id: number
  page_size: undefined
  cursor: string
}

export interface IFetchFollowingListCommandParamsWithKeyword {
  id: number
  page_size: number
  cursor: undefined
}

export type FetchFollowingListCommandParams = IFetchFollowingListCommandParamsWithKeyword | IFetchFollowingListCommandParamsWithCursor

export class FetchFollowingListCommand extends CommandBase<IFetchFollowingListReceiver> implements ICommand {
  constructor(
    protected readonly receiver: IFetchFollowingListReceiver,
    private readonly apiClient: IApiClient,
    private readonly params: FetchFollowingListCommandParams,
  ) {
    super(receiver)
  }

  async execute(): Promise<void> {
    const params = this.params.cursor !== undefined
      ? {
        id: this.params.id,
        page_size: undefined,
        cursor: this.params.cursor,
      }
      : {
        id: this.params.id,
        page_size: this.params.page_size,
        cursor: undefined,
      }
    const result = await this.apiClient.spoonApi.fetchFollowings(params)

    await this.receiver.receivedFetchFollowingListResult(result)
  }
}
