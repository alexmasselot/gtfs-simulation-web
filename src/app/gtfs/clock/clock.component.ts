import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";

@Component({
  selector: 'gtfssim-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  public secondsOfDay: Number;
  public secondsOfDayFormated: String;

  // declare it in the construcore just to instantiate it... must be a better way
  constructor(private store:Store<AppState>) { }

  ngOnInit() {
    const self = this;
    self.store.select<Number>('latestSecondsOfDay').subscribe(sod => {
      self.secondsOfDay = sod;
      self.secondsOfDayFormated = self.latestTime()
    })
  }


  latestTime() {
    const lsod =  this.secondsOfDay.valueOf();
    if(lsod === undefined ){
      return '-';
    }
    const h = Math.floor(lsod / 3600);
    const m = (Math.floor(lsod / 60) % 60);
    const s = lsod % 60
    const pad = function(i){
      if(i<10){
        return '0'+i;
      }
      return i;
    };
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }
}
