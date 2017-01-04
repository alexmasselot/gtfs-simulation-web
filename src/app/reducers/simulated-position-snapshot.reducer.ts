import {ActionReducer, Action} from '@ngrx/store';
import {StreamStats} from "../models/stream-stats";
import {SimulatedPositionSnapshot} from "../gtfs/simulated-position-snapshot";
export const UPDATE_POSITIONS = 'UPDATE_POSITIONS';

export const simulationPositionSnapshotReducer: ActionReducer<SimulatedPositionSnapshot> =
  (state: SimulatedPositionSnapshot = new SimulatedPositionSnapshot({}, [], []), action: Action) => {
    switch (action.type) {
      case UPDATE_POSITIONS:
        return action.payload;
      default:
        return state;
    }
  }

