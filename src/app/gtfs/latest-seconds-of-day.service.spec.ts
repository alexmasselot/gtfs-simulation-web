/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LatestSecondsOfDayService } from './latest-seconds-of-day.service';

describe('Service: CurrentTimestamp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LatestSecondsOfDayService]
    });
  });

  it('should ...', inject([LatestSecondsOfDayService], (service: LatestSecondsOfDayService) => {
    expect(service).toBeTruthy();
  }));
});
