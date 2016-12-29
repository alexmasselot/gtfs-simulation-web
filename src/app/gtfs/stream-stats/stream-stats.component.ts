import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";
import {StreamStats} from "../../models/stream-stats";
import {Observable} from "rxjs";
import {StreamStatsService} from "../stream-stats.service";

@Component({
  selector: 'gtfssim-stream-stats',
  templateUrl: './stream-stats.component.html',
  styleUrls: ['./stream-stats.component.css'],
  providers: [StreamStatsService]
})
export class StreamStatsComponent implements OnInit {
  private oStreamStats: Observable<StreamStats>;
  private streamStats: StreamStats;

  constructor(private streamStatsService:StreamStatsService, private store: Store<AppState>) {
    this.oStreamStats = this.store.select<StreamStats>('streamStats');
  }

  ngOnInit() {
    this.oStreamStats.subscribe(
      c => {

        this.streamStats = c;
      });
  }


}
