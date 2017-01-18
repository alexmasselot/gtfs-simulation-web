/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopoJsonService } from './topo-json.service';

describe('Service: TopoJson', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopoJsonService]
    });
  });

  it('should ...', inject([TopoJsonService], (service: TopoJsonService) => {
    expect(service).toBeTruthy();
  }));
});
