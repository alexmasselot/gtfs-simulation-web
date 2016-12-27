import {Injectable} from '@angular/core';
import {ServerSideEventsService} from '../server-side-events.service';
import {SimulatedPosition} from './simulated-position'
import {Store} from "@ngrx/store";
import {AppState} from "../reducers/AppState";
import {SET_UPDATE_SECONDS_OF_DAY} from "../reducers/steam-stats.reducer";

@Injectable()
export class PositionStoreService {
  private positions = {};

  constructor(private serverSideEventsService: ServerSideEventsService, private store:Store<AppState>) {
    this.subscribeToPositions();
  }

  subscribeToPositions() {//:Observable < SimulatedPosition > {
    let self = this;
    let observable = this.serverSideEventsService.streamObservable('http://localhost:9000/simulator/positions')
    observable.subscribe({
      next: x => {
        let dt = JSON.parse(x);
        if (dt.status === 'END') {
          delete self.positions[dt.tripId];
          return;
        }
        if (self.positions[dt.tripId] !== undefined) {
          var sp = self.positions[dt.tripId];
          sp.lat=dt.lat;
          sp.lng=dt.lng;
        } else {
          self.positions[dt.tripId] = new SimulatedPosition(dt.lat, dt.lng, dt.tripId, dt.routeShortName, dt.routeLongName, dt.routeType, dt.status);
        }
      },
      error: err => console.error('ERROR' + err)
    });
    observable.subscribe({
      next: x => {
        let dt = JSON.parse(x);
        this.store.dispatch({type: SET_UPDATE_SECONDS_OF_DAY, payload:dt.secondsOfDay});
      }

  })
  }

  getPositions():Object {
    return this.positions
  }
}
