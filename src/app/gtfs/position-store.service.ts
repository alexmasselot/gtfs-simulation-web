import {Injectable} from '@angular/core';
import {ServerSideEventsService} from '../server-side-events.service';
import {SimulatedPosition} from './simulated-position'
import {Observable, Subscription} from "rxjs";
import {AppState} from "../reducers/AppState";
import {Store} from "@ngrx/store";
import {SET_STREAM_STATS} from "../reducers/steam-stats.reducer";
import {StreamStats} from "../models/stream-stats";
import {SET_UPDATE_SECONDS_OF_DAY} from "../reducers/latest-seconds-of-day.reducer";
import {SimulatedPositionSnapshot} from "./simulated-position-snapshot";
import {UPDATE_POSITIONS} from "../reducers/simulated-position-snapshot.reducer";
import {MapCoordinates} from "../models/map-coordinates";

declare const _: any;
declare const EventSource: any;

@Injectable()
export class PositionStoreService {
  private positionCache = {};
  private bufferPositions = {}

  private lastTimeMillis: number = 0;
  private latestSecondsOfDay: number;
  private obsPosition: Observable<SimulatedPosition>;
  private subscription:Subscription;
  private eventSource: any;
  private bufferTimeInterval = 1000;

  private urlRoot = 'http://localhost:9000/simulator';
  private urlEndPoint = 'positions-ch'

  constructor(private store: Store<AppState>) {
    const self = this;
    self.store.select<MapCoordinates>('mapCoordinates').subscribe(mc =>
      self.setBoundCoordinates(mc)
    );
    self._setupObservable()
  }

  setBoundCoordinates(mc: MapCoordinates) {
    const self = this;
    self.urlEndPoint = 'positions-bounded?minLat=' + mc.minLat + '&minLng=' + mc.minLng + '&maxLat=' + mc.maxLat + '&maxLng=' + mc.maxLng;
    if ((mc.maxLat - mc.minLat) < 0.7 && (mc.maxLng - mc.minLng) < 0.7) {
      self.urlEndPoint = self.urlEndPoint+'&cityTransit=true&accelerationFactor=100'
      self.bufferTimeInterval = 200;
    }else{
      self.urlEndPoint = self.urlEndPoint;//+'&cityTransit=true';
      self.bufferTimeInterval = 1000;
    }
    self._setupObservable()
  }

  _setupObservable() {
    const self = this;
    if (self.eventSource !== undefined) {
      self.eventSource.close();
      self.subscription.unsubscribe();
    }
    self.eventSource = new EventSource(self.urlRoot + '/' + self.urlEndPoint);

    self.obsPosition = Observable.create(observer => {
      self.eventSource.onmessage = x => observer.next(x.data);
      self.eventSource.onerror = x => observer.error(x);
      return () => {
        self.eventSource.close();
        self.subscription.unsubscribe();
      };
    }).map(function (x) {
      const dt = JSON.parse(x);
      return new SimulatedPosition(dt.secondsOfDay, dt.lat, dt.lng, dt.tripId, dt.routeShortName, dt.routeLongName, dt.routeType, dt.status);
    });

    self.subscription = self.obsPosition.bufferTime(self.bufferTimeInterval).subscribe((sps: Array<SimulatedPosition>) => {

      /* build the ates position snapshots */
      const newIds = [];
      const deletedIds = [];
      const positions = {};

      // if we had no new from a vehicle for 10 minutes, let's assume it's out
      const sodTooOld = self.latestSecondsOfDay - 10 * 60
      const tooOldIds = {}
      _.chain(self.bufferPositions)
        .values()
        .filter(function (sp: SimulatedPosition) {
          return sp.secondsOfDay < sodTooOld;
        })
        .each(function (sp: SimulatedPosition) {
          tooOldIds[sp.tripId] = true;
        })
        .value();


      _.chain(sps)
        .keyBy('tripId')
        .each(function (sp: SimulatedPosition) {
          const id = sp.tripId;
          delete tooOldIds[id];
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

      _.chain(tooOldIds)
        .keys()
        .each(function (id) {
          deletedIds.push(id);
          delete self.bufferPositions[id];
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

      if (sps.length > 0) {
        self.latestSecondsOfDay = sps[sps.length - 1].secondsOfDay;
      }
      const streamStats = new StreamStats(countTotal, countPerVehicleType, rate, self.latestSecondsOfDay);


      /*
       dispatching the current status to various stores
       */
      if (sps.length > 0) {
        self.store.dispatch({
          type: SET_UPDATE_SECONDS_OF_DAY,
          payload: sps[sps.length - 1].secondsOfDay
        });
      }
      self.store.dispatch({
        type: SET_STREAM_STATS,
        payload: streamStats
      });
      self.store.dispatch({
        type: UPDATE_POSITIONS,
        payload: positionSnapshot
      })
    })

  }


}
