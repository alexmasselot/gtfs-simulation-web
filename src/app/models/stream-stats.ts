export class StreamStats {
  public countTotat:number;
  public countPerVehicleType:Object;
  constructor(countTotat: number, countPerVehicleType:Object) {
    this.countTotat = countTotat;
    this.countPerVehicleType = countPerVehicleType;
  }
}
