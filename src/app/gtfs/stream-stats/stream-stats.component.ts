import {Component, OnInit, ElementRef} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";
import {StreamStats} from "../../models/stream-stats";
import {Observable} from "rxjs";

declare const _: any;
declare const d3: any;

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

  private svg: any;
  private histoPoints = {};
  private scales = {};
  private gEls = {};
  private offset = {
    left: 100,
    right: 200,
    top: 5,
    bottom: 20
  };


  constructor(private elementRef: ElementRef, private store: Store<AppState>) {
    this.oStreamStats = this.store.select<StreamStats>('streamStats');
  }

  ngOnInit() {
    const self = this;
    self.oStreamStats.subscribe(
      (streamStats: StreamStats) => {
        self.topVehiclesTypes = _.chain(streamStats.countPerVehicleType)
          .toPairs()
          .map(function (p) {
            return {vehicleType: p[0], count: p[1]};
          })
          .sortBy('vehicleType')
          .filter(function (e) {
            return e.count >= streamStats.countTotal * 0.02;
          })
          .each(function (p) {
            if (self.histoPoints[p.vehicleType] === undefined) {
              self.histoPoints[p.vehicleType] = {
                vehicleType: p.vehicleType,
                dataPoints: []
              };
            }
            self.histoPoints[p.vehicleType]['dataPoints'].push({count: p.count, sod: streamStats.latestSecondsOfDay});
          })
          .value();
        self.streamStats = streamStats;
        self.render();
      });
  }


  ngAfterViewInit() {
    const self = this;
    const el: HTMLElement = this.elementRef.nativeElement;
    const divContainer = d3.select(el).selectAll('div.histo-container')
    const dim = divContainer.node().getBoundingClientRect();

    self.svg = divContainer.append('svg')
      .attr('height', dim.height)
      .attr('width', dim.width)

    var heightPlot = dim.height - self.offset.top - self.offset.bottom;
    var widthPlot = dim.width - self.offset.right - self.offset.left;
    self.scales['x'] = d3.scaleLinear().range([0, widthPlot]).domain([5, 25]);
    self.scales['y'] = d3.scaleLinear().range([heightPlot, 0]).domain([0, 1800]);
    self.gEls['plot'] = self.svg.append('g')
      .attr('transform', 'translate(' + self.offset.left + ', ' + self.offset.top + ')');

    self.svg.append("g")
      .attr("class", "histo x axis")
      .attr("transform", 'translate(' + self.offset.left + ',' + (heightPlot + self.offset.top) + ")")
      .call(d3.axisBottom()
        .scale(self.scales['x'])
        .tickFormat(function (d) {
          return d + ':00';
        })
      );
    self.svg.append("g")
      .attr("class", "histo y axis")
      .attr("transform", 'translate(' + self.offset.left + ',' + self.offset.top + ")")
      .call(d3.axisLeft()
        .scale(self.scales['y'])
        .ticks(5)
      );

    self.svg.append('text')
      .attr('x', self.offset.left + widthPlot / 2)
      .attr('y', 25)
      .attr('class', 'histo title')
      .text('Number of traveling vehicles vs time of day')

    self.gEls['evtPerSecond'] = self.svg.append('g')
      .attr('class', 'histo legend events-per-second')
      .attr('transform', 'translate(' + (self.offset.left + widthPlot - 50) + ', ' + (self.offset.top +heightPlot/2) + ')');
    self.gEls['evtPerSecond'].append('text')
      .attr('class', 'name')
      .text('acquisition rate: ')
      .attr('x', -4);
  }


  render() {
    const self = this;
    if (self.gEls['plot'] === undefined) {
      return;

    }
    const line = d3.line()
      .x(function (hp) {
        return self.scales['x'](hp.sod / 3600);
      })
      .y(function (hp) {
        return self.scales['y'](hp.count);
      });

    self.gEls['evtPerSecond'].selectAll('text.value')
      .data([self.streamStats.eventRate])
      .enter()
      .append('text')
      .attr('class', 'value')

    self.gEls['evtPerSecond'].selectAll('text.value')
      .text(function (d) {
        return d +' evt/s';
      });

    const gPlot = self.gEls['plot'];
    gPlot.selectAll('g.histo')
      .data(_.values(self.histoPoints))
      .enter()
      .append('g')
      .attr('class', function (d) {
        return 'histo vehicle route-type-' + d.vehicleType;
      })
      .selectAll('path')
      .data(function (d) {
        return [d.dataPoints];
      })
      .enter()
      .append('path')

    gPlot.selectAll('path')
      .attr('d', line);


  }

}
