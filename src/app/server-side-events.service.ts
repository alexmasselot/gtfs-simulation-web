import { Injectable } from '@angular/core';
import {Observable}   from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

declare var EventSource:any;

@Injectable()
export class ServerSideEventsService {

  constructor() { }

  streamObservable(url:String){
    const observable = Observable.create(observer => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = x => observer.next(x.data);
      eventSource.onerror = x => observer.error(x);

      return () => {
        eventSource.close();
      };
    });
    return observable;
  }

}
