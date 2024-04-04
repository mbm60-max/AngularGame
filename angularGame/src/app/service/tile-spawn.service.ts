import { Injectable } from '@angular/core';
import { GameManagerService } from './game-manager.service';
import { Observable, Subject } from 'rxjs';

export enum TileEnum{
  Fremen="/assets/soldier.svg",
  Harkonen="/assets/harkonen.svg",
  WaterPump="/assets/waterPump.svg",
  Harvester="/assets/spiceHarvester.svg",
  EnemyItem="/assets/enemyTile.svg",
  SpiceField="/assets/spiceField.svg",
  None="",
}
export interface TileUpdateState{
  src:string;
  indexTarget:number;
  type:string;
}

export interface TileSelectionState{
  src:string;
  type:string;
}
export interface CostObject{
  pumpCost:number;
  unitCost:number;
  harvesterCost:number;
}
@Injectable({
  providedIn: 'root'
})
export class TileSpawnService {
  selectedTile:TileSelectionState={
    type:"",
    src:"",
  }
  pumpCost:number=0;
  unitCost:number=0;
  harvesterCost:number=-1;
  house:string="";
  aggressorIndex:number=-1;
  constructor(private gameManagerService:GameManagerService) {
    const playerData = this.gameManagerService.getCurrentPlayer();
      this.house = playerData.house;
      if(this.house == "House Harkonen"){
         this.unitCost = 3;
         this.pumpCost = 10;
         this.harvesterCost = 10;
      }else{
        this.unitCost = 5;
        this.pumpCost = 10;
        this.harvesterCost = -1;
      }
  }
 
  setAggressorIndex(index:number){
    this.aggressorIndex = index;
  }
  getAggresorIndex(){
    return this.aggressorIndex;
  }
  getCostsAndCurrency():CostObject{
    const costAndCurrencyObject:CostObject={
      pumpCost: this.pumpCost,
      unitCost: this.unitCost,
      harvesterCost: this.harvesterCost,
    }
    return costAndCurrencyObject
  }
  setCredits(){

  }
  setSpice(){

  }
  setSelectedType(TileUpdate:TileSelectionState){

      this.selectedTile= TileUpdate;
    }

  getSelectedTileData(){
    return this.selectedTile;
  }
 
  private tileSubject = new Subject<TileUpdateState>();
  tileState$ = this.tileSubject.asObservable();

  setTileState(tileState: TileUpdateState) {
    this.tileSubject.next(tileState);
  }

  getTileState(): Observable<TileUpdateState> {
    return this.tileState$;
  }
}
