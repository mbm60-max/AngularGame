import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardModalComponent } from './event-card-modal.component';

describe('EventCardModalComponent', () => {
  let component: EventCardModalComponent;
  let fixture: ComponentFixture<EventCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
