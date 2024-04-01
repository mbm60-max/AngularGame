import { Component } from '@angular/core';
import { CreateGameService } from '../../service/create-game.service';
import { Router } from '@angular/router';
import { LoginService } from '../../service/loginservice.service';

@Component({
  selector: 'app-game-create-page',
  standalone: true,
  imports: [],
  templateUrl: './game-create-page.component.html',
  styleUrl: './game-create-page.component.scss'
})
export class GameCreatePageComponent {
  authStatus:AuthProps={
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn:false,
  };
 constructor(private createGameService:CreateGameService,private router:Router,private loginService:LoginService){
  this.loginService.auth$.subscribe(value => {
    this.authStatus = value;
  });
 }
 handleCreateGame(){
  //calls createGame service with email and id 
  this.createGameService.registerPlayer(this.authStatus.email,this.authStatus.id);
  this.createGameService.createGame(auth)
}


handleStartGame(){
  this.router.navigate(['/game']);
}
}
