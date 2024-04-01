import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateGameService {

  constructor() { }
  createGame(){
//calls funciton from supabase service, creates board and game state in supabase
  }
  registerPlayer(email:string,id:string){
//calls funciton from supabase service, generates link and code to be used to join, 
  }
}
