import { Observable } from 'rxjs'

import { EventType } from './IEvent'

export interface IEventAggregator {
  subscriber$: Observable<EventType>

  publish(event: EventType): void
}
