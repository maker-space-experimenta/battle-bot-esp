import { TestBed } from '@angular/core/testing';

import { RoboterService } from './roboter.service';

describe('RoboterService', () => {
  let service: RoboterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoboterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
