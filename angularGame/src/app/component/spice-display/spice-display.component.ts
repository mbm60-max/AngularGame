import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpiceManagerService, SpiceState } from '../../service/spice-manager.service';
import { GameManagerService } from '../../service/game-manager.service';

@Component({
  selector: 'app-spice-display',
  standalone: true,
  imports: [],
  templateUrl: './spice-display.component.html',
  styleUrl: './spice-display.component.scss'
})
export class SpiceDisplayComponent  implements OnInit,OnDestroy{
  remainingSpice:number=0;
  numberOfHarvesters:number=0;
  spiceGenerated:number=0;
 spiceStateSubscription: Subscription | undefined;
 constructor(private spiceService:SpiceManagerService,private gameManager:GameManagerService){

 }
 ngOnInit(){
  const currentPlayer = this.gameManager.getCurrentPlayer();
    const spiceData = this.gameManager.getSpiceData();
    console.log("currentspice",spiceData)
    if(currentPlayer.currentPlayer == "PlayerOne"){
         this.remainingSpice = spiceData.PlayerOneSpice;
         this.numberOfHarvesters=spiceData.PlayerOneNumberOfHarvesters;
         this.spiceGenerated= spiceData.PlayerOneNumberOfHarvesters;
    }else{
        this.remainingSpice = spiceData.PlayerTwoSpice;
         this.numberOfHarvesters=spiceData.PlayerTwoNumberOfHarvesters;
         this.spiceGenerated= spiceData.PlayerTwoNumberOfHarvesters;
    } 
   this.spiceStateSubscription = this.spiceService.getSpiceState().subscribe((spiceState: SpiceState) => {
    console.log("Requested spice data");
    console.log("Remaining spice",spiceState.remainingSpice);
     // Handle the winner change here
     this.remainingSpice=spiceState.remainingSpice;
     this.numberOfHarvesters=spiceState.numberOfHarvesters;
     this.spiceGenerated=spiceState.spiceGenerated;
   });
 }
 ngOnDestroy(): void {
  if (this.spiceStateSubscription) {
    this.spiceStateSubscription.unsubscribe();
  }
}
 }
