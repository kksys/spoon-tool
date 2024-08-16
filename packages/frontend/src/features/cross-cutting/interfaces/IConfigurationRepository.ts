import { i18n } from "i18next";

export interface IConfiguration {
  language?: i18n['language'] | undefined
}

export interface IConfigurationRepository {
  load(): Promise<void>
  save(): Promise<void>

  setLanguage(language: NonNullable<IConfiguration['language']>): void
  getLanguage(): IConfiguration['language']
}
