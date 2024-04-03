import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private remainingMovesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private remainingMoves$: Observable<number> = this.remainingMovesSubject.asObservable();
  
  constructor() {}

  setRemainingMoves(movesRemaining: number) {
    this.remainingMovesSubject.next(movesRemaining);
  }

  getRemainingMoves(): Observable<number> {
    return this.remainingMoves$;
  }

  getCurrentRemainingMoves(): number {
    return this.remainingMovesSubject.value;
  }

  canMove(totalCost: number): boolean {
    console.log(totalCost)
    return ((this.remainingMovesSubject.value >= totalCost)&&(totalCost!=0)); //last check to prevent dropping on same space upping value
  }
}
