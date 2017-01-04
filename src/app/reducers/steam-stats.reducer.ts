import {ActionReducer, Action} from '@ngrx/store';
import {StreamStats} from "../models/stream-stats";
export const SET_STREAM_STATS = 'SET_STREAM_STATS';

export const streamStatsReducer: ActionReducer<StreamStats> = (state: StreamStats = new StreamStats(0, {}, 0), action: Action) => {
  switch (action.type) {
    case SET_STREAM_STATS:
      return action.payload;
    default:
      return state;
  }
}

