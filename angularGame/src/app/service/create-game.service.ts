import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProps, LoginService } from './loginservice.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CreateGameService {
  authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    inGame: false,
    isLoggedIn: false,
  };
  private gameCode: string ="";
  constructor() {
  }

  setCode(code:string) {
    this.gameCode = code;
  }

  getCode(): string {
    return this.gameCode;
  }
 
  handleSessionUpdates(payload: any): { game_Ref: string, game_code: string, id: number, is_Full: boolean, player1_id?: string, player2_id?: string } | null{
    console.log(payload)
    if(payload){
      if (payload.eventType === 'UPDATE' || payload.eventType === "INSERT") {
        const { game_Ref, game_code, id, is_Full, player1_id, player2_id } = payload.new;
        return { game_Ref, game_code, id, is_Full, player1_id, player2_id };
    } else if (payload.eventType === 'DELETE') {
      return {
        game_Ref: "",
        game_code: "",
        id: -1,
        is_Full: false,
        player1_id: undefined,
        player2_id: undefined,
      };
  }
    else {
        return null;
    }
    }return null;
}
}