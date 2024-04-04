import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameManagerService } from '../../service/game-manager.service';
import { WaterService, WaterState } from '../../service/water.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-water-display',
  standalone: true,
  imports: [],
  templateUrl: './water-display.component.html',
  styleUrl: './water-display.component.scss'
})
export class WaterDisplayComponent implements OnInit,OnDestroy {
 remainingWater:number=0;
 numberOfPumps:number=0;
 waterGenerated:number=0;
 waterUsed:number=0;
waterStateSubscription: Subscription | undefined;
constructor(private waterService:WaterService){

}
ngOnInit(){
  this.waterStateSubscription = this.waterService.getWaterState().subscribe((waterState: WaterState) => {
    // Handle the winner change here
    this.remainingWater=waterState.remainingWater;
    this.numberOfPumps=waterState.numberOfPumps;
    this.waterGenerated=waterState.waterGenerated;
    this.waterUsed=waterState.waterUsed;
  });
}
ngOnDestroy(): void {
  if (this.waterStateSubscription) {
    this.waterStateSubscription.unsubscribe();
  }
}
}
