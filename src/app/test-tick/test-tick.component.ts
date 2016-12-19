import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import { ServerSideEventsService } from '../server-side-events.service';


declare var d3: any;
export class Tick {
  constructor(public ts: string) {
  }

  toString(){
    return this.ts
  }
}

@Component({
  selector: 'gtfssim-test-tick',
  templateUrl: './test-tick.component.html',
  styleUrls: ['./test-tick.component.css'],
  providers: [ServerSideEventsService]
})
export class TestTickComponent implements OnInit {
  public tick: Tick;
  private zone:NgZone;

  //private data: Observable<Tick>;
  //private dataObserver: Observer;

  constructor(public http: Http, public elementRef: ElementRef, private serverSideEventsService: ServerSideEventsService) {
    console.log(d3);
    this.zone = new NgZone({enableLongStackTrace: false});

    this.getTick();//.subscribe(data => this.tick = data, error=> console.error(error));

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var el: HTMLElement = this.elementRef.nativeElement;
    d3.select(el).append('svg').attr({
      height: 200,
      width: 200
    })
  }

  getTick(){//: Observable < Tick > {
    let observable=this.serverSideEventsService.streamObservable('http://localhost:9000/simulator/positions')
    observable.subscribe({
      next: x => {
        console.log(x)
        let dt = JSON.parse(x);
        let t = new Tick(dt.ts);
        console.log(t)
        this.zone.run(() => this.tick=t);
//        this.zone.run(() => this.someStrings.push(guid));
      },
      error: err => console.error('something wrong occurred: ' + err)
    });
  }
}
