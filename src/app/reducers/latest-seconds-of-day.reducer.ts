import {ActionReducer, Action} from '@ngrx/store';
import {StreamStats} from "../models/stream-stats";
export const SET_UPDATE_SECONDS_OF_DAY = 'SET_UPDATE_SECONDS_OF_DAY';

export const latestSecondsOfDayReducer: ActionReducer<Number> = (state: Number = 0, action: Action) => {
  switch (action.type) {
    case SET_UPDATE_SECONDS_OF_DAY:
      state=action.payload;
      return state;
    default:
      return state;
  }
}

