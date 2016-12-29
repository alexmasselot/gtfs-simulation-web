import {Injectable} from '@angular/core';
import {PositionStoreService} from "./position-store.service";
import {Observable} from "rxjs";
import {AppState} from "../reducers/AppState";
import {SET_UPDATE_SECONDS_OF_DAY} from "../reducers/latest-seconds-of-day.reducer";
import {Store} from "@ngrx/store";

@Injectable()
export class LatestSecondsOfDayService {
  /**
   * every 1000 ms, will publish the  secondsOfDay of the latest simulated position
   */

  constructor(private positionStoreService: PositionStoreService, private store: Store<AppState>) {
    positionStoreService.obsPositions
      .audit(ev => Observable.interval(1000))
      .subscribe(sp => {
        store.dispatch({
          type: SET_UPDATE_SECONDS_OF_DAY,
          payload: sp.secondsOfDay
        })
      });
  }

}
