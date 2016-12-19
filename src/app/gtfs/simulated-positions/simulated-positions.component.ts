import {Component, OnInit, ElementRef, NgZone} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {PositionStoreService} from '../position-store.service';
import * as _ from 'lodash';
import {SimulatedPosition} from "../simulated-position";
declare var d3: any;


@Component({
  selector: 'gtfssim-simulated-positions',
  templateUrl: './simulated-positions.component.html',
  styleUrls: ['./simulated-positions.component.css'],
  providers: [PositionStoreService]
})


export class SimulatedPositionsComponent implements OnInit {
  private zone: NgZone;
  private d3gPosition;
  private d3xScale;
  private d3yScale;
  private timeLast;


  constructor(public http: Http, public elementRef: ElementRef, private positionStoreService: PositionStoreService) {
    this.zone = new NgZone({enableLongStackTrace: false});
    this.timeLast = (new Date).getTime();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var el: HTMLElement = this.elementRef.nativeElement;
    let height = 600;
    let width = 800;
    let _this = this;

    let svg = d3.select(el).append('svg');
    svg.attr('height', height)
      .attr('width', width);

    this.d3gPosition = svg.append('g');
    this.d3xScale = d3.scaleLinear().domain([6, 9]).range([0, width]);
    this.d3yScale = d3.scaleLinear().domain([45, 48]).range([height, 0]);


    setInterval(function () {
      _this.render(_this.positionStoreService.getPositions())
    }, 1000)
  }


  /**
   * rendering attaches vehicles to a cricle position.
   * If the previsous position is larger that 2 pixels, a linear transition  is launched
   * Use the enter/update/exit pattern
   * @param positions
   */
  render(positions) {
    let _this = this;

    let keyFunc = function (sp) {
      return sp.tripId;
    };
    let pos = _.values(positions);
    // var  pos = _.filter(_.values(positions), function(t){
    //   return t.routeLongName === 'IR 1707'
    // });
    _.forEach(pos, function (p:SimulatedPosition) {
      console.log('p', p)
      if (p.fromLat === undefined) {
        p.deltaPx = 0;
      } else {
        p.deltaPx = Math.max(
          Math.abs(_this.d3xScale(p.lat) - _this.d3xScale(p.fromLat)),
          Math.abs(_this.d3xScale(p.lng) - _this.d3xScale(p.fromLng))
        )
      }
    });

    let dt = this.d3gPosition.selectAll('circle.vehicle')
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
    this.d3gPosition.selectAll('circle.vehicle')
      .filter(function (d) {
        return d.deltaPx <= 2;
      })
      .attr('cx', function (d) {
        return _this.d3xScale(d.lng)
      })
      .attr('cy', function (d) {
        return _this.d3yScale(d.lat)
      });

    //update if position if further than 2 pixel away
    var timeNow = (new Date).getTime();
    this.d3gPosition.selectAll('circle.vehicle')
      .filter(function (d) {
        return d.deltaPx > 2;
      })
      .transition()
      .duration(timeNow - this.timeLast)
      .ease(d3.easeLinear)
      .attr('cx', function (d) {
        return _this.d3xScale(d.lng)
      })
      .attr('cy', function (d) {
        return _this.d3yScale(d.lat)
      });
    this.timeLast = timeNow;

    this.d3gPosition.selectAll('circle.vehicle')
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
