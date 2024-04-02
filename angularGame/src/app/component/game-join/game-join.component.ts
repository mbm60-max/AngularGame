import { Component } from '@angular/core';
import { SupabaseService } from '../../service/supabase.service';
import { AuthProps, LoginService } from '../../service/loginservice.service';
import { Router } from '@angular/router';
import { CreateGameService } from '../../service/create-game.service';
import { MatCardModule } from '@angular/material/card';
import { NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-game-join',
  standalone: true,
  imports: [MatCardModule,NgIf],
  templateUrl: './game-join.component.html',
  styleUrl: './game-join.component.scss'
})
export class GameJoinComponent {
  authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn: false,
  };
  gameCode: string = '';
  gameStatus:{ game_Ref: string, game_code: string, id: number, is_Full: boolean, player1_id?: string, player2_id?: string } | null=null ;

  constructor(private supabaseService:SupabaseService,private router:Router,private loginService:LoginService,private gameCreateService:CreateGameService) {
    // Subscribe to authentication events
    this.authStatus = this.loginService.getStatus();
    this.gameCode=gameCreateService.getCode();
    this.setLobbyStatus();
    this.subscribeToGameSessionUpdates();
  }
 handleJoinGame(){
  if (this.authStatus.id && this.gameCode !== "") { // Check if authStatus is not empty
    this.supabaseService.setGameSessionFull(this.gameCode,this.authStatus.id);
  } else {
    console.error('Error joining lobby.');
  }
}
async setLobbyStatus() {
  this.gameStatus = await this.supabaseService.getLobbyStatus(this.gameCode);
}
handleStartGame(){
  this.router.navigate(['/game']);
}
ngOnDestroy() {
  // Unsubscribe from game session updates when the component is destroyed
  this.supabaseService.unsubscribeFromGameSessionUpdates();
}

private subscribeToGameSessionUpdates() {
  this.gameCreateService.handleSessionUpdates(this.supabaseService.subscribeToGameSessionUpdates(this.gameCode,(payload) => {
    const result = this.gameCreateService.handleSessionUpdates(payload);
    if (result !== null && result.id !== -1 ) {
      this.gameStatus = result;
    }else if(result !== null){
      this.handleStartGame();
    }
}))   
}
}
