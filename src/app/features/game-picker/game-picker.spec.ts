import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePicker } from './game-picker';

describe('GamePicker', () => {
  let component: GamePicker;
  let fixture: ComponentFixture<GamePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
