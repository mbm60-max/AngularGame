import { Injectable, OnDestroy } from '@angular/core';
import { GameManagerService } from './game-manager.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitCreditsService implements OnDestroy{
  private total:number=0;
  private currentCredit:number=-1;
  creditStateSubscription: Subscription | undefined;
  constructor(private gameManagerService:GameManagerService) {
      /*console.log("first credits loaded")
    const currentPlayer = this.gameManagerService.getCurrentPlayer();
    const playerOneData =  this.gameManagerService.getPlayerOneData()
    const playerTwoData =  this.gameManagerService.getPlayerTwoData()
  if(currentPlayer.currentPlayer == "PlayerOne"){
    this.total = playerOneData.NumberOfCredits +2;
    this.setCreditState(this.total);
  }else{
    this.total = playerTwoData.NumberOfCredits +2;
    this.setCreditState(this.total);
  }*/
  this.creditStateSubscription = this.gameManagerService.getCreditStatusUpdates().subscribe((credits:number) => {
    this.setCreditState(credits);
   });
   this.gameManagerService.alertTurnEnd().subscribe((isEnded:boolean)=>{
    if(isEnded){
      const creditData = this.getCreditData();
      this.gameManagerService.setCreditUpdate(creditData.playerOneCredits,creditData.playerTwoCredits);
    }
  })
  }
  getCreditData(){
    const playerData = this.gameManagerService.getCurrentPlayer();
    const playerOneData =this.gameManagerService.getPlayerOneData();
    const playerTwoData=this.gameManagerService.getPlayerTwoData();
    const playerOneCredits = playerData.currentPlayer === "PlayerOne"?this.currentCredit:playerOneData.NumberOfCredits;
    const playerTwoCredits = playerData.currentPlayer === "PlayerOne"?playerTwoData.NumberOfCredits:this.currentCredit;
    return {playerOneCredits:playerOneCredits,playerTwoCredits:playerTwoCredits}
  }
  ngOnDestroy(): void {
    if (this.creditStateSubscription) {
      this.creditStateSubscription.unsubscribe();
    }
  }
 
 
  private creditSubject = new Subject<number>();
  creditState$ = this.creditSubject.asObservable();

  setCreditState(creditState:number) {
    console.log("set credit called",creditState)
    this.currentCredit=creditState;
    this.creditSubject.next(creditState);
  }
getCurrentCredits(){
  return this.currentCredit;
}
  getCreditState(): Observable<number> {
    return this.creditState$;
  }
}