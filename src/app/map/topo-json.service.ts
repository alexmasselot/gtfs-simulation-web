import {Injectable} from '@angular/core';
import {AppState} from "../reducers/AppState";
import {Store} from "@ngrx/store";
import {topojsonCH} from './data/topojson-ch';
declare const d3: any;
declare const topojson: any;
import * as _ from 'lodash';


@Injectable()
export class TopoJsonService {
  public topology: Object = topojsonCH;

  constructor(private store: Store<AppState>) {
  }


  public getFeature(type: string) {
    const self = this;
    return topojson.feature(self.topology, self.topology['objects'][type])
  }

  /**
   *
   * @param type
   * @returns a list of properties for all object of a given type.
   * e.g. all {abbr, name} for cantons
   */
  objectProperies(type: string) {
    return _.map(this.topology['objects'][type]['geometries'], (g) => g['properties']);
  }

}
