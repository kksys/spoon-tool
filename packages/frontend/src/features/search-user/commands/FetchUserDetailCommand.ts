import { CommandBase } from '#/cross-cutting/commands/CommandBase'
import { ICommand } from '#/cross-cutting/interfaces/ICommand'
import { IFetchUserDetailReceiver } from '#/search-user/interfaces/receivers/IFetchUserDetailReceiver'

import { apiClient } from '../api/ApiClient'

export interface IFetchUserDetailCommandParams {
  user_id: number
}

export class FetchUserDetailCommand extends CommandBase<IFetchUserDetailReceiver> implements ICommand {
  constructor(
    protected readonly receiver: IFetchUserDetailReceiver,
    private readonly params: IFetchUserDetailCommandParams,
  ) {
    super(receiver)
  }

  async execute(): Promise<void> {
    const params = {
      id: `${this.params.user_id}`,
    }
    const result = await apiClient.spoonApi.getProfile(params)

    await this.receiver.receivedFetchUserDetailResult(result)
  }
}
