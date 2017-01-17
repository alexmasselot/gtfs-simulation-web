"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var simulated_position_1 = require('./simulated-position');
var steam_stats_reducer_1 = require("../reducers/steam-stats.reducer");
var stream_stats_1 = require("../models/stream-stats");
var latest_seconds_of_day_reducer_1 = require("../reducers/latest-seconds-of-day.reducer");
var simulated_position_snapshot_1 = require("./simulated-position-snapshot");
var simulated_position_snapshot_reducer_1 = require("../reducers/simulated-position-snapshot.reducer");
var PositionStoreService = (function () {
    function PositionStoreService(serverSideEventsService, store) {
        this.serverSideEventsService = serverSideEventsService;
        this.store = store;
        this.positionCache = {};
        this.bufferPositions = {};
        this.lastTimeMillis = 0;
        var self = this;
        this.serverSideEventsService
            .streamObservable('http://localhost:9000/simulator/positions')
            .map(function (x) {
            var dt = JSON.parse(x);
            return new simulated_position_1.SimulatedPosition(dt.secondsOfDay, dt.lat, dt.lng, dt.tripId, dt.routeShortName, dt.routeLongName, dt.routeType, dt.status);
        })
            .filter(function (sp) {
            return true; //trsp.routeLongName.startsWith('IR 1707');
        })
            .bufferTime(1000).subscribe(function (sps) {
            /* build the ates position snapshots */
            var newIds = [];
            var deletedIds = [];
            var positions = {};
            _.chain(sps)
                .keyBy('tripId')
                .each(function (sp) {
                var id = sp.tripId;
                if (sp.status === 'END') {
                    deletedIds.push(id);
                    delete self.bufferPositions[id];
                    return;
                }
                if (self.bufferPositions[id] === undefined) {
                    newIds.push(id);
                }
                self.bufferPositions[id] = sp;
                var spCache = self.positionCache[sp.tripId];
                if (spCache !== undefined) {
                    sp.fromLat = spCache.lat;
                    sp.fromLng = spCache.lng;
                    sp.fromSod = spCache.sod;
                }
                else {
                    spCache = self.positionCache[sp.tripId] = {};
                }
                spCache.lat = sp.lat;
                spCache.lng = sp.lng;
                spCache.sod = sp.secondsOfDay;
                //console.log('(', sp.fromLat ,',', sp.fromLng,', ', sp.fromSod,') -> (', sp.lat ,',', sp.lng,', ', sp.secondsOfDay, ')')
                positions[id] = sp;
            })
                .value();
            var positionSnapshot = new simulated_position_snapshot_1.SimulatedPositionSnapshot(positions, deletedIds, newIds);
            /* build stream statistics*/
            var t = new Date().getTime();
            var countPerVehicleType = _.chain(self.bufferPositions)
                .keyBy('tripId')
                .countBy('routeType')
                .value();
            var countTotal = _.sum(_.values(countPerVehicleType));
            var rate = Math.round(_.size(sps) * 1000 / (t - self.lastTimeMillis));
            self.lastTimeMillis = t;
            var streamStats = new stream_stats_1.StreamStats(countTotal, countPerVehicleType, rate);
            /*
             dispatching the current status to various stores
             */
            if (sps.length > 0) {
                store.dispatch({
                    type: latest_seconds_of_day_reducer_1.SET_UPDATE_SECONDS_OF_DAY,
                    payload: sps[sps.length - 1].secondsOfDay
                });
            }
            store.dispatch({
                type: steam_stats_reducer_1.SET_STREAM_STATS,
                payload: streamStats
            });
            store.dispatch({
                type: simulated_position_snapshot_reducer_1.UPDATE_POSITIONS,
                payload: positionSnapshot
            });
        });
    }
    PositionStoreService = __decorate([
        core_1.Injectable()
    ], PositionStoreService);
    return PositionStoreService;
}());
exports.PositionStoreService = PositionStoreService;
