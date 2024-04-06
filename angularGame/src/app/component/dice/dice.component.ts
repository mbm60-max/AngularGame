import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiceService } from '../../service/dice-roller.service';
import { MovementService } from '../../service/movement-service.service';
import { GameManagerService } from '../../service/game-manager.service';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss'
})
export class DiceComponent {
  hasRolled:boolean=true;
  @Input() toggleTurn: boolean = false;
  constructor(private diceService: DiceService,private movementService:MovementService,private gameManager:GameManagerService) {
    this.hasRolled = this.gameManager.getTurnStatus().hasRolled;
    this.gameManager.getGameStatusUpdates()
      .subscribe(value => {
        console.log("game status update",value)
        this.hasRolled = false;//reset has rolled for both players after a turn is taken
      });
   }
  diceValue:number=0
  
  rollDice() {
    // Generate a random number between 1 and 6
    const dice1Value = Math.floor(Math.random() * 6) + 1;
    const dice2Value = Math.floor(Math.random() * 6) + 1;
    const totalRoll = dice1Value+dice2Value;
    this.diceValue=totalRoll
    this.movementService.setRemainingMoves(totalRoll);
    this.diceService.rollDice(totalRoll);
    const currentTurnStatus = this.gameManager.getTurnStatus();
    this.gameManager.setTurnStatus({
      hasMoved: currentTurnStatus.hasMoved,
      hasPlaced: currentTurnStatus.hasPlaced,
      hasTakenCard: currentTurnStatus.hasTakenCard,
      combatFinished: currentTurnStatus.combatFinished,
      hasRolled: true,
    });
    this.hasRolled=true;
  }
}
