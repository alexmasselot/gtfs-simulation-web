import {ActionReducer, Action} from '@ngrx/store';
import {MapCoordinates} from '../models/map-coordinates';
export const SET_CENTER = 'SET_CENTER';
export const SET_DIMENSIONS = 'SET_DIMENSIONS';

export const mapCoordinatesReducer: ActionReducer<MapCoordinates> = (state: MapCoordinates = new MapCoordinates(), action: Action) => {
  switch (action.type) {
    case SET_CENTER:
      return state;
    case SET_DIMENSIONS:
      state.setDimensions(action.payload.width, action.payload.height);
      return state;
    default:
      return state;
  }
}

