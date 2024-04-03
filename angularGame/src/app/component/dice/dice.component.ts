import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DiceService } from '../../service/dice-roller.service';
import { MovementService } from '../../service/movement-service.service';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss'
})
export class DiceComponent {
  constructor(private diceService: DiceService,private movementService:MovementService) { }
  diceValue:number=0
  rollDice() {
    // Generate a random number between 1 and 6
    const dice1Value = Math.floor(Math.random() * 6) + 1;
    const dice2Value = Math.floor(Math.random() * 6) + 1;
    const totalRoll = dice1Value+dice2Value;
    this.diceValue=totalRoll
    this.movementService.setRemainingMoves(totalRoll);
    this.diceService.rollDice(totalRoll);
  }
}
