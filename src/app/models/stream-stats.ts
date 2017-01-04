export class StreamStats {
  public countTotal:number;
  public countPerVehicleType:Object;
  public eventRate:number;

  constructor(countTotal: number, countPerVehicleType:Object, eventRate:number) {
    this.countTotal = countTotal;
    this.countPerVehicleType = countPerVehicleType;
    this.eventRate = eventRate;
  }
}
