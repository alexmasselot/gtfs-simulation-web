import {SimulatedPosition} from "./simulated-position";
export class SimulatedPositionSnapshot {
  constructor(public positions: Object, public deletedIds: Array<String>, public newIds: Array<String>,) {

  }
}
