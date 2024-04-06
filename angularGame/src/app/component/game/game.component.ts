import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { DiceService } from '../../service/dice-roller.service';
import { DiceComponent } from '../dice/dice.component';
import { MoveDisplayComponent } from '../move-display/move-display.component';
import { TileSpawnerComponent } from '../tile-spawner/tile-spawner.component';
import { GameManagerService } from '../../service/game-manager.service';
import { CurrentPlayerComponent } from '../current-player/current-player.component';
import { Subscription } from 'rxjs';
import { WaterDisplayComponent } from '../water-display/water-display.component';
import { SpiceDisplayComponent } from '../spice-display/spice-display.component';
import { CreditDisplayComponent } from '../credit-display/credit-display.component';
import { NgIf } from '@angular/common';
import { EventCardDeckComponent } from '../event-card-deck/event-card-deck.component';
import { EndTurnComponent } from '../end-turn/end-turn.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BoardComponent,DiceComponent,MoveDisplayComponent,TileSpawnerComponent,CurrentPlayerComponent,WaterDisplayComponent,SpiceDisplayComponent,CreditDisplayComponent,NgIf,EventCardDeckComponent,EndTurnComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnDestroy,OnInit{
  lastRoll: number | null = null;
  toggleTurn: boolean=false;
  currentHouse:string="";
  private toggleSubscription!: Subscription;
  constructor(private diceService: DiceService,private gameManagerService:GameManagerService) {
    this.diceService.diceRoll$.subscribe(value => {
      this.lastRoll = value;
    });
    this.subscribeToGameUpdates();
    this.handleIntialToggle();
  }
 
  handleIntialToggle(){
    /*setTimeout(() => {
      const currentPlayer = this.gameManagerService.getCurrentPlayer();
      this.currentHouse= currentPlayer.house;
      if (currentPlayer.currentPlayer == "PlayerOne") {
        this.toggleTurn = true;
      } else {
        this.toggleTurn = false;
      }
    }, 2000); // 2-second delay*/
  }
  ngOnInit(): void {
    this.toggleSubscription = this.gameManagerService.getGameStatusUpdates()
      .subscribe(value => {
        console.log("game status update",value)
        this.toggleTurn = value;
        // Do something with the updated value
      });
  }
   //setSpiceState
  //setWaterState
  //setCardState
  //setCreditState
  ngOnDestroy(): void {
    this.toggleSubscription.unsubscribe();
    this.gameManagerService.unsubscribeFromGameUpdates();
  }
  private subscribeToGameUpdates() {
    this.gameManagerService.subscribeToGameUpdates(this.gameManagerService.getGameCode())
  }
}
