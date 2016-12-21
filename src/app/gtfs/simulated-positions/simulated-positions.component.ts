import {Component, OnInit, ElementRef, NgZone} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {PositionStoreService} from '../position-store.service';
import * as _ from 'lodash';
import {SimulatedPosition} from "../simulated-position";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";
import {HasMapCoordinatesStore} from "../../reducers/HasMapCoordinatesStore";
import {MapCoordinates} from "../../models/map-coordinates";
declare var d3: any;


@Component({
  selector: 'gtfssim-simulated-positions',
  template: '<svg></svg>',
  styleUrls: ['./simulated-positions.component.css'],
  providers: [PositionStoreService]
})


export class SimulatedPositionsComponent extends HasMapCoordinatesStore  implements OnInit {
  private zone: NgZone;
  private svg:any;
  private timeLast;
  private mapCoordinates: MapCoordinates;
  private positions: Object;


  constructor(public http: Http, public elementRef: ElementRef, private positionStoreService: PositionStoreService, protected store: Store<AppState>) {
    super(store);
    this.zone = new NgZone({enableLongStackTrace: false});
    this.timeLast = (new Date).getTime();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var self = this;


    var el: HTMLElement = self.elementRef.nativeElement;

    this.svg = d3.select(el).selectAll('svg');

    this.oMapCoordinates.subscribe(c => {
      this.mapCoordinates = c;
      this.render()
    });

    setInterval(function () {
      self.positions =self.positionStoreService.getPositions();
      self.render()
    }, 1000)
  }


  /**
   * rendering attaches vehicles to a cricle position.
   * If the previsous position is larger that 2 pixels, a linear transition  is launched
   * Use the enter/update/exit pattern
   * @param positions
   */
  render() {
    let self = this;
    this.svg.attr('height', this.mapCoordinates.height)
      .attr('width', this.mapCoordinates.width);
    if (self.positions === undefined) {
      return;
    }

    let keyFunc = function (sp) {
      return sp.tripId;
    };
    let pos = _.values(self.positions);
    // var  pos = _.filter(_.values(positions), function(t){
    //   return t.routeLongName === 'IR 1707'
    // });
    var projection = self.mapCoordinates.projection()
    _.forEach(pos, function (p: SimulatedPosition) {
      if (p.fromLat === undefined) {
        p.deltaPx = 0;
      } else {
        var pCurrent = projection([p.lng, p.lat]);
        var pFrom = projection([p.fromLng, p.fromLat]);
        p.deltaPx = Math.max(
          Math.abs(pFrom[0]-pCurrent[0]),
          Math.abs(pFrom[1]-pCurrent[1])
        )
      }
    });

    let dt = this.svg.selectAll('circle.vehicle')
      .data(pos, keyFunc);

    //enter
    dt.enter().append('circle')
      .attr('class', function (d) {
        return 'vehicle route-type-' + d.routeType;
      })
      .attr('r', 2)
      .attr('id', function (d) {
        return d.routeLongName + '%' + d.tripId;
      })
      .style('opacity', 0)
      .transition()
      .style('opacity', 1);

    //update is last position is closer than 2 pixels away
    this.svg.selectAll('circle.vehicle')
      .filter(function (d) {
        return d.deltaPx <= 2;
      })
      .attr('cx', function (p) {
        return projection([p.lng, p.lat])[0]
      })
      .attr('cy', function (p) {
        return projection([p.lng, p.lat])[1]
      });

    //update if position if further than 2 pixel away
    var timeNow = (new Date).getTime();
    this.svg.selectAll('circle.vehicle')
      .filter(function (d) {
        return d.deltaPx > 2;
      })
      .transition()
      .duration(timeNow - this.timeLast)
      .ease(d3.easeLinear)
      .attr('cx', function (p) {
        return projection([p.lng, p.lat])[0]
      })
      .attr('cy', function (p) {
        return projection([p.lng, p.lat])[1]
      });
    this.timeLast = timeNow;

    this.svg.selectAll('circle.vehicle')
      .each(function (d) {
        d.fromLat = d.lat;
        d.fromLng = d.lng;
      });


    //fade out removed vehicle
    dt.exit()
      .transition()
      .style('opacity', 0)
      .remove();
  }

  // getPositions() {//:Observable < SimulatedPosition > {
  //   let observable = this.serverSideEventsService.streamObservable('http://localhost:9000/simulator/positions')
  //   observable.subscribe({
  //     next: x => {
  //       let dt = JSON.parse(x);
  //       let t = new SimulatedPosition(dt.lat, dt.lng, dt.tripId);
  //       this.render([t]);
  //       this.zone.run(() => this.simPos = t);
  //     },
  //     error: err => console.error('something wrong occurred: ' + err)
  //   });
  // }

}
