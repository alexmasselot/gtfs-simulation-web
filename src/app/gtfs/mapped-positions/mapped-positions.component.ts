import {Component, OnInit, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {HasMapCoordinatesStore} from "../../reducers/HasMapCoordinatesStore";
import {AppState} from "../../reducers/AppState";
import {SET_DIMENSIONS, SET_GEOJSON} from "../../reducers/map-coordinates.reducer";
import {ActivatedRoute} from "@angular/router";
import {TopoJsonService} from "../../map/topo-json.service";
import {MapCoordinates} from "../../models/map-coordinates";
import {PositionStoreService} from "../position-store.service";

declare var d3: any;
import * as _ from 'lodash';

@Component({
  selector: 'gtfssim-mapped-positions',
  templateUrl: './mapped-positions.component.html',
  styleUrls: ['./mapped-positions.component.css'],
  providers: [TopoJsonService]
})
export class MappedPositionsComponent extends HasMapCoordinatesStore implements OnInit {

  constructor(private elementRef: ElementRef,
              protected store: Store<AppState>,
              private topoJsonService: TopoJsonService,
              private route: ActivatedRoute) {
    super(store);
  }

  ngOnInit() {
    var self = this;
    self.route.params.subscribe(p => {
      if (p['level'] === undefined) {
        self.store.dispatch({type: SET_GEOJSON, payload: self.topoJsonService.getFeature('country')})
      } else {
        var level = p['level'];
        var name = p['name'];
        if (name === undefined) {
          self.store.dispatch({type: SET_GEOJSON, payload: self.topoJsonService.getFeature(level)})
        } else {
          const fts = self.topoJsonService.getFeature(level).features;
          const ft = _.find(fts, function (ft) {
            return ft.properties.abbr === name.toUpperCase() || ft.properties.name === name;
          });
          if (ft === undefined) {
            throw 'MappedPositionsComponent: no feature anchor found in topojson structure. level=' + level + ' name=' + name;
          }
          self.store.dispatch({type: SET_GEOJSON, payload: ft});
        }
      }
    });
  }

  ngAfterViewInit() {
    var el: HTMLElement = this.elementRef.nativeElement;
    var dim = d3.select(el).node().getBoundingClientRect();
    this.store.dispatch({type: SET_DIMENSIONS, payload: {height: dim.height, width: dim.width}});
  }
}
