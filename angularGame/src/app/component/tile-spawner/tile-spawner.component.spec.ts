import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileSpawnerComponent } from './tile-spawner.component';

describe('TileSpawnerComponent', () => {
  let component: TileSpawnerComponent;
  let fixture: ComponentFixture<TileSpawnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileSpawnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TileSpawnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
