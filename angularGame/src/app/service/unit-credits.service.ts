import { Injectable, OnDestroy } from '@angular/core';
import { GameManagerService } from './game-manager.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitCreditsService implements OnDestroy{
  private total:number=0;
  creditStateSubscription: Subscription | undefined;
  constructor(private gameManagerService:GameManagerService) {
    setTimeout(() => { 
      console.log("first credits loaded")
    const currentPlayer = this.gameManagerService.getCurrentPlayer();
    const playerOneData =  this.gameManagerService.getPlayerOneData()
    const playerTwoData =  this.gameManagerService.getPlayerTwoData()
  if(currentPlayer.currentPlayer == "PlayerOne"){
    this.total = playerOneData.NumberOfCredits +2;
    this.setCreditState(this.total);
  }else{
    this.total = playerTwoData.NumberOfCredits +2;
    this.setCreditState(this.total);
  }
  this.creditStateSubscription = this.gameManagerService.getCreditStatusUpdates().subscribe((credits:number) => {
    this.setCreditState(credits);
   });
}, 1500);
  }
  ngOnDestroy(): void {
    if (this.creditStateSubscription) {
      this.creditStateSubscription.unsubscribe();
    }
  }
 
 
  private creditSubject = new Subject<number>();
  creditState$ = this.creditSubject.asObservable();

  setCreditState(creditState:number) {
    this.creditSubject.next(creditState);
  }

  getCreditState(): Observable<number> {
    return this.creditState$;
  }
}