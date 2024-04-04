import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpiceDisplayComponent } from './spice-display.component';

describe('SpiceDisplayComponent', () => {
  let component: SpiceDisplayComponent;
  let fixture: ComponentFixture<SpiceDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpiceDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpiceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
