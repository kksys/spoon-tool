import { ICommand } from '#/cross-cutting/interfaces/ICommand'

export class Invoker {
  async execute(command: ICommand): Promise<void> {
    await command.execute()
  }
}
