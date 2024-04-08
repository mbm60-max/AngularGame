import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dice',
  templateUrl: './dice-test.component.html',
  styleUrls: ['./dice-test.component.scss'],
  standalone: true,
  animations: [
    trigger('buttonAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition(':enter, :leave', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})
export class DiceTestComponent implements AfterViewInit {
  @ViewChild('dice', { static: true }) dice!: ElementRef<HTMLDivElement>;
  @ViewChild('secondDice', { static: true }) secondDice!: ElementRef<HTMLDivElement>;
  diceValue:number=-1;
  hasRolled: boolean = false;
  animationFinished: boolean = true;

  ngAfterViewInit() {
    this.animationFinished = true;
  }

  randomDice() {
    const dice1Value = Math.floor(Math.random() * 6) + 1;
    const dice2Value = Math.floor(Math.random() * 6) + 1;
    const totalRoll = dice1Value + dice2Value;
    this.diceValue = totalRoll;

    // Your logic for setting turn status

    this.hasRolled = true;
    this.rollDice(dice1Value, dice2Value);
  }

  rollDice(random1: number, roll2: number) {
    const dice = this.dice.nativeElement;
    const secondDice = this.secondDice.nativeElement;

    dice.style.animation = 'rolling 4s';
    secondDice.style.animation = 'rolling 4s';

    setTimeout(() => {
      // Your logic for switching dice faces
      dice.style.animation = 'none';
      secondDice.style.animation = 'none';
    }, 550);
  }
}
