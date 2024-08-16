import { injectable } from "inversify";

import { IConfiguration, IConfigurationRepository } from "#/cross-cutting/interfaces/IConfigurationRepository";

@injectable()
export class ConfigurationRepository implements IConfigurationRepository {
  private configuration: IConfiguration = {}

  async load(): Promise<void> {
    this.configuration = JSON.parse(window.localStorage.getItem('configuration') || '{}')
  }

  async save(): Promise<void> {
    window.localStorage.setItem('configuration', JSON.stringify(this.configuration))
  }

  setLanguage(language: NonNullable<IConfiguration["language"]>): void {
    this.configuration.language = language
  }

  getLanguage(): IConfiguration["language"] {
    return this.configuration.language
  }
}
