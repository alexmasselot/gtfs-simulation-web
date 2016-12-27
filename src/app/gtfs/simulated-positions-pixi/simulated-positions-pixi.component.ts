import {Component, OnInit, ElementRef, NgZone} from '@angular/core';
import {Http} from '@angular/http';
import {PositionStoreService} from '../position-store.service';
import {SimulatedPosition} from "../simulated-position";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";
import {HasMapCoordinatesStore} from "../../reducers/HasMapCoordinatesStore";
import {MapCoordinates} from "../../models/map-coordinates";
declare const PIXI: any;
declare const _: any;

@Component({
  selector: 'gtfssim-simulated-positions-pixi',
  template: '<div></div>',
  providers: [PositionStoreService]
})
export class SimulatedPositionsPixiComponent extends HasMapCoordinatesStore implements OnInit {
  private zone: NgZone;
  private sizeTag: String = undefined;
  private timeLast;
  private mapCoordinates: MapCoordinates;
  private positions: Object;
  private tLast: number;

  private renderer: any;
  private stage: any;
  private renderTexture: any;
  private renderTexture2: any;
  private outputSprite: any;

  private graphics = {};

  constructor(public http: Http,
              public elementRef: ElementRef,
              public positionStoreService: PositionStoreService,
              protected store: Store<AppState>) {
    super(store);
    console.log('positionStoreService', positionStoreService)
    this.zone = new NgZone({enableLongStackTrace: false});
    this.timeLast = (new Date).getTime();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const self = this;


    self.oMapCoordinates.subscribe(c => {
      self.mapCoordinates = c;
      self.render()
    });

    setInterval(function () {
      self.positions = self.positionStoreService.getPositions();
      self.render()
    }, 1000)
    self.animate();
  }

  /**
   * rendering attaches vehicles to a cricle position.
   * If the previsous position is larger that 2 pixels, a linear transition  is launched
   * Use the enter/update/exit pattern
   * @param positions
   */
  render() {
    const self = this;
    if ((self.renderer === undefined) || (self.sizeTag !== self._buildSizeTag())) {
      self.initPixi();
    }
    const projection = self.mapCoordinates.projection();

    /*
     align stage graphics  (circle) with the actual positions
     add new ones and remove old ones
     */
    let removedIds = {};
    _.each(_.keys(self.graphics), function (id) {
      removedIds[id] = true;
    });
    //console.log('-----------------')
    //console.log('removeIds', _.keys(removedIds))
    //console.log('graphics', _.keys(self.graphics))
    //console.log('positions', _.map(self.positions, 'tripId'))
    _.each(self.positions, function (sp: SimulatedPosition) {
      if (self.graphics[sp.tripId] === undefined) {
        const g = new PIXI.Graphics();
        g.beginFill(0xe74c3c);
        g.drawCircle(0, 0, 2);
        self.graphics[sp.tripId] = g;
        g.endFill();
        var pCurrent = projection([sp.lng, sp.lat]);
        g.x = pCurrent[0];
        g.y = pCurrent[1];
        self.stage.addChild(g);
      }
      delete removedIds[sp.tripId];
    });
    //console.log('-- removeIds', _.keys(removedIds))
    _.each(removedIds, function (undefined, id) {
      self.stage.removeChild(self.graphics[id]);
      delete self.graphics[id];
    });
    //console.log('=> graphics', _.keys(self.graphics))

    console.log('rendering +', _.size(self.graphics), '(', _.size(self.positions), ') -', _.size(removedIds));

    const tFrom = new Date().getTime();
    console.log(tFrom - self.tLast);
    self.tLast = tFrom;

    _.each(self.positions, function (sp: SimulatedPosition) {
      let g = self.graphics[sp.tripId]
      var pCurrent = projection([sp.lng, sp.lat]);
      var pFrom = projection([sp.fromLng, sp.fromLat]);
      g.xFrom = g.x || pFrom[0];
      g.yFrom = g.y || pFrom[1];
      g.xTo = pCurrent[0];
      g.yTo = pCurrent[1];
      sp.fromLng = sp.lng;
      sp.fromLat = sp.lat;
    });


  }

  animate() {
    const self = this;
    if (self.renderer === undefined) {
      return;
    }
    const tRatio = (new Date().getTime() - self.tLast) / 1000;
    console.log('animate', tRatio)
    _.each(self.graphics, function (g) {
      g.x = g.xFrom + tRatio * (g.xTo - g.xFrom);
      g.y = g.yFrom + tRatio * (g.yTo - g.yFrom);
    });
    const temp = self.renderTexture;
    self.renderTexture = self.renderTexture2;
    self.renderTexture2 = temp;
    self.outputSprite.texture = self.renderTexture;

    self.renderer.render(self.stage);
    self.stage.alpha = 0.8;
    self.renderer.render(self.stage, self.renderTexture2);
    self.stage.alpha = 1;

    requestAnimationFrame(function(){self.animate()});
  }

  initPixi() {
    const self = this;
    const el: HTMLElement = self.elementRef.nativeElement;

    if (self.renderer !== undefined) {
      el.removeChild(self.renderer.view);
    }

    self.renderer = PIXI.autoDetectRenderer(this.mapCoordinates.width, this.mapCoordinates.height, {
      antialias: true,
      transparent: true,
      resolution: 1
    });
    self.renderer.view.style.border = "1px solid black";
    self.renderTexture = PIXI.RenderTexture.create(self.renderer.width, self.renderer.height);
    self.renderTexture2 = PIXI.RenderTexture.create(self.renderer.width, self.renderer.height);
    self.outputSprite = new PIXI.Sprite(self.renderTexture);

    //self.renderer.backgroundColor = 0x061639;

    el.appendChild(self.renderer.view);
    self.stage = new PIXI.Container();
    self.stage.addChild(self.outputSprite);
    self.sizeTag = self._buildSizeTag();
  }

  _buildSizeTag() {
    var self = this;
    if (self.mapCoordinates === undefined) {
      return '-';
    }
    return self.mapCoordinates.width + 'x' + self.mapCoordinates.height;
  }

}
