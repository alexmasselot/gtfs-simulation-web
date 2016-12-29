export class SimulatedPosition {
  public fromLat:number;
  public fromLng:number;
  public fromSod:number;
  public deltaPx:number;
  constructor(public secondsOfDay: number,
              public lat: number,
              public lng: number,
              public tripId: string,
              public routeShortName: string,
              public routeLongName: string,
              public routeType: string,
              public status: string) {
  }

  toString() {
    return this.routeLongName + '/' + this.routeShortName + '/' + this.routeType + ': (' + this.lat + ', ' + this.lng + ') ' + this.tripId + ' [' + this.status + ']';
  }
}
