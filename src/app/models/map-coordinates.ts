declare const d3: any;
declare const _: any;


/**
 * Map Coordiantes get the creen/geogrpahic data.
 * should be immutable (for store state), so setter create a new instance
 */

export class MapCoordinates {
  public centerLat: number = 46.5;
  public centerLng: number = 8.3;
  public scale: number = 15000;
  public zoom: number = 8;
  public width: number = 42;
  public height: number = 24;
  public minLat: number;
  public maxLat: number;
  public minLng: number;
  public maxLng: number;

  public projection: any;
  private geoJson: Object;

  constructor(args: Object = {}) {
    const self = this;

    ['centerLat', 'centerLng', 'scale', 'width', 'height', 'zoom', 'geoJson'].forEach(function (o) {
      if (args[o] !== undefined) {
        self[o] = args[o];
      }
    });
    self.updateProjection();
    self._setBoundingCoordinates();
  }

  /*
   according to the center coordinates, scale, height, width and projection ,defined the min/max latitude/longitude
   */
  _setBoundingCoordinates() {
    var self = this;
    self.updateProjection();

    var ul = self.projection.invert([0, 0]);
    var dr = self.projection.invert([self.width, self.height]);
    self.minLat = dr[1];
    self.maxLat = ul[1];
    self.minLng = ul[0];
    self.maxLng = dr[0];
    return self;
  }

  setDimensions(width, height) {
    return new MapCoordinates(_.assign(this, {width: width, height: height}));
  }

  setGeoJson(gj){
    return new MapCoordinates(_.assign(this, {geoJson:gj}));
  }

  updateProjection() {
    const self = this;
    if (self.geoJson !== undefined) {
      self.projection = d3.geoAlbers()
        .rotate([0,0])
        .fitSize(
          [self.width, self.height],
          self.geoJson);
      return self;
    }
    self.projection = d3.geoAlbers()
      .rotate([0,0])
      .scale(self.scale)
      .translate([self.width / 2, self.height / 2])
      .precision(1)
      .center([this.centerLng, this.centerLat]);
    return self;
  }



}
