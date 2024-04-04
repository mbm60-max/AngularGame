import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterDisplayComponent } from './water-display.component';

describe('WaterDisplayComponent', () => {
  let component: WaterDisplayComponent;
  let fixture: ComponentFixture<WaterDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WaterDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
