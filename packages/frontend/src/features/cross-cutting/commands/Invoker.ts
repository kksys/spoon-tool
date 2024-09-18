import { ICommand } from '#/cross-cutting/interfaces/commands/ICommand'

export class Invoker {
  async execute(command: ICommand): Promise<void> {
    await command.execute()
  }
}
