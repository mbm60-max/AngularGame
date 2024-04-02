import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningCodeComponent } from './joining-code.component';

describe('JoiningCodeComponent', () => {
  let component: JoiningCodeComponent;
  let fixture: ComponentFixture<JoiningCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoiningCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoiningCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
