import { Component } from '@angular/core';
import { MovementService } from '../../service/movement-service.service';

@Component({
  selector: 'app-move-display',
  standalone: true,
  imports: [],
  templateUrl: './move-display.component.html',
  styleUrl: './move-display.component.scss'
})
export class MoveDisplayComponent {
  remainingMoves: number = 0;

  constructor(private movementService: MovementService) {}

  ngOnInit(): void {
    this.movementService.getRemainingMoves().subscribe(moves => {
      this.remainingMoves = moves;
    });
  }
}
