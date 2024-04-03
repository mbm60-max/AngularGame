import { Component } from '@angular/core';
import { GameManagerService } from '../../service/game-manager.service';

@Component({
  selector: 'app-current-player',
  standalone: true,
  imports: [],
  templateUrl: './current-player.component.html',
  styleUrl: './current-player.component.scss'
})
export class CurrentPlayerComponent {
  currentPlayer:string;
  house:string;
constructor(private gameManagerService:GameManagerService){
this.currentPlayer=this.gameManagerService.getCurrentPlayer().currentPlayer;
this.house=this.gameManagerService.getCurrentPlayer().house;

}
}
