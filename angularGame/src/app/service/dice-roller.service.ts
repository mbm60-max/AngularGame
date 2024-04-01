import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  private diceRollSubject = new Subject<number>();
  diceRoll$ = this.diceRollSubject.asObservable();

  constructor() { }

  rollDice(value: number) {
    this.diceRollSubject.next(value);
  }
}
