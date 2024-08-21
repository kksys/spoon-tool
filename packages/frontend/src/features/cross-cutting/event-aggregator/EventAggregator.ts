import { injectable } from 'inversify'
import { Observable, Subject } from 'rxjs'

import { EventType } from '../interfaces/IEvent'
import { IEventAggregator } from '../interfaces/IEventAggregator'

@injectable()
export class EventAggregator implements IEventAggregator {
  private subject = new Subject<EventType>()

  subscriber$: Observable<EventType> = this.subject.asObservable()

  publish(event: EventType): void {
    this.subject.next(event)
  }
}
