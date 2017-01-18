import {Injectable} from '@angular/core';
import {AppState} from "../reducers/AppState";
import {Store} from "@ngrx/store";
import {SET_GEOJSON} from "../reducers/map-coordinates.reducer";
import {topojsonCH} from './data/topojson-ch';
declare const d3: any;
declare var topojson: any;

@Injectable()
export class TopoJsonService {
  public topology: Object = topojsonCH;

  constructor(private store: Store<AppState>) {
  }


  public getFeature(type: string) {
    const self = this;
    console.log('type=', type)
    return topojson.feature(self.topology, self.topology['objects'][type])

  }

}
