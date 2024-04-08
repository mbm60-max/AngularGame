import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DiceService } from '../../service/dice-roller.service';
import { MovementService } from '../../service/movement-service.service';
import { GameManagerService } from '../../service/game-manager.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss',
  animations: [
    trigger('buttonAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition(':enter, :leave', [
        animate('0.5s ease-in-out')
      ])
    ]),
    trigger('diceAnimation', [
      state('1', style({ transform: 'rotateX(0deg) rotateY(0deg)' })),
      state('6', style({ transform: 'rotateX(180deg) rotateY(0deg)' })),
      state('2', style({ transform: 'rotateX(-90deg) rotateY(0deg)' })),
      state('5', style({ transform: 'rotateX(90deg) rotateY(0deg)' })),
      state('3', style({ transform: 'rotateX(0deg) rotateY(90deg)' })),
      state('4', style({ transform: 'rotateX(0deg) rotateY(-90deg)' })),
      transition('* => *', animate('550ms ease-in-out'))
    ])
  ]
})
export class DiceComponent {
  hasRolled:boolean=true;
  animationFinished:boolean=false;
  @Input() toggleTurn: boolean = false;
  constructor(private diceService: DiceService,private movementService:MovementService,private gameManager:GameManagerService) {
    this.hasRolled = this.gameManager.getTurnStatus().hasRolled;
    this.gameManager.getGameStatusUpdates()
      .subscribe(value => {
        this.hasRolled = false;//reset has rolled for both players after a turn is taken
        this.animationFinished = false;
        this.diceValue=0;
        this.secondDiceValue=0;
      });
   }
  diceValue:number=0
  secondDiceValue: number = 0;

  
  /* Credit for following code - hosseinnabi-ir @ https://github.com/hosseinnabi-ir/Roll-Dice-Project-using-CSS-and-JavaScript/blob/AngularProject/*/
  randomDice() {
    this.diceValue = Math.floor(Math.random() * 6) + 1;
    this.secondDiceValue = Math.floor(Math.random() * 6) + 1;
    const totalRoll = this.diceValue+this.secondDiceValue;
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
    this.animationFinished = false;
    setTimeout(() => {
      this.animationFinished = true;
    },2000);
  
  }
}
