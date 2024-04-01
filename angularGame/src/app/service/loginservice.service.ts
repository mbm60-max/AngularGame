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
  private authSubject = new Subject<AuthProps>();
  auth$ = this.authSubject.asObservable();

  setAuth(value: AuthProps) {
    this.authSubject.next(value);
  }
  constructor() { }
}
