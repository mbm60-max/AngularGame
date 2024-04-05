import { Injectable, OnDestroy } from '@angular/core';
import { MapGeneratorService } from './map-generator.service';
import { GameManagerService } from './game-manager.service';
import { Subject, Observable, Subscription } from 'rxjs';
enum PlayerEnum{
  Player1="Player1",
  Player2="Player2",
  None="None"
}
interface SpiceCell {
  cellIndex: number;
  ownedBy: PlayerEnum;
  hasHarvester: boolean;
}
export interface SpiceState{
  remainingSpice:number;
  numberOfHarvesters:number;
  spiceGenerated:number;
}

@Injectable({
  providedIn: 'root'
})
export class SpiceManagerService implements OnDestroy {
  private spiceCells: SpiceCell[] = [];
  private currentSpice:number=-1;
  spiceStateSubscription: Subscription | undefined;
  constructor(private mapGeneratorService: MapGeneratorService,private gameManager:GameManagerService) { 
    this.generateSpiceCells()
    this.spiceStateSubscription = this.gameManager.getSpiceStatusUpdates().subscribe((spiceState:SpiceState) => {
      this.setSpiceState(spiceState);
     });
     this.gameManager.alertTurnEnd().subscribe((isEnded:boolean)=>{
      if(isEnded){
        const spiceUpdate = this.getSpiceUpdate();
        this.gameManager.setSpiceUpdate(spiceUpdate.playerOneSpice,spiceUpdate.playerTwoSpice);
        //gameManagerSet values
      }
    })
  }
  getSpiceUpdate(){
    const playerData = this.gameManager.getCurrentPlayer();
    const spiceData = this.gameManager.getSpiceData();
    const playerOneSpice = playerData.currentPlayer === "PlayerOne"?this.currentSpice:spiceData.PlayerOneSpice;
    const playerTwoSpice = playerData.currentPlayer === "PlayerOne"?spiceData.PlayerTwoSpice:this.currentSpice;
    return {playerOneSpice:playerOneSpice,playerTwoSpice:playerTwoSpice}
  }
  ngOnDestroy(): void {
    if (this.spiceStateSubscription) {
      this.spiceStateSubscription.unsubscribe();
    }
  }

  private spiceSubject = new Subject<SpiceState>();
  spiceState$ = this.spiceSubject.asObservable();

  setSpiceState(spiceState: SpiceState) {
    this.currentSpice = spiceState.remainingSpice;
    this.spiceSubject.next(spiceState);
  }

  getSpiceState(): Observable<SpiceState> {
    return this.spiceState$;
  }

  setSpiceCell(cellIndex: number, ownedBy: PlayerEnum, hasHarvester: boolean) {
    const existingCellIndex = this.spiceCells.findIndex(cell => cell.cellIndex === cellIndex);

    if (existingCellIndex !== -1) {
      // If the cell already exists, update its properties
      this.spiceCells[existingCellIndex].ownedBy = ownedBy;
      this.spiceCells[existingCellIndex].hasHarvester = hasHarvester;
    } else {
      // If the cell doesn't exist, create a new one
      this.spiceCells.push({ cellIndex, ownedBy, hasHarvester });
    }
  }
  generateSpiceCells() {
    const spiceCellsFromMap = this.mapGeneratorService.getSpiceCells();
    
    spiceCellsFromMap.forEach(cellIndex => {
      this.setSpiceCell(cellIndex, PlayerEnum.None, false);
    });
  }
  getSpiceCells(){
    return this.spiceCells;
  }
  getSpiceCellsIndices() {
    return this.spiceCells.map(cell => cell.cellIndex);
  }
}
