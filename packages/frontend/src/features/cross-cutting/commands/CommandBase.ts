import { ICommand } from '#/cross-cutting/interfaces/ICommand'
import { IReceiver } from '#/cross-cutting/interfaces/IReceiver'

export abstract class CommandBase<R extends IReceiver> implements ICommand {
  constructor(protected readonly receiver: R) {}

  abstract execute(): Promise<void>
}
