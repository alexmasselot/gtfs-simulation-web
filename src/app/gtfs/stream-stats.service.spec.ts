/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StreamStatsService } from './stream-stats.service';

describe('Service: StreamStats', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StreamStatsService]
    });
  });

  it('should ...', inject([StreamStatsService], (service: StreamStatsService) => {
    expect(service).toBeTruthy();
  }));
});
