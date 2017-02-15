import {Component, OnInit} from "@angular/core";
import {CompleterService, CompleterData} from "ng2-completer";
import {TopoJsonService} from "../map/topo-json.service";
import {Router, NavigationEnd} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'gtfssim-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css'],
  providers:[TopoJsonService]
})
export class LocationSelectorComponent implements OnInit {

  private level: string = 'country'
  private dataService: CompleterData;
  private searchData = [];
  private locationName:String;

  constructor(private completerService: CompleterService,
              private topoJsonService: TopoJsonService,
              private router: Router) {
    const self = this;
    ['municipalities', 'cantons'].forEach(function(l){
      self.searchData[l]= _.sortBy(topoJsonService.objectProperies(l), 'name');
    });
    self.searchData['country']=[];
    this._updateValue();
  }

  ngOnInit() {
    const self = this;
    //Fills field from the route
    self.router.events.subscribe(evt => {
      if(evt instanceof NavigationEnd) {
        const url = evt.url;
        var relevel=/.*\blevel=([^;]+);?/;
        var reName=/.*\bname=([^;]+);?/;
        const matchLevel=relevel.exec(url);
        const matchName=reName.exec(url);
        if(matchLevel){
          self.level=matchLevel[1]
          self.locationName='';
        }
        if(matchName){
          self.locationName=decodeURIComponent(matchName[1]);
        }
        self._updateValue();
      }
    });
  }

  _updateValue() {
    this.dataService = this.completerService.local(this.searchData[this.level], 'name', 'name');
  }


  changeLevel() {
    this._updateValue();
    this.locationName='';
  }

  submit(){
    var hash = '#/focus;level='+this.level;
    if(this.locationName){
      hash+=';name='+this.locationName;
    }
    location.hash=hash;
    location.reload();
  }
}
