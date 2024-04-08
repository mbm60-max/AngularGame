import { Component, OnInit } from '@angular/core';
import { GameManagerService } from '../../service/game-manager.service';
import { Subscription } from 'rxjs';
import { MovementService } from '../../service/movement-service.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthProps, LoginService } from '../../service/loginservice.service';

@Component({
  selector: 'app-end-turn',
  standalone: true,
  imports: [NgIf],
  templateUrl: './end-turn.component.html',
  styleUrl: './end-turn.component.scss'
})

export class EndTurnComponent implements OnInit{
private toggleSubscription!: Subscription;
private endSubscription!: Subscription;
endTurnDisabled:boolean=true;
winStatus:string="";
currentPlayer:string="";
canLeave:boolean=false;
canEndGame:boolean=false;
authStatus: AuthProps = {
  email: '',
  name: '',
  id: '',
  inGame: false,
  isLoggedIn: false,
};
constructor(private gameManagerService:GameManagerService,private movementService:MovementService,private router:Router,private loginService:LoginService){
  this.authStatus = this.loginService.getStatus();
}
ngOnInit(): void {
  this.toggleSubscription = this.gameManagerService.getGameStatusUpdates()
    .subscribe(value => {
      console.log("game status update",value)
      this.endTurnDisabled = !value;
      // Do something with the updated value
    });
    this.endSubscription= this.gameManagerService.alertGameEnd().subscribe((winStatus:string)=>{
      this.winStatus = winStatus;
      this.currentPlayer = this.gameManagerService.getCurrentPlayer().currentPlayer;
      if(this.currentPlayer == "PlayerOne" && this.winStatus != ""){
        this.canEndGame = true;
      }
      if(this.currentPlayer == "PlayerTwo" && this.winStatus != ""){
        this.canLeave = true;
      }
    })
}
ngOnDestroy(): void {
  this.toggleSubscription.unsubscribe();
  this.endSubscription.unsubscribe();
}
endGame(){
  this.gameManagerService.endGame(this.authStatus.id);
  this.router.navigate(['/home']);
}
leaveGame(){
  console.log("leave game called");
  this.router.navigate(['/home']);
}
endTurn(){
  this.gameManagerService.endTurn();
  this.movementService.setRemainingMoves(0);
  this.gameManagerService.setTurnStatus({
    hasMoved: false,
    hasPlaced: false,
    hasTakenCard: false,
    combatFinished: false,
    hasRolled: false,
  });
}
}
