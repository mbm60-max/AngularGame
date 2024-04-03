import { Component, OnDestroy } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { DiceService } from '../../service/dice-roller.service';
import { DiceComponent } from '../dice/dice.component';
import { MoveDisplayComponent } from '../move-display/move-display.component';
import { TileSpawnerComponent } from '../tile-spawner/tile-spawner.component';
import { GameManagerService } from '../../service/game-manager.service';
import { CurrentPlayerComponent } from '../current-player/current-player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BoardComponent,DiceComponent,MoveDisplayComponent,TileSpawnerComponent,CurrentPlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnDestroy{
  lastRoll: number | null = null;

  constructor(private diceService: DiceService,private gameManagerService:GameManagerService) {
    this.diceService.diceRoll$.subscribe(value => {
      this.lastRoll = value;
    });
    this.subscribeToGameUpdates();
  }
  ngOnDestroy(): void {
    this.gameManagerService.unsubscribeFromGameUpdates();
  }
  private subscribeToGameUpdates() {
    this.gameManagerService.subscribeToGameUpdates(this.gameManagerService.getGameCode())
  }
}
