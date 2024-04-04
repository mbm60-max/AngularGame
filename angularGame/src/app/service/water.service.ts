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
  waterStateSubscription: Subscription | undefined;
  constructor(private gameManagerService:GameManagerService) {
    setTimeout(() => { 
    console.log("first water  loaded")
    const currentPlayer = this.gameManagerService.getCurrentPlayer();
    const playerOneData =  this.gameManagerService.getPlayerOneData()
    const playerTwoData =  this.gameManagerService.getPlayerTwoData()
  if(currentPlayer.currentPlayer == "PlayerOne"){
    const starting = playerOneData.TotalWater;
    const numberOfPumps = playerOneData.WaterPumpIndices.length;
    const generated = (numberOfPumps*5)

    if(currentPlayer.house == "House Harkonen"){
      this.used = playerOneData.NumberOfTroops*5;
    }else{
      this.used = playerOneData.NumberOfTroops*2;
    }
    const waterState:WaterState ={
      remainingWater: starting+generated-this.used,
      numberOfPumps: numberOfPumps,
      waterGenerated: generated,
      waterUsed: this.used,
      opponentWater:playerTwoData.TotalWater,
    }
    this.setWaterState(waterState);
  }else{
    
    const starting = playerTwoData.TotalWater;
    const numberOfPumps = playerTwoData.WaterPumpIndices.length;
    const generated = (numberOfPumps*5)

    if(currentPlayer.house == "House Harkonen"){
      this.used = playerTwoData.NumberOfTroops*5;
    }else{
      this.used = playerTwoData.NumberOfTroops*2;
    }
    const waterState:WaterState ={
      remainingWater: starting+generated-this.used,
      numberOfPumps: numberOfPumps,
      waterGenerated: generated,
      waterUsed: this.used,
      opponentWater:playerOneData.TotalWater,
    }
    this.setWaterState(waterState);
  }this.waterStateSubscription = this.gameManagerService.getWaterStatusUpdates().subscribe((waterState: WaterState) => {
    this.setWaterState(waterState);
   });
}, 1500);
  }
  ngOnDestroy(): void {
    if (this.waterStateSubscription) {
      this.waterStateSubscription.unsubscribe();
    }
  }
  private waterSubject = new Subject<WaterState>();
  waterState$ = this.waterSubject.asObservable();

  setWaterState(waterState: WaterState) {
    this.waterSubject.next(waterState);
  }

  getWaterState(): Observable<WaterState> {
    return this.waterState$;
  }
}
