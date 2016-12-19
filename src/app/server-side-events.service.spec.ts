/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServerSideEventsService } from './server-side-events.service';

describe('Service: ServerSideEvents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerSideEventsService]
    });
  });

  it('should ...', inject([ServerSideEventsService], (service: ServerSideEventsService) => {
    expect(service).toBeTruthy();
  }));
});
