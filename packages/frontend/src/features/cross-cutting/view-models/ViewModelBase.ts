import { injectable } from 'inversify'
import { BehaviorSubject, map, Observable } from 'rxjs'
import { isPromise } from 'rxjs/internal/util/isPromise'

import { autoBusyAsync } from '#/cross-cutting/decorators/autoBusy'

import { IViewModel } from '../interfaces/IViewModel'

const busyQueueSubject = new BehaviorSubject<symbol[]>([])

@injectable()
export abstract class ViewModelBase implements IViewModel {
  private _internalBusyQueueSubject = new BehaviorSubject<symbol[]>([])

  readonly isBusy$: Observable<boolean> = busyQueueSubject.asObservable()
    .pipe(map((queue) => queue.length > 0))
  readonly isLocalBusy$: Observable<boolean> = this._internalBusyQueueSubject.asObservable()
    .pipe(map((queue) => queue.length > 0))

  setIsBusy(value: boolean): void {
    if (value) {
      const symbol = Symbol('_internalBusyQueue')
      const internalBusyQueue = this._internalBusyQueueSubject.value
      const busyQueue = busyQueueSubject.value
      internalBusyQueue.push(symbol)
      busyQueue.push(symbol)
      this._internalBusyQueueSubject.next(internalBusyQueue)
      busyQueueSubject.next(busyQueue)
    } else {
      const internalBusyQueue = this._internalBusyQueueSubject.value
      const busyQueue = busyQueueSubject.value
      const symbol = internalBusyQueue.pop()
      const index = busyQueue.findIndex((item) => item === symbol)
      busyQueue.splice(index, 1)
      this._internalBusyQueueSubject.next(internalBusyQueue)
      busyQueueSubject.next(busyQueue)
    }
  }

  @autoBusyAsync()
  async transaction<F extends () => unknown>(callback: F): Promise<void> {
    const returnValue = callback()

    if (!isPromise(returnValue)) {
      return
    }

    await returnValue
  }

  async load(): Promise<void> {}
  async unload(): Promise<void> {}
}
