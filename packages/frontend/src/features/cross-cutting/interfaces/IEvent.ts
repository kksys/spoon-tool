import { IConfiguration } from './IConfigurationRepository'

export interface IConfigurationChangedEvent {
  event: 'configurationChanged'
  data: {
    changed: Partial<IConfiguration>
  }
}

export interface IConfigurationResettedEvent {
  event: 'configurationResetted'
}

export type EventType =
  IConfigurationChangedEvent |
  IConfigurationResettedEvent