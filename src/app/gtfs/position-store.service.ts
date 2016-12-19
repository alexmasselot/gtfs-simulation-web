import {Injectable} from '@angular/core';
import {ServerSideEventsService} from '../server-side-events.service';
import {SimulatedPosition} from './simulated-position'

@Injectable()
export class PositionStoreService {
  private positions = {};

  constructor(private serverSideEventsService: ServerSideEventsService) {
    this.subscribeToPositions();
  }

  subscribeToPositions() {//:Observable < SimulatedPosition > {
    let _this = this;
    let observable = this.serverSideEventsService.streamObservable('http://localhost:9000/simulator/positions')
    observable.subscribe({
      next: x => {
        let dt = JSON.parse(x);
        if (dt.status === 'END') {
          delete _this.positions[dt.tripId];
          return;
        }
        if (_this.positions[dt.tripId] !== undefined) {
          var sp = _this.positions[dt.tripId];
          sp.lat=dt.lat;
          sp.lng=dt.lng;
        } else {
          _this.positions[dt.tripId] = new SimulatedPosition(dt.lat, dt.lng, dt.tripId, dt.routeShortName, dt.routeLongName, dt.routeType, dt.status);
        }
      },
      error: err => console.error('ERROR' + err)
    });
  }

  getPositions() {
    return this.positions
  }
}
