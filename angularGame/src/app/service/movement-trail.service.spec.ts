import { TestBed } from '@angular/core/testing';

import { MovementTrailService } from './movement-trail.service';

describe('MovementTrailService', () => {
  let service: MovementTrailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovementTrailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
