import { Injectable } from '@angular/core';
import {PostgrestResponse, PostgrestSingleResponse, SupabaseClient,createClient} from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase:SupabaseClient;

  constructor() { 
    this.supabase =  createClient(environment.supabase.url,environment.supabase.key)
  }
  signUp(email:string,password:string){
    return this.supabase.auth.signUp({email,password});
  }
  signIn(email:string,password:string){
    return this.supabase.auth.signInWithPassword({email,password});
  }
  signOut(){
    return this.supabase.auth.signOut();
  }
  async registerPlayer(uid: string): Promise<PostgrestResponse<any> | null> {
    try {
      // Add a new row to the game_sessions table with the provided uid as player1_id
      const { data, error } = await this.supabase.from('game_session').insert([
        {
          player1_id: uid,
          player2_id: '', // Player 2 ID is initially null
          is_Full: false, // is_full is initially false
          game_code: uid.substring(0, 6), // Implement this function to generate game codes
          link: "https://localhost.com", // Implement this function to generate game links
          game_Ref: uid // Reference to player's user ID
        }
      ]);
      if (error) {
        console.error('Error registering player:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.error('Error registering player:', error.message);
      return null;
    }
  }
  async removeGameSession(uid: string): Promise<PostgrestResponse<any> | null> {
    try {
      const { data, error } = await this.supabase.from('game_session').delete().eq('game_Ref', uid);
      if (error) {
        console.error('Error removing game session:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.error('Error removing game session:', error.message);
      return null;
    }
  }
  async setGameSessionFull(gameCode: string, player2Id: string): Promise<PostgrestResponse<any> | null> {
    try {
      const { data, error } = await this.supabase.from('game_session')
        .update({ player2_id: player2Id, is_Full: true })
        .eq('game_code', gameCode);
      if (error) {
        console.error('Error setting game session full:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.error('Error setting game session full:', error.message);
      return null;
    }
  }
  async getLobbyStatus(gameCode: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase.from('game_session')
        .select('*')
        .eq('game_code', gameCode)
        .single();
      if (error) {
        console.error('Error retrieving game session:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.error('Error retrieving game session:', error.message);
      return null;
    }
  }
  handleInserts = (payload:any) => {
    console.log('Change received!', payload)
  }
  subscribeToGameSessionUpdates(uid:string,callback: (payload: any) => typeof payload){
    const gameCode = uid.substring(0,6)
    this.supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'game_session',filter:`game_code=eq.${gameCode}`},//filter:'game_code=eq.7f6853'//filter:`game_code=${'eq.7f6853'}`
        (payload) => {
          callback(payload);
        }
      )
      .subscribe()
}
  async unsubscribeFromGameSessionUpdates():Promise<void>{
    //
    this.supabase.removeAllChannels();
  }


  // Method to create a new active game

}
