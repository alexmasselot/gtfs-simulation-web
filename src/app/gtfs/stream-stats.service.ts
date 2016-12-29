import {Injectable} from '@angular/core';
import {AppState} from "../reducers/AppState";
import {Store} from "@ngrx/store";
import {PositionStoreService} from "./position-store.service";
import {SET_STREAM_STATS} from "../reducers/steam-stats.reducer";
import {StreamStats} from "../models/stream-stats";

declare const _: any;

@Injectable()
export class StreamStatsService {

  constructor(private positionStoreService: PositionStoreService, private store: Store<AppState>) {
    console.log('constructor StreamStatsService')
    positionStoreService.obsPositions
      .bufferTime(1000)
      .subscribe(sps => {
        var countPerVehicleType = _.chain(sps)
          .keyBy('tripId')
          .countBy('routeType')
          .value();
        var countTotal = _.sum(sps);

        store.dispatch({type: SET_STREAM_STATS, payload: new StreamStats(countTotal, countPerVehicleType)});
        console.log('got positions', sps.length)
      });
  }

}
