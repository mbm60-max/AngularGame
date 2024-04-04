import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardDeckComponent } from './event-card-deck.component';

describe('EventCardDeckComponent', () => {
  let component: EventCardDeckComponent;
  let fixture: ComponentFixture<EventCardDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardDeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventCardDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
