import { Component } from '@angular/core';
import { GameManagerService } from '../../service/game-manager.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-current-player',
  standalone: true,
  imports: [NgIf],
  templateUrl: './current-player.component.html',
  styleUrl: './current-player.component.scss'
})
export class CurrentPlayerComponent {
  currentPlayer:string;
  house:string;
  notHouse:string;
constructor(private gameManagerService:GameManagerService){
this.currentPlayer=this.gameManagerService.getCurrentPlayer().currentPlayer;
this.house=this.gameManagerService.getCurrentPlayer().house;
if(this.house=="House Harkonen"){
  this.notHouse = "Fremen";
}else{
  this.notHouse = "House Harkonen";
}
}
}
