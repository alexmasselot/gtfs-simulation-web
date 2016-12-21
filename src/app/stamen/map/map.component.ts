import {Component, OnInit, ElementRef, NgZone, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';

import {MapCoordinates} from '../../models/map-coordinates';
import {AppState} from '../../reducers/AppState'
import {Observable} from "rxjs";


declare var MM: any;
declare var stamen: any;
declare var d3: any;



@Component({
  selector: 'gtfssim-map',
  template: '<div></div>',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('xyz') myDiv;

  private zone: NgZone;
  private oMapCoordinates: Observable<MapCoordinates>;
  private map;

  constructor(public elementRef: ElementRef, private store: Store<AppState>) {
    //this.oMapCoordinates = store.select<MapCoordinates>('mapCoordinates');
  }

  ngAfterViewInit() {
    var divId = 'stamen-map-' + Math.round(1000000000 * Math.random());
    var elDiv = d3.select(this.elementRef.nativeElement).selectAll('div');
    elDiv.attr('id', divId)
      .style('width', '400px')
      .style('height', '600px');

    var layer = new MM.StamenTileLayer("toner");
    this.map = new MM.Map(divId, layer);
    this.oMapCoordinates.subscribe(mc =>
      this.render(mc)
    )
  }

  render(mc:MapCoordinates) {
    console.log('render', mc)
    this.map.setCenterZoom(new MM.Location(mc.centerLat, mc.centerLng), mc.zoom);

  }

  ngOnInit() {
    console.log('stamen', stamen, MM)
  }

}
