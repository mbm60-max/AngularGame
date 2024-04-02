import { Component, OnInit } from '@angular/core';
import { AuthProps, LoginService } from '../../service/loginservice.service';
import { CreateGameService } from '../../service/create-game.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn: false,
  };

  constructor(private loginService: LoginService, private router: Router,private supabaseService:SupabaseService) {
  }
  ngOnInit() {
    this.authStatus = this.loginService.getStatus();
  }
  handleCreateGame(){
    this.router.navigate(['/gameCreate']);
  }
  handleJoinGame(){
    this.router.navigate(['/gameCode']);
  }
}
