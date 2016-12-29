declare var d3: any;

export class MapCoordinates {
  public centerLat: number = 46.5;
  public centerLng: number = 8.3;
  public scale: number = 15000;
  public zoom:number = 8;
  public width: number = 42;
  public height: number = 24;
  constructor(args:Object = {}){
      const self = this;
      ['centerLat', 'centerLng', 'scale', 'width', 'height', 'zoom'].forEach(function(o){
        if(args[o] !== undefined){
          self[o] = args[o]
        }
      })
  }

  setDimensions(width, height) {
    return new MapCoordinates({width:width, height:height});
  }

  projection() {
    var self = this;
    return d3.geoAlbers()
      .rotate([0, 0])
      .scale(self.scale)
      .translate([self.width / 2, self.height / 2])
      .precision(1)
      .center([this.centerLng, this.centerLat]);
  }

}
