import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProps, LoginService } from '../../service/loginservice.service';
import { SupabaseService, TurnEnum } from '../../service/supabase.service';
import {MatCardModule} from '@angular/material/card';
import { Subscription } from 'rxjs';
import { CreateGameService } from '../../service/create-game.service';
import { NgIf } from '@angular/common';
import { GameManagerService } from '../../service/game-manager.service';
import { MapGeneratorService } from '../../service/map-generator.service';
import { SpiceManagerService } from '../../service/spice-manager.service';
import { HousePickerComponent } from '../house-picker/house-picker.component';
import { HousePickerService } from '../../service/house-picker.service';
import { EventCardService } from '../../service/event-card.service';
@Component({
  selector: 'app-game-create-page',
  standalone: true,
  imports: [MatCardModule,NgIf,HousePickerComponent],
  templateUrl: './game-create-page.component.html',
  styleUrl: './game-create-page.component.scss'
})
export class GameCreatePageComponent implements OnDestroy{
  authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn: false,
  };
  selectedHouse: string="";
  gameStatus:{ game_Ref: string, game_code: string, id: number, is_Full: boolean, player1_id?: string, player2_id?: string } | null=null ;

  constructor(private supabaseService:SupabaseService,private router:Router,private loginService:LoginService,private gameCreateService:CreateGameService,private gameManagerService:GameManagerService,private mapGeneratorService: MapGeneratorService,private spiceService:SpiceManagerService,private housePickerService: HousePickerService,private eventCardService:EventCardService) {
    // Subscribe to authentication events
    this.authStatus = this.loginService.getStatus();
    this.subscribeToGameSessionUpdates();
  }
  
 handleJoinGame(){
  if (this.authStatus.id) { // Check if authStatus is not empty
    this.supabaseService.registerPlayer(this.authStatus.id,this.housePickerService.getSelectedHouses().playerOneHouse);
  } else {
    console.error('Auth status is empty.');
  }
}
ngOnDestroy() {
  // Unsubscribe from game session updates when the component is destroyed
  //this.supabaseService.unsubscribeFromGameSessionUpdates();
}


handleStartGame(){
  const mountainGrid = this.mapGeneratorService.getMountainPositions(5);
  const spiceCells = this.spiceService.getSpiceCellsIndices();
  this.supabaseService.removeGameSession(this.authStatus.id);
  const houses = this.housePickerService.getSelectedHouses();
  this.gameManagerService.setCurrentPlayer("PlayerOne",this.authStatus.id,houses.playerOneHouse);
  this.gameManagerService.setGameCode(this.authStatus.id.substring(0,6));
  setTimeout(() => {
    this.supabaseService.registerGame(this.authStatus.id, {
      MountainPositions: mountainGrid.positions,
      OccupiedCells: mountainGrid.occupiedCells,
    }, {
      PlayerOneObject: {
        NumberOfTroops: 5,
        TroopIndices: [333,334,335,336,337],
        NumberOfCredits: 100,
        WaterPumpIndices: [101,501],
        TotalWater: 100,
        House: houses.playerOneHouse,
      },
      PlayerTwoObject: {
        NumberOfTroops: 3,
        TroopIndices: [338,339,340],
        NumberOfCredits: 100,
        WaterPumpIndices: [100,500],
        TotalWater: 100,
        House: houses.playerTwoHouse,
      },
    }, {
      SpiceFieldIndices: spiceCells,
      PlayerOneHarvesterIndices: [115],
      PlayerTwoHarvesterIndices: [600],
      PlayerOneNumberOfHarvesters: 1,
      PlayerTwoNumberOfHarvesters: 1,
      PlayerOneSpice:10,
      PlayerTwoSpice:10,
    }, {
      CurrentPlayerTurn: TurnEnum.PlayerOne,
      EventCards:this.eventCardService.shufflePack(),
      Player1Win: false,
      Player2Win: false,
    });
  }, 1000); // Adjust the delay time as needed
  this.router.navigate(['/game']);
}
private subscribeToGameSessionUpdates() {
  this.gameCreateService.handleSessionUpdates(this.supabaseService.subscribeToGameSessionUpdates(this.authStatus.id,(payload) => {
    const result = this.gameCreateService.handleSessionUpdates(payload);
    if (result !== null) {
      this.gameStatus = result;
    }
}))   
}
}
