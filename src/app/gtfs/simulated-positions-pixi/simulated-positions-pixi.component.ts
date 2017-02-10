import {Component, OnInit, ElementRef, NgZone} from '@angular/core';
import {Http} from '@angular/http';
import {PositionStoreService} from '../position-store.service';
import {SimulatedPosition} from "../simulated-position";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers/AppState";
import {HasMapCoordinatesStore} from "../../reducers/HasMapCoordinatesStore";
import {MapCoordinates} from "../../models/map-coordinates";
import {SimulatedPositionSnapshot} from "../simulated-position-snapshot";
import {Observable} from "rxjs";
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
  private timeLastAnimate = 0;
  private minFrameRenderingIntervalMillis = 50;
  private mapCoordinates: MapCoordinates;
  private projection: any;

  private isStageUp = false;
  private renderer: any;
  private stage: any;
  private renderTexture: any;
  private renderTexture2: any;
  private outputSprite: any;


  private colors = {
    RAIL: 0xff032c,
    BUS: 0xffd605,
    GONDOLA: 0x048020,
    BAT: 0xc0c0c0,
    FERRY: 0xc0c0c0,
    FUNICULAR: 0x048020,
    SUBWAY: 0xff08e7,
    TRAM: 0x0028ff,
    default: 0x000000
  };

  private graphics = {};

  constructor(public http: Http,
              public elementRef: ElementRef,
              public positionStoreService: PositionStoreService,
              protected store: Store<AppState>) {
    super(store);
    this.zone = new NgZone({enableLongStackTrace: false});
    this.timeLastAnimate = (new Date).getTime();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const self = this;

    self.oMapCoordinates.subscribe(c => {
      self.mapCoordinates = c;
      self.projection = self.mapCoordinates.projection;
      self.render()
    });

    self.store.select<SimulatedPositionSnapshot>('simulatedPositionSnapshot').subscribe(
      (sps: SimulatedPositionSnapshot) => {
        if (!self.isStageUp) {
          return;
        }
        //console.log('+', sps.newIds.length, '-', sps.deletedIds.length, '|', _.size(sps.positions));
        //delete the terminated vehicles
        _.each(sps.deletedIds, function (id) {
          let g = self.graphics[id];
          if (g !== undefined) {
            self.stage.removeChild(g);
            delete self.graphics[id];
          }
        });

        var createGraphics = function (sp: SimulatedPosition) {
          let g = self.graphics[sp.tripId];
          if (g === undefined) {
            g = new PIXI.Graphics();
            if (self.colors[sp.routeType] === undefined) {
              //console.log(sp);
            }
            g.beginFill(self.colors[sp.routeType] || self.colors.default);
            g.drawCircle(0, 0, 1.5);
            self.graphics[sp.tripId] = g;
            g.endFill();
            self.stage.addChild(g);
          }
        };

        //create graphics for the new ones
        _.each(sps.newIds, function (id) {
          let g = self.graphics[id];
          let sp = sps.positions[id];
          if (g === undefined) {
            g = new PIXI.Graphics();
            if (self.colors[sp.routeType] === undefined) {
              //console.log(sp);
            }
            g.beginFill(self.colors[sp.routeType] || self.colors.default);
            g.drawCircle(0, 0, 1.5);
            self.graphics[sp.tripId] = g;
            g.endFill();
            self.stage.addChild(g);
          }
        });

        _.each(sps.positions, function (sp) {

          let g = self.graphics[sp.tripId];

          var pCurrent = self.projection([sp.lng, sp.lat]);
          g.x = pCurrent[0];
          g.y = pCurrent[1];
          g.toX = pCurrent[0];
          g.toY = pCurrent[1];
          g.secondsOfDay = sp.secondsOfDay;
          g.fromActualTime = g.actualTime;
          g.actualTime = new Date().getTime();
          var pFrom = self.projection([sp.fromLng, sp.fromLat]);
          g.fromX = pFrom[0] || g.x;
          g.fromY = pFrom[1] || g.y;
          g.fromSecondsOfDay = sp.fromSod;

        });
      },
      (error) => {
        console.error(error);
      }
    );

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
  }

  animate() {
    const self = this;
    if (!self.isStageUp) {
      return;
    }
    const t = new Date().getTime();
    if ((t - self.timeLastAnimate) < self.minFrameRenderingIntervalMillis) {
      requestAnimationFrame(function () {
        self.animate()
      });
      return;
    }
    self.timeLastAnimate = t;
    _.each(self.graphics, function (g) {
      let tRatio = (t - g.fromActualTime) / (g.actualTime - g.fromActualTime)-1;
      if (tRatio > 2) {
        tRatio = 2;
      }
      g.x = g.fromX + tRatio * (g.toX - g.fromX);
      g.y = g.fromY + tRatio * (g.toY - g.fromY);
    });
    const temp = self.renderTexture;
    self.renderTexture = self.renderTexture2;
    self.renderTexture2 = temp;
    self.outputSprite.texture = self.renderTexture;

    self.renderer.render(self.stage);
    self.stage.alpha = 0.95;
    self.renderer.render(self.stage, self.renderTexture2);
    self.stage.alpha = 1;

    requestAnimationFrame(function () {
      self.animate()
    });
  }

  initPixi() {
    const self = this;
    const el: HTMLElement = self.elementRef.nativeElement;

    if (self.renderer !== undefined) {
      el.removeChild(self.renderer.view);
    }
    self.sizeTag = self._buildSizeTag();

    self.renderer = PIXI.autoDetectRenderer(this.mapCoordinates.width, this.mapCoordinates.height, {
      antialias: true,
      transparent: true,
      resolution: 1
    });
    //self.renderer.view.style.border = "1px solid black";
    self.renderTexture = PIXI.RenderTexture.create(self.renderer.width, self.renderer.height);
    self.renderTexture2 = PIXI.RenderTexture.create(self.renderer.width, self.renderer.height);
    self.outputSprite = new PIXI.Sprite(self.renderTexture);

    //self.renderer.backgroundColor = 0x061639;

    el.appendChild(self.renderer.view);
    self.stage = new PIXI.Container();
    self.stage.addChild(self.outputSprite);
    self.isStageUp = true;
  }

  _buildSizeTag() {
    var self = this;
    if (self.mapCoordinates === undefined) {
      return '-';
    }
    return self.mapCoordinates.width + 'x' + self.mapCoordinates.height;
  }

}
