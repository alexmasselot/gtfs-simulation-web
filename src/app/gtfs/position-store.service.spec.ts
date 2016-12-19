/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PositionStoreService } from './position-store.service';

describe('Service: PositionStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionStoreService]
    });
  });

  it('should ...', inject([PositionStoreService], (service: PositionStoreService) => {
    expect(service).toBeTruthy();
  }));
});
