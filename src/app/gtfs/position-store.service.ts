import {Injectable} from '@angular/core';
import {ServerSideEventsService} from '../server-side-events.service';
import {SimulatedPosition} from './simulated-position'
import {Observable} from "rxjs";
import {AppState} from "../reducers/AppState";
import {Store} from "@ngrx/store";
import {SET_STREAM_STATS} from "../reducers/steam-stats.reducer";
import {StreamStats} from "../models/stream-stats";
import {SET_UPDATE_SECONDS_OF_DAY} from "../reducers/latest-seconds-of-day.reducer";
import {SimulatedPositionSnapshot} from "./simulated-position-snapshot";
import {UPDATE_POSITIONS} from "../reducers/simulated-position-snapshot.reducer";

declare const _: any;

@Injectable()
export class PositionStoreService {
  private positionCache = {};
  private bufferPositions = {}

  private lastTimeMillis: number = 0;

  constructor(private serverSideEventsService: ServerSideEventsService, private store: Store<AppState>) {
    const self = this;
     this.serverSideEventsService
      .streamObservable('http://localhost:9000/simulator/positions')
      .map(function (x) {
        const dt = JSON.parse(x);
        return new SimulatedPosition(dt.secondsOfDay, dt.lat, dt.lng, dt.tripId, dt.routeShortName, dt.routeLongName, dt.routeType, dt.status);
      })
       .filter(function(sp:SimulatedPosition){
         return true//trsp.routeLongName.startsWith('IR 1707');
       })
       .bufferTime(1000).subscribe((sps: Array<SimulatedPosition>) => {

      /* build the ates position snapshots */
      const newIds = [];
      const deletedIds = [];
      const positions = {};
      _.chain(sps)
        .keyBy('tripId')
        .each(function (sp: SimulatedPosition) {
          const id = sp.tripId;
          if (sp.status === 'END') {
            deletedIds.push(id);
            delete self.bufferPositions[id];
            return;
          }
          if (self.bufferPositions[id] === undefined) {
            newIds.push(id);
          }
          self.bufferPositions[id] = sp;

          let spCache = self.positionCache[sp.tripId];
          if (spCache !== undefined) {
            sp.fromLat = spCache.lat;
            sp.fromLng = spCache.lng;
            sp.fromSod = spCache.sod;
          } else {
            spCache = self.positionCache[sp.tripId] = {};
          }
          spCache.lat = sp.lat;
          spCache.lng = sp.lng;
          spCache.sod = sp.secondsOfDay;

          //console.log('(', sp.fromLat ,',', sp.fromLng,', ', sp.fromSod,') -> (', sp.lat ,',', sp.lng,', ', sp.secondsOfDay, ')')
          positions[id] = sp;

        })
        .value();
      const positionSnapshot = new SimulatedPositionSnapshot(positions, deletedIds, newIds);

      /* build stream statistics*/
      const t = new Date().getTime();
      const countPerVehicleType = _.chain(self.bufferPositions)
        .keyBy('tripId')
        .countBy('routeType')
        .value();
      const countTotal = _.sum(_.values(countPerVehicleType));
      const rate = Math.round(_.size(sps) * 1000 / (t - self.lastTimeMillis));
      self.lastTimeMillis = t;
      const streamStats = new StreamStats(countTotal, countPerVehicleType, rate);


      /*
       dispatching the current status to various stores
       */
      if (sps.length > 0) {
        store.dispatch({
          type: SET_UPDATE_SECONDS_OF_DAY,
          payload: sps[sps.length - 1].secondsOfDay
        });
      }
      store.dispatch({
        type: SET_STREAM_STATS,
        payload: streamStats
      });
      store.dispatch({
        type: UPDATE_POSITIONS,
        payload: positionSnapshot
      })
    })

  }


}
