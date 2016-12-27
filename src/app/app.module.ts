import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app.component';
import {TestTickComponent} from './test-tick/test-tick.component';
import {SimulatedPositionsComponent} from './gtfs/simulated-positions/simulated-positions.component';
import {ServerSideEventsService} from './server-side-events.service';
import {MapComponent} from './stamen/map/map.component';
import {mapCoordinatesReducer} from './reducers/map-coordinates.reducer';
import { MappedPositionsComponent } from './gtfs/mapped-positions/mapped-positions.component';
import { TopoJsonMapComponent } from './map/topo-json-map/topo-json-map.component';
import { StreamStatsComponent } from './gtfs/stream-stats/stream-stats.component';
import {streamStatsReducer} from "./reducers/steam-stats.reducer";

@NgModule({
  declarations: [
    AppComponent,
    TestTickComponent,
    SimulatedPositionsComponent,
    MapComponent,
    MappedPositionsComponent,
    TopoJsonMapComponent,
    StreamStatsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore({mapCoordinates: mapCoordinatesReducer, streamStats: streamStatsReducer})
  ],
  providers: [ServerSideEventsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
