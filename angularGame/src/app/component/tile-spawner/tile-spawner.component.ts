import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CostObject, TileEnum, TileSelectionState, TileSpawnService } from '../../service/tile-spawn.service';
import { UnitCreditsService } from '../../service/unit-credits.service';
import { SpiceManagerService, SpiceState } from '../../service/spice-manager.service';
import { Subscription } from 'rxjs';
import { GameManagerService } from '../../service/game-manager.service';

@Component({
  selector: 'app-tile-spawner',
  standalone: true,
  imports: [DragDropModule,NgIf,NgFor],
  templateUrl: './tile-spawner.component.html',
  styleUrl: './tile-spawner.component.scss'
})
export class TileSpawnerComponent implements OnInit,OnDestroy {
  @Input() toggleTurn: boolean = false;
  tiles: TileEnum[] = [];
  tileSrc:string[]= [];
  tileType:string[]=[];
  tileCosts:number[]=[];
  tileCurrency:string[]=[];
  selectedTileIndex: number | null = null;
  costs:CostObject;
  spiceStateSubscription: Subscription | undefined;
  creditStateSubscription: Subscription | undefined;
  harvesterDisabledSubscription: Subscription | undefined;
  credits:number=0;
  spice:number=0;
  error:string="";
  house:string="";
  harvesterDisabled:boolean=false;
  constructor(private tileSpawnService: TileSpawnService,private creditService:UnitCreditsService,private spiceService:SpiceManagerService,private gameManager:GameManagerService) {
    this.costs = this.tileSpawnService.getCostsAndCurrency();
    this.house = this.gameManager.getCurrentPlayer().house;
    if(this.house == "House Harkonen"){
      this.tileType = ["Spice Harvester","Water Pump","Spawn Troop"];
      this.tileSrc = ["./assets/spiceHarvester.svg","./assets/waterPump.svg","./assets/harkonen.svg"];
      this.tiles = [TileEnum.Harvester, TileEnum.WaterPump, TileEnum.Harkonen];
      this.tileCosts = [0,10,3];
      this.tileCurrency = ["spice","spice","credits"];
    }else{
      this.tileType = ["Water Pump","Spawn Troop"];
      this.tileSrc = ["./assets/waterPump.svg","./assets/soldier.svg"];
      this.tiles = [TileEnum.WaterPump, TileEnum.Fremen];
      this.tileCosts = [10,5];
      this.tileCurrency = ["spice","credits"]
    }
    this.harvesterDisabledSubscription = this.tileSpawnService.getHarvesterDisabled().subscribe((value:boolean)=>{
      this.harvesterDisabled = value;
    })
  }
  isDisabled(index: number): boolean {
    if(!this.toggleTurn){
      return false;
    }
    if(this.tileType[index]=="Spice Harvester" && this.harvesterDisabled){
      return true;
    }
    if (this.tileCurrency[index] === 'credits') {
      return this.credits < this.tileCosts[index];
    } else if (this.tileCurrency[index] === 'spice') {
      return this.spice < this.tileCosts[index];
    }
    return false;
  }
  
  ngOnInit(): void {
    this.spiceStateSubscription = this.spiceService.getSpiceState().subscribe((spiceState: SpiceState) => {
      this.spice=spiceState.remainingSpice;
    });
    this.creditStateSubscription = this.creditService.getCreditState().subscribe((creditState: number) => {
      this.credits = creditState;
    });
  }
  ngOnDestroy(): void {
    if (this.spiceStateSubscription) {
      this.spiceStateSubscription.unsubscribe();
    }
    if (this.creditStateSubscription) {
      this.creditStateSubscription.unsubscribe();
    }
  }

  handleTileClick(index: number) {
    if (this.selectedTileIndex === index || this.isDisabled(index)) {
      this.selectedTileIndex = null;
    } else {
      this.selectedTileIndex = index;
      const tileUpdate:TileSelectionState ={
        src: this.tileSrc[index],
        type: this.tileType[index],
      }
      this.tileSpawnService.setSelectedType(tileUpdate);
    }
  }
}
