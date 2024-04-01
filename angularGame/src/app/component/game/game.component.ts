import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { DiceService } from '../../service/dice-roller.service';
import { DiceComponent } from '../dice/dice.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BoardComponent,DiceComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  lastRoll: number | null = null;

  constructor(private diceService: DiceService) {
    this.diceService.diceRoll$.subscribe(value => {
      this.lastRoll = value;
    });
  }
}
