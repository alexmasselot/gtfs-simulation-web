export class SimulatedPosition {
  public fromLat:number;
  public fromLng:Number;
  public deltaPx:number;
  constructor(public lat: number,
              public lng: number,
              public tripId: string,
              public routeShortName: String,
              public routeLongName: String,
              public routeType: String,
              public status: String) {
  }

  toString() {
    return this.routeLongName + '/' + this.routeShortName + '/' + this.routeType + ': (' + this.lat + ', ' + this.lng + ') ' + this.tripId + ' [' + this.status + ']';
  }
}
