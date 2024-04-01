import { TestBed } from '@angular/core/testing';

import { DiceService } from './dice-roller.service';

describe('DiceRollerService', () => {
  let service: DiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
