import {Component, OnInit, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {HasMapCoordinatesStore} from "../../reducers/HasMapCoordinatesStore";
import {AppState} from "../../reducers/AppState";
import {MapCoordinates} from "../../models/map-coordinates";
import {TopoJsonService} from "../topo-json.service";
declare var d3: any;
declare var topojson: any;
import * as _ from 'lodash';

@Component({
  selector: 'gtfssim-topo-json-map',
  template: '<svg class="topo-json-map"></svg>',
  styleUrls: ['./topo-json-map.component.css'],
  providers: [TopoJsonService]
})
export class TopoJsonMapComponent extends HasMapCoordinatesStore implements OnInit {
  private svg: any;
  private mapCoordinates: MapCoordinates;

  constructor(public elementRef: ElementRef,
              protected store: Store<AppState>,
              private topoJsonService: TopoJsonService) {
    super(store);
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

    self.render();
  }

  render() {
    var self = this;
    this.svg.attr('height', this.mapCoordinates.height)
      .attr('width', this.mapCoordinates.width);

    var projection = self.mapCoordinates.projection
    var path = d3.geoPath()
      .projection(projection);

    self.svg.selectAll('g.feature').remove()
    self.svg
      .append("g")
      .attr("class", "feature feature-country")
      .append("path")
      .datum(self.topoJsonService.getFeature('country'))
      .attr("class", "country")
      .attr("d", path);

    _.each(['cantons', 'municipalities', 'lakes'], function (ftName) {
      const ft = self.topoJsonService.getFeature(ftName)
      self.svg.append("g")
        .attr("class", "feature feature-" + ftName)
        .selectAll("path")
        .data(ft['features'])
        .enter().append("path")
        .attr("d", path);
    })
  }
}
