import { TestBed } from '@angular/core/testing';

import { HousePickerService } from './house-picker.service';

describe('HousePickerService', () => {
  let service: HousePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
