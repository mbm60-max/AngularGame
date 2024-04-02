import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AuthProps{
  email:string;
  name:string;
  id:string;
  inGame:boolean;
  isLoggedIn:boolean;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn: false,
  };
  constructor() {}

  setAuth(authObject:AuthProps) {
    this.authStatus = authObject;
  }

  getLoggedIn(): boolean {
    return this.authStatus.isLoggedIn;
  }
  getStatus(): AuthProps{
    return this.authStatus;
  }
}
