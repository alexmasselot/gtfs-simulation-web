import {MapCoordinates} from '../models/map-coordinates';
import {StreamStats} from "../models/stream-stats";

export interface AppState {
  mapCoordinates: MapCoordinates;
  streamStats: StreamStats
}
