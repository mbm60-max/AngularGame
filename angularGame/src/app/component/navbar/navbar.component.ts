import {Component} from '@angular/core';
  import {MatGridListModule} from '@angular/material/grid-list';
import { Router, RouterLink } from '@angular/router';
import { AuthProps, LoginService } from '../../service/loginservice.service';
import { NgForOf, NgIf } from '@angular/common';
import { SupabaseService } from '../../service/supabase.service';
  
  export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
    link:string;
  }
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatGridListModule,RouterLink,NgForOf,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn: false,
  };

  tiles: Tile[] = [];

  constructor(private loginService: LoginService, private router: Router,private supabase:SupabaseService) {
    this.loginService.auth$.subscribe(value => {
      this.authStatus = value;
      this.updateTiles(); // Update tiles after authStatus is updated
    });
    this.updateTiles(); // Initially update tiles
  }

  updateTiles() {
    this.tiles = [
      { text: 'Home', cols: 2, rows: 1, color: 'lightblue', link: '/home' },
      { text: this.authStatus.isLoggedIn ? 'Logout' : 'Login', cols: 2, rows: 1, color: 'lightgreen', link: '/login' }
    ];
  }

  logout() {
    this.supabase.signOut();
    this.loginService.setAuth({email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn: false})
  }
}