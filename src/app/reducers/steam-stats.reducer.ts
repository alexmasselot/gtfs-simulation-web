import {ActionReducer, Action} from '@ngrx/store';
import {StreamStats} from "../models/stream-stats";
export const SET_UPDATE_SECONDS_OF_DAY = 'SET_UPDATE_SECONDS_OF_DAY';
export const SET_VEHICLE_COUNT = 'SET_VEHICLE_COUNT';

export const streamStatsReducer: ActionReducer<StreamStats> = (state: StreamStats = new StreamStats(), action: Action) => {
  switch (action.type) {
    case SET_UPDATE_SECONDS_OF_DAY:
      state.lastestSecondsOfDay=action.payload;
      return state;
    case SET_VEHICLE_COUNT:
      state.vehicleCount = action.payload;
      return state;
    default:
      return state;
  }
}

