import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@Injectable()
export class TimeService {
  readonly currentTime$: Observable<number>;

  constructor() {
    this.currentTime$ = this.getCurrentTime$();
  }

  /**
   * Get current time.
   * @returns {Observable<number>}
   */
  private getCurrentTime$(): Observable<number> {
    return Observable.interval(1000)
      .map(() => Date.now())
      .shareReplay(1)
  }
}
