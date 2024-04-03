import { TestBed } from '@angular/core/testing';

import { SpiceManagerService } from './spice-manager.service';

describe('SpiceManagerService', () => {
  let service: SpiceManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpiceManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
