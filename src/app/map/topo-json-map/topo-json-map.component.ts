import {Component, OnInit, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {HasMapCoordinatesStore} from "../../reducers/HasMapCoordinatesStore";
import {AppState} from "../../reducers/AppState";
import {MapCoordinates} from "../../models/map-coordinates";
declare var d3: any;
declare var topojson: any;

@Component({
  selector: 'gtfssim-topo-json-map',
  template: '<svg class="topo-json-map"></svg>',
  styleUrls: ['./topo-json-map.component.css']
})
export class TopoJsonMapComponent extends HasMapCoordinatesStore implements OnInit {
  private svg: any;
  private topology: Object;
  private mapCoordinates: MapCoordinates;

  constructor(public elementRef: ElementRef, protected store: Store<AppState>) {
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
    d3.json('/data/topojson/ch.json', function (tp) {
      self.topology = tp;
      self.render();

    });
  }

  render() {
    var self = this;
    this.svg.attr('height', this.mapCoordinates.height)
      .attr('width', this.mapCoordinates.width);
    if (this.topology === undefined) {
      return;
    }
    var projection=self.mapCoordinates.projection();
    var path = d3.geoPath()
      .projection(projection);

    this.svg
      .append("g")
      .attr("class", "feature feature-country")
      .append("path")
      .datum(topojson.feature(this.topology, this.topology['objects'].country))
      .attr("class", "country")
      .attr("d", path);

    this.svg.append("g")
      .attr("class", "feature feature-cantons")
      .selectAll("path")
      .data(topojson.feature(this.topology, this.topology['objects'].cantons).features)
      .enter().append("path")
      .attr("d", path);

    this.svg.append("g")
      .attr("class", "feature feature-municipalities")
      .selectAll("path")
      .data(topojson.feature(this.topology, this.topology['objects'].municipalities).features)
      .enter().append("path")
      .attr("d", path);

    this.svg.append("g")
      .attr("class", "feature feature-lakes")
      .selectAll("path.lakes")
      .data(topojson.feature(this.topology, this.topology['objects'].lakes).features)
      .enter().append("path")
      .attr("d", path)
    ;


  }
}
