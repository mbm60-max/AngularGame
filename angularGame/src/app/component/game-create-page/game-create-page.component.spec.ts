import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCreatePageComponent } from './game-create-page.component';

describe('GameCreatePageComponent', () => {
  let component: GameCreatePageComponent;
  let fixture: ComponentFixture<GameCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCreatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
