import { Injectable } from '@angular/core';

export enum TileEnum{
  Fremen="/assets/soldier.svg",
  Harkonen="/assets/harkonen.svg",
  WaterPump="/assets/waterPump.svg",
  Harvester="/assets/spiceHarvester.svg",
  EnemyItem="/assets/enemyTile.svg",
  SpiceField="/assets/spiceField.svg",
  None="",
}
@Injectable({
  providedIn: 'root'
})
export class TileSpawnService {
  selectedType:TileEnum=TileEnum.None;
  constructor() { }
  setSelectedType(TileType:TileEnum){
    this.selectedType=TileType;
  }
  getSelectedType(){
    return this.selectedType;
  }
}
