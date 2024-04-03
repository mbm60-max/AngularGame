import { TestBed } from '@angular/core/testing';

import { TileSpawnService } from './tile-spawn.service';

describe('TileSpawnService', () => {
  let service: TileSpawnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileSpawnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
