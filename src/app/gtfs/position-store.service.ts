import {Injectable} from '@angular/core';
import {ServerSideEventsService} from '../server-side-events.service';
import {SimulatedPosition} from './simulated-position'
import {Observable} from "rxjs";

@Injectable()
export class PositionStoreService {
  private positionCache = {};
  public obsPositions:Observable<SimulatedPosition>;

  constructor(private serverSideEventsService: ServerSideEventsService) {
    const self = this;
    self.obsPositions = this.serverSideEventsService
      .streamObservable('http://localhost:9000/simulator/positions')
      .map(function (x){
        const dt = JSON.parse(x);
        const sp = new SimulatedPosition(dt.secondsOfDay, dt.lat, dt.lng, dt.tripId, dt.routeShortName, dt.routeLongName, dt.routeType, dt.status);
        let spCache = self.positionCache[sp.tripId];
        if(spCache !== undefined){
          sp.fromLat = spCache.lat;
          sp.fromLng = spCache.lng;
          sp.fromSod = spCache.sod;
        }else{
          spCache = self.positionCache[sp.tripId] = {};
        }
        spCache.lat=sp.lat;
        spCache.lng=sp.lng;
        spCache.sod =sp.secondsOfDay;
        return sp;
      });
  }



}
