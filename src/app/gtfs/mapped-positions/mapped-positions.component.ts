import {Component, OnInit, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {HasMapCoordinatesStore} from "../../reducers/HasMapCoordinatesStore";
import {AppState} from "../../reducers/AppState";
import {SET_DIMENSIONS} from "../../reducers/map-coordinates.reducer";

declare var d3: any;

@Component({
  selector: 'gtfssim-mapped-positions',
  templateUrl: './mapped-positions.component.html',
  styleUrls: ['./mapped-positions.component.css']
})
export class MappedPositionsComponent extends HasMapCoordinatesStore implements OnInit {

  constructor(public elementRef: ElementRef, protected store: Store<AppState>) {
    super(store);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    var el: HTMLElement = this.elementRef.nativeElement;
    var dim=d3.select(el).node().getBoundingClientRect();
    this.store.dispatch({type: SET_DIMENSIONS, payload:{height:dim.height, width:dim.width}});
  }
}
