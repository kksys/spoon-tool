import { injectable } from "inversify";
import { BehaviorSubject, Observable } from "rxjs";

import { IDrawerViewModel } from "../interfaces/IDrawerViewModel";
import { ViewModelBase } from "./ViewModelBase";

@injectable()
export class DrawerViewModel extends ViewModelBase implements IDrawerViewModel {
  private openSubject = new BehaviorSubject(false)

  open$: Observable<boolean> = this.openSubject.asObservable()

  updateOpen(value: boolean): void {
    this.openSubject.next(value)
  }
}
