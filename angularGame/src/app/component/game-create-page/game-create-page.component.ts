import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProps, LoginService } from '../../service/loginservice.service';
import { SupabaseService } from '../../service/supabase.service';
import {MatCardModule} from '@angular/material/card';
import { Subscription } from 'rxjs';
import { CreateGameService } from '../../service/create-game.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-game-create-page',
  standalone: true,
  imports: [MatCardModule,NgIf],
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
  gameStatus:{ game_Ref: string, game_code: string, id: number, is_Full: boolean, player1_id?: string, player2_id?: string } | null=null ;

  constructor(private supabaseService:SupabaseService,private router:Router,private loginService:LoginService,private gameCreateService:CreateGameService) {
    // Subscribe to authentication events
    this.authStatus = this.loginService.getStatus();
    this.subscribeToGameSessionUpdates();
  }
 handleJoinGame(){
  if (this.authStatus.id) { // Check if authStatus is not empty
    this.supabaseService.registerPlayer(this.authStatus.id);
  } else {
    console.error('Auth status is empty.');
  }
}
ngOnDestroy() {
  // Unsubscribe from game session updates when the component is destroyed
  this.supabaseService.unsubscribeFromGameSessionUpdates();
}


handleStartGame(){
  this.supabaseService.removeGameSession(this.authStatus.id);
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