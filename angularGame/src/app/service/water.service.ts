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
   this.waterStateSubscription = this.gameManagerService.getWaterStatusUpdates().subscribe((waterState: WaterState) => {
    this.setWaterState(waterState);
   });

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
