export class StreamStats {
  public countTotal:number;
  public countPerVehicleType:Object;
  public eventRate:number;
  public latestSecondsOfDay:number;

  constructor(countTotal: number, countPerVehicleType:Object, eventRate:number, latestSecondsOfDay:number) {
    this.countTotal = countTotal;
    this.countPerVehicleType = countPerVehicleType;
    this.eventRate = eventRate;
    this.latestSecondsOfDay = latestSecondsOfDay;
  }
}
