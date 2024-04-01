import { Component, Input, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { MapGeneratorService, MountainPosition } from '../../service/map-generator.service';
import { MovementTrailService } from '../../service/movement-trail.service';
import { DiceComponent } from '../dice/dice.component';
export interface Cell {
  index: number;
  src: string;
  isOccupied:boolean;
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
  remainingMoves:number=6;
  virtualBoard: Cell[] = Array.from({ length: 720 }, (_, index) => ({
    index: index,
    src: '',
    isOccupied: false
  }));
  
  handleDiceRoll(value: number) {
    this.lastRoll= value;
    // Do whatever you want with the rolled dice value here
    console.log('Dice rolled:', value);
  }
  constructor(private mapGeneratorService: MapGeneratorService,private movementTrailService:MovementTrailService) {
    this.board[0] = 1;
    this.board[2] = 1;
    this.virtualBoard[0]={index:0,src:"/assets/soldier.svg",isOccupied:true}
    this.virtualBoard[2]={index:2,src:"/assets/soldier.svg",isOccupied:true}
  }
  ngOnInit(): void {
    let result = this.mapGeneratorService.getMountainPositions(5);
    this.mountainPositions = result.positions;
    let occupiedCells = result.occupiedCells;

    for (let i = 0; i < this.virtualBoard.length; i++) {
      if (occupiedCells[i]) {
        this.virtualBoard[i].isOccupied = true;
      }
    }
  }
  currentPath(index: number): string {
    return this.virtualBoard[index].src;
  }
  drop(event: CdkDragDrop<number>) {
    const previousIndex =event.previousContainer.data;
    const newIndex =event.container.data;
    let trailData = this.movementTrailService.getTrail(previousIndex, newIndex, this.virtualBoard);
    this.trail = trailData.trail;
    if(trailData.totalCost<=this.remainingMoves){
      this.board[previousIndex] = 0;
      this.board[newIndex] = 1;
      this.virtualBoard[previousIndex]={index:previousIndex,src:"",isOccupied:false}
      this.virtualBoard[newIndex]={index:newIndex,src:"/assets/soldier.svg",isOccupied:true}
      this.trailColor = "rgba(0, 0, 255, 0.3)";
      return;
    }
    this.trailColor = "rgba(230, 62, 50,0.5)";
  }

  enterPredicate = (drag: CdkDrag, drop: CdkDropList) =>
    this.board[drop.data] === 0;
} 