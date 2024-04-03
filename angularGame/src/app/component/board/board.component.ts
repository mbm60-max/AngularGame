import { Component, Input, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { MapGeneratorService, MountainPosition } from '../../service/map-generator.service';
import { MovementTrailService } from '../../service/movement-trail.service';
import { DiceComponent } from '../dice/dice.component';
import { MovementService } from '../../service/movement-service.service';
import { TileEnum, TileSpawnService } from '../../service/tile-spawn.service';
import { SpiceManagerService } from '../../service/spice-manager.service';
import { GameManagerService } from '../../service/game-manager.service';
export interface Cell {
  index: number;
  src: string;
  isOccupied:boolean;
}

enum HouseEnum{
  Harkonen = 'Harkonen',
  Fremen = 'Fremen',
}
@Component({
  selector: 'app-board',
  standalone: true,
  imports:[NgFor,NgIf,DragDropModule,DiceComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit{
  @Input() lastRoll: number | null = null;
  mountainPositions: MountainPosition[]=[];
  trail:number[]=[];
  trailColor:string="rgba(0, 0, 255, 0.1)";
  board: number[] = Array(720).fill(0);
  waterAndSpiceBoard: string[] = Array(720).fill("");
  remainingMoves:number=6;
  mountainBoard:boolean[] = Array(720).fill(false);
  virtualBoard: Cell[] = Array.from({ length: 720 }, (_, index) => ({
    index: index,
    src: '',
    isOccupied: false
  }));

  playerHouse:HouseEnum=HouseEnum.Harkonen;

  constructor(private movementTrailService:MovementTrailService,private movementService:MovementService,private tileSpawnService:TileSpawnService,private gameManagerService:GameManagerService) {
    this.board[0] = 1;
    this.board[2] = 1;
    this.virtualBoard[0]={index:0,src:"/assets/soldier.svg",isOccupied:true}
    this.virtualBoard[2]={index:2,src:"/assets/soldier.svg",isOccupied:true}
  }
  ngOnInit(): void {
    setTimeout(() => {
   const mapData = this.gameManagerService.getMapData();
   console.log(mapData);
    this.mountainPositions = mapData.MountainPositions;
    let occupiedCells = mapData.OccupiedCells;

    for (let i = 0; i < this.virtualBoard.length; i++) {
      if (occupiedCells[i]) {
        this.mountainBoard[i] = true;
      }
    }
    const spiceData = this.gameManagerService.getSpiceData();
    const spiceCells = spiceData.SpiceFieldIndices;
    for(let i=0; i<spiceCells.length;i++){
      console.log(spiceCells[i])
      this.waterAndSpiceBoard[spiceCells[i]]="./assets/spiceField.svg";
    }
  }, 1500);
  }

  currentPath(index: number): string {
    return this.virtualBoard[index].src;
  }
  toggleCell(index: number) {
    const tileType = this.tileSpawnService.getSelectedType();
    switch(tileType){
      case(TileEnum.Fremen):
      break;
      case(TileEnum.Harkonen):
      break;
      case(TileEnum.Harvester):
      break;
      case(TileEnum.WaterPump):
      break;
      case(TileEnum.None):
      break;
    }
    console.log(tileType);
}
  drop(event: CdkDragDrop<number>) {
    const previousIndex =event.previousContainer.data;
    const newIndex =event.container.data;
    let trailData = this.movementTrailService.getTrail(previousIndex, newIndex, this.mountainBoard);
    this.trail = trailData.trail;
    if(this.movementService.canMove(trailData.totalCost)){
      this.board[previousIndex] = 0;
      this.board[newIndex] = 1;
      this.virtualBoard[previousIndex]={index:previousIndex,src:"",isOccupied:false}
      this.virtualBoard[newIndex]={index:newIndex,src:"/assets/soldier.svg",isOccupied:true}
      this.trailColor = "rgba(0, 0, 255, 0.3)";
      this.movementService.setRemainingMoves(this.movementService.getCurrentRemainingMoves()-(trailData.totalCost));
      return;
    }
    this.trailColor = "rgba(230, 62, 50,0.5)";
  }

  enterPredicate = (drag: CdkDrag, drop: CdkDropList) =>
    this.board[drop.data] === 0;
} 