import { CommandBase } from '#/cross-cutting/commands/CommandBase'
import { ICommand } from '#/cross-cutting/interfaces/commands/ICommand'

import { IApiClient } from '../interfaces/api/IApiClient'
import { IFetchFollowerListReceiver } from '../interfaces/receivers/IFetchFollowerListReceiver'

export interface IFetchFollowerListCommandParamsWithCursor {
  id: number
  page_size: undefined
  cursor: string
}

export interface IFetchFollowerListCommandParamsWithKeyword {
  id: number
  page_size: number
  cursor: undefined
}

export type FetchFollowerListCommandParams = IFetchFollowerListCommandParamsWithKeyword | IFetchFollowerListCommandParamsWithCursor

export class FetchFollowerListCommand extends CommandBase<IFetchFollowerListReceiver> implements ICommand {
  constructor(
    protected readonly receiver: IFetchFollowerListReceiver,
    private readonly apiClient: IApiClient,
    private readonly params: FetchFollowerListCommandParams,
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
    const result = await this.apiClient.spoonApi.fetchFollowers(params)

    await this.receiver.receivedFetchFollowerListResult(result)
  }
}
