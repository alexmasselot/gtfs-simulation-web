import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";
import {StreamStats} from "../../models/stream-stats";
import {Observable} from "rxjs";

@Component({
  selector: 'gtfssim-stream-stats',
  templateUrl: './stream-stats.component.html',
  styleUrls: ['./stream-stats.component.css']
})
export class StreamStatsComponent implements OnInit {
  private oStreamStats: Observable<StreamStats>;
  private streamStats: StreamStats = new StreamStats();

  constructor(private store: Store<AppState>) {
    this.oStreamStats = this.store.select<StreamStats>('streamStats');
  }

  ngOnInit() {
    this.oStreamStats.subscribe(
      c => {
        console.log('paf', c)
        this.streamStats = c;
      });
  }

  latestTime() {
    var lsod = this.streamStats.lastestSecondsOfDay;
    if(lsod === undefined ){
      return '-';
    }
    var h = Math.floor(this.streamStats.lastestSecondsOfDay / 3600);
    var m = (Math.floor(this.streamStats.lastestSecondsOfDay / 60) % 60);
    var s = this.streamStats.lastestSecondsOfDay % 60
    var pad = function(i){
      if(i<10){
        return '0'+i;
      }
      return i;
    };
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }

}
