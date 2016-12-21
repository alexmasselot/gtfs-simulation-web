import {Store} from '@ngrx/store';
import {AppState} from './AppState'
import {MapCoordinates} from "../models/map-coordinates";
import {Observable} from "rxjs";

export class HasMapCoordinatesStore {
  protected oMapCoordinates: Observable<MapCoordinates>;

  constructor(protected store:Store<AppState>) {
    this.oMapCoordinates = store.select<MapCoordinates>('mapCoordinates');

  }
}
