import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, Subscription } from 'rxjs';
import { GameManagerService } from './game-manager.service';

export interface WaterState{
  remainingWater:number;
  numberOfPumps:number;
  waterGenerated:number;
  waterUsed:number;
  opponentWater:number;
}
@Injectable({
  providedIn: 'root'
})
export class WaterService implements OnDestroy{
  private used:number=0;
  private currentWaterState!: WaterState;
  waterStateSubscription: Subscription | undefined;
  constructor(private gameManagerService:GameManagerService) {
   this.waterStateSubscription = this.gameManagerService.getWaterStatusUpdates().subscribe((waterState: WaterState) => {
    console.log("emitter triggered update")
    this.setWaterState(waterState);
   });
   this.gameManagerService.alertTurnEnd().subscribe((isEnded:boolean)=>{
    if(isEnded){
      console.log("ended called")
      const waterUpdate = this.getWaterUpdate();
      gameManagerService.setWaterUpdate(waterUpdate.playerOneWater?waterUpdate.playerOneWater:-1,waterUpdate.playerTwoWater?waterUpdate.playerTwoWater:-1);
    }
  })
  }
  getWaterUpdate(){
    const playerStatus = this.gameManagerService.getCurrentPlayer();
    const player = playerStatus.currentPlayer;
    const waterData = this.currentWaterState;
    const playerOneWater = player ===  "PlayerOne"?waterData?.remainingWater:waterData?.opponentWater;
    const playerTwoWater = player ===  "PlayerOne"?waterData?.opponentWater:waterData?.remainingWater;
    return {playerOneWater:playerOneWater,playerTwoWater:playerTwoWater}
  }
  ngOnDestroy(): void {
    if (this.waterStateSubscription) {
      this.waterStateSubscription.unsubscribe();
    }
  }
  private waterSubject = new Subject<WaterState>();
  waterState$ = this.waterSubject.asObservable();

  setWaterState(waterState: WaterState) {
    console.log("set water called",waterState)
    this.currentWaterState = waterState;
    this.waterSubject.next(waterState);
  }
  getCurrentWaterState(){
    return this.currentWaterState;
  }
  getWaterState(): Observable<WaterState> {
    return this.waterState$;
  }
}
