import { Observable } from 'rxjs'

export interface IEventPubSub<EventType extends string, Event extends { event: EventType }> {
  readonly subscribe$: Observable<Event>

  publish(event: Event): void
}

export interface IEventAggregator {
  getEvent<EventType extends string, Event extends { event: EventType }>(...eventType: EventType[]): IEventPubSub<EventType, Event>
}
