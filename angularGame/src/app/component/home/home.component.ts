import { Component } from '@angular/core';
import { AuthProps, LoginService } from '../../service/loginservice.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  authStatus:AuthProps={
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn:false,
  };

  constructor(private loginService:LoginService) {
    this.loginService.auth$.subscribe(value => {
      this.authStatus = value;
    });
  }
}
