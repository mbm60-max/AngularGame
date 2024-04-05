import { Component } from '@angular/core';
import { GameManagerService } from '../../service/game-manager.service';

@Component({
  selector: 'app-end-turn',
  standalone: true,
  imports: [],
  templateUrl: './end-turn.component.html',
  styleUrl: './end-turn.component.scss'
})
export class EndTurnComponent {
constructor(private gameManagerService:GameManagerService){

}
endTurn(){
  this.gameManagerService.endTurn();
}
}
