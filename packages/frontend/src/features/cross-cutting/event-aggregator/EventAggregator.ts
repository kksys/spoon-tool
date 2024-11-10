import { injectable } from 'inversify'
import { filter, map, Subject } from 'rxjs'

import { IEventAggregator, IEventPubSub } from '../interfaces/event-aggregator/IEventAggregator'

@injectable()
export class EventAggregator implements IEventAggregator {
  private subject = new Subject<{ event: string }>()

  getEvent<EventType extends string, Event extends { event: EventType }>(...eventType: EventType[]): IEventPubSub<EventType, Event> {
    const subject = this.subject

    return {
      subscribe$: subject.asObservable()
        .pipe(
          filter(event => eventType.includes(event.event as EventType)),
          map(event => event as Event)
        ),
      publish(event: Event): void {
        subject.next(event)
      }
    }
  }
}
