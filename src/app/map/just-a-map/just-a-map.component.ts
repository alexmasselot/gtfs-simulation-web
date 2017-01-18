import {Component, OnInit, ElementRef} from '@angular/core';
import {topojsonCH} from '../data/topojson-ch';

declare const topojson: any;
declare const d3: any;

@Component({
  selector: 'gtfssim-just-a-map',
  template: '<svg></svg>'
})
export class JustAMapComponent implements OnInit {

  constructor(public elementRef: ElementRef) {
  }

  ngOnInit() {
    const self = this;

    var el: HTMLElement = self.elementRef.nativeElement;
    const svg = d3.select(el).selectAll('svg');
    var width = 250;
    var height = 250;
    svg.attr('width', width)
      .attr('height', height);

    const geoJson = topojson.feature(topojsonCH, topojsonCH['objects']['municipalities']).features
      .find((g) => g.properties.name == 'Evolène');

    const projection = d3.geoAlbers()
      .rotate([0, 0])
      .fitSize([width, height], geoJson);

    const path = d3.geoPath()
      .projection(projection);

    svg.selectAll("path")
      .data([geoJson])
      .enter()
      .append("path")
      .attr("d", path)
      .style('stroke', 'blue')
      .style('fill', 'none');

    const cityCoords = projection([7.494, 46.112]);
    svg.append('circle')
      .attr('r', 10)
      .attr('cx', cityCoords[0])
      .attr('cy', cityCoords[1])
      .style('fill', 'red');


    return self;
  }

  public getFeature(type: string) {
    const self = this;
    return topojson.feature(topojsonCH, topojsonCH['objects'][type])

  }

}
