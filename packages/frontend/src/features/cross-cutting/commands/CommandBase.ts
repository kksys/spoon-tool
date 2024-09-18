import { ICommand } from '#/cross-cutting/interfaces/commands/ICommand'
import { IReceiver } from '#/cross-cutting/interfaces/receivers/IReceiver'

export abstract class CommandBase<R extends IReceiver> implements ICommand {
  constructor(protected readonly receiver: R) {}

  abstract execute(): Promise<void>
}
