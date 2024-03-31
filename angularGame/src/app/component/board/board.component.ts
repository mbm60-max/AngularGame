import { Component } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
interface Cell {
  number: number;
  src: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports:[NgFor,NgIf,DragDropModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  board: Cell[] = Array(720).fill({ number: 0, src: '' });

  constructor() {
    this.board[0] = { number: 1, src: '/assets/soldier.svg' };
    this.board[2] = { number: 1, src: '/assets/soldier.svg' };
  }

  drop(event: CdkDragDrop<number>) {
    const previousCell = this.board[event.previousIndex];
    const currentCell = this.board[event.currentIndex];

    // Update the number and src of the previous and current cells
    previousCell.number = 0;
    currentCell.number = 1;
    console.log(previousCell.src)
    console.log(currentCell.src)
    currentCell.src = previousCell.src;
    previousCell.src = '';
  }

  enterPredicate = (drag: CdkDrag, drop: CdkDropList) =>
    this.board[drop.data].number === 0;
}