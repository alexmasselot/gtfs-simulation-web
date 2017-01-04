import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";
import {StreamStats} from "../../models/stream-stats";
import {Observable} from "rxjs";
declare const _: any;
@Component({
  selector: 'gtfssim-stream-stats',
  templateUrl: './stream-stats.component.html',
  styleUrls: ['./stream-stats.component.css']
})
/**
 * Display the position events stream statistics
 *
 */
export class StreamStatsComponent implements OnInit {
  private oStreamStats: Observable<StreamStats>;
  private streamStats: StreamStats;
  private topVehiclesTypes = [];

  constructor(private store: Store<AppState>) {
    this.oStreamStats = this.store.select<StreamStats>('streamStats');
  }

  ngOnInit() {
    var self = this;
    self.oStreamStats.subscribe(
      (streamStats: StreamStats) => {

        self.topVehiclesTypes = _.chain(streamStats.countPerVehicleType)
          .toPairs()
          .map(function (p) {
            return {vehicleType: p[0], count: p[1]};
          })
          .sortBy('vehicleType')
          .filter(function(e){
            return e.count >= streamStats.countTotal*0.02;
          })
          .value();
        self.streamStats = streamStats;
      });
  }


}
