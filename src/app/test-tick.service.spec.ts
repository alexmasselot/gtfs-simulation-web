/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TestTickService } from './test-tick.service';

describe('Service: TestTick', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestTickService]
    });
  });

  it('should ...', inject([TestTickService], (service: TestTickService) => {
    expect(service).toBeTruthy();
  }));
});
