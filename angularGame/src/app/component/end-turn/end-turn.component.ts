import { Component, OnInit } from '@angular/core';
import { GameManagerService } from '../../service/game-manager.service';
import { Subscription } from 'rxjs';
import { MovementService } from '../../service/movement-service.service';

@Component({
  selector: 'app-end-turn',
  standalone: true,
  imports: [],
  templateUrl: './end-turn.component.html',
  styleUrl: './end-turn.component.scss'
})

export class EndTurnComponent implements OnInit{
private toggleSubscription!: Subscription;
endTurnDisabled:boolean=true;
constructor(private gameManagerService:GameManagerService,private movementService:MovementService){
}
ngOnInit(): void {
  this.toggleSubscription = this.gameManagerService.getGameStatusUpdates()
    .subscribe(value => {
      console.log("game status update",value)
      this.endTurnDisabled = !value;
      // Do something with the updated value
    });
}
ngOnDestroy(): void {
  this.toggleSubscription.unsubscribe();
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
