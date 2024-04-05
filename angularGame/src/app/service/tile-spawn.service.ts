import { Injectable, OnDestroy } from '@angular/core';
import { GameManagerService } from './game-manager.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { UnitCreditsService } from './unit-credits.service';
import { SpiceManagerService, SpiceState } from './spice-manager.service';
import { WaterService, WaterState } from './water.service';

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
export class TileSpawnService implements OnDestroy{
  selectedTile:TileSelectionState={
    type:"",
    src:"",
  }
  pumpCost:number=0;
  unitCost:number=0;
  harvesterCost:number=-1;
  house:string="";
  aggressorIndex:number=-1;
  credits:number=0;
  spiceData:SpiceState={
    remainingSpice: 0,
    numberOfHarvesters: 0,
    spiceGenerated: 0
  }
  waterData:WaterState={
    remainingWater: 0,
    numberOfPumps: 0,
    waterGenerated: 0,
    waterUsed: 0,
    opponentWater: 0
  }
  creditStateSubscription: Subscription | undefined;
  spiceStateSubscription: Subscription | undefined;
  waterStateSubscription:Subscription | undefined;
  houseSubscription:Subscription | undefined;
  constructor(private gameManagerService:GameManagerService,private unitCreditService:UnitCreditsService,private spiceService:SpiceManagerService,private waterService:WaterService) {
    const playerData = this.gameManagerService.getCurrentPlayer();
      this.house = playerData.house;
      if(playerData.house == "House Harkonen"){
         this.unitCost = 3;
         this.pumpCost = 10;
         this.harvesterCost = -1;
      }else{
        this.unitCost = 5;
        this.pumpCost = 10;
        this.harvesterCost = -1;
      }
    this.creditStateSubscription = this.unitCreditService.getCreditState().subscribe((creditState: number) => {
      this.credits = creditState;
    });
    this.spiceStateSubscription= this.spiceService.getSpiceState().subscribe((spiceState: SpiceState) => {
      this.spiceData = spiceState;
    });
    this.waterStateSubscription= this.waterService.getWaterState().subscribe((waterState: WaterState) => {
      this.waterData = waterState;
    });
    this.houseSubscription = this.gameManagerService.getHouseStatusUpdates().subscribe(value => {
      if(value == "House Harkonen"){
        this.unitCost = 3;
        this.pumpCost = 10;
        this.harvesterCost = -1;
     }else{
       this.unitCost = 5;
       this.pumpCost = 10;
       this.harvesterCost = -1;
     }
    });
  }
  ngOnDestroy(): void {
    if (this.creditStateSubscription) {
      this.creditStateSubscription.unsubscribe();
    }
    if (this.spiceStateSubscription) {
      this.spiceStateSubscription.unsubscribe();
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
    if(this.credits-this.unitCost>=0){
      this.unitCreditService.setCreditState(this.credits-this.unitCost);
    }
  }
  setSpice(){
    const updateSpice = {...this.spiceData};
    updateSpice.remainingSpice -= this.pumpCost;
    if(updateSpice.remainingSpice>=0){
    this.spiceService.setSpiceState(updateSpice);
    }
  }

  setSelectedType(TileUpdate:TileSelectionState){

      this.selectedTile= TileUpdate;
    }

  getSelectedTileData(){
    return this.selectedTile;
  }
  private harvesterDisabled = new Subject<boolean>();
  disabledState$ = this.harvesterDisabled.asObservable();
  private tileSubject = new Subject<TileUpdateState>();
  tileState$ = this.tileSubject.asObservable();

  setTileState(tileState: TileUpdateState) {
    if(tileState.type == "Spawn Troop"){
      if((this.credits-this.unitCost)<0){
       return;
      }
    }
    if(tileState.type == "Water Pump"){
      const updateSpice = {...this.spiceData};
      updateSpice.remainingSpice -= this.pumpCost;
      if(updateSpice.remainingSpice<0){
      return;
      }
      const updateWater = {...this.waterData};
      updateWater.numberOfPumps+=1;
      console.log("in tile spawner")
      this.waterService.setWaterState(updateWater);
    }
  if(tileState.type == "Spice Harvester"){
    const updateSpice = {...this.spiceData};
    updateSpice.numberOfHarvesters+=1;
    this.spiceService.setSpiceState(updateSpice);
    this.harvesterDisabled.next(true);
  }
    this.tileSubject.next(tileState);
  }

  getTileState(): Observable<TileUpdateState> {
    return this.tileState$;
  }
  getHarvesterDisabled(): Observable<boolean> {
    return this.disabledState$;
  }
}
