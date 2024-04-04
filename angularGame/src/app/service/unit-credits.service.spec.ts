import { TestBed } from '@angular/core/testing';

import { UnitCreditsService } from './unit-credits.service';

describe('UnitCreditsService', () => {
  let service: UnitCreditsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitCreditsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
