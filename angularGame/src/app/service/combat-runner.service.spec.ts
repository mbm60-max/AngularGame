import { TestBed } from '@angular/core/testing';

import { CombatRunnerService } from './combat-runner.service';

describe('CombatRunnerService', () => {
  let service: CombatRunnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombatRunnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
