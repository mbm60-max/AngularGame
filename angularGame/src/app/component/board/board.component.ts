import { Component } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
interface Cell {
  index: number;
  src: string;
  isOccupied:boolean;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports:[NgFor,NgIf,DragDropModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  board: number[] = Array(720).fill(0);
  virtualBoard: Cell[] = Array.from({ length: 720 }, (_, index) => ({
    index: index,
    src: '',
    isOccupied: false
  }));
  
  constructor() {
    this.board[0] = 1;
    this.board[2] = 1;
    this.virtualBoard[0]={index:0,src:"/assets/soldier.svg",isOccupied:true}
    this.virtualBoard[2]={index:2,src:"/assets/soldier.svg",isOccupied:true}
  }
  currentPath(index: number): string {
    // Example logic to generate the path based on the index
    return this.virtualBoard[index].src;
  }
  drop(event: CdkDragDrop<number>) {
    const previousIndex =event.previousContainer.data;
    const newIndex =event.container.data;
    this.board[previousIndex] = 0;
    this.board[newIndex] = 1;
    this.virtualBoard[previousIndex]={index:previousIndex,src:"",isOccupied:false}
    this.virtualBoard[newIndex]={index:newIndex,src:"/assets/soldier.svg",isOccupied:true}
  }

  enterPredicate = (drag: CdkDrag, drop: CdkDropList) =>
    this.board[drop.data] === 0;
} 