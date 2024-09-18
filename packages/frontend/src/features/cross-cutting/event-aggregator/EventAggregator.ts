import { injectable } from 'inversify'
import { Observable, Subject } from 'rxjs'

import { EventType } from '../interfaces/event-aggregator/IEvent'
import { IEventAggregator } from '../interfaces/event-aggregator/IEventAggregator'

@injectable()
export class EventAggregator implements IEventAggregator {
  private subject = new Subject<EventType>()

  subscriber$: Observable<EventType> = this.subject.asObservable()

  publish(event: EventType): void {
    this.subject.next(event)
  }
}
