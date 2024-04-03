import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousePickerComponent } from './house-picker.component';

describe('HousePickerComponent', () => {
  let component: HousePickerComponent;
  let fixture: ComponentFixture<HousePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HousePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
