import { Injectable } from '@angular/core';
import { MountainObject, PlayersObject, SpiceObject, SupabaseService, TurnEnum, TurnObject } from './supabase.service';
import { CreateGameService } from './create-game.service';

interface PlayerType {
  currentPlayer: string;
  currentPlayerId: string;
  house: string; // Corrected type to string
}
interface GameStatus{
  MountainObject: MountainObject,
  PlayersObject: PlayersObject,
  SpiceObject: SpiceObject,
  TurnObject: TurnObject,
  gameRef: string,
  game_code:string,
}

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {
  gameCode:string="";
  playerStatus: PlayerType = { currentPlayer: "", currentPlayerId: "", house: "" };
  gameStatus:GameStatus={
    MountainObject:{ 
      MountainPositions:[] ,
      OccupiedCells: [],
  },
  PlayersObject:{
      PlayerOneObject: {
        NumberOfTroops: 0,
        TroopIndices: [],
        NumberOfCredits: 0,
        WaterPumpIndices: [],
        TotalWater: 0,
        House:"",
      },
      PlayerTwoObject: {
        NumberOfTroops: 0,
        TroopIndices: [],
        NumberOfCredits: 0,
        WaterPumpIndices: [],
        TotalWater: 0,
        House:"",
        },
    },
  SpiceObject:{
    SpiceFieldIndices: [],
    PlayerOneHarvesterIndices: [],
    PlayerTwoHarvesterIndices: [],
    PlayerOneNumberOfHarvesters: 0,
    PlayerTwoNumberOfHarvesters: 0},
  TurnObject:{
    CurrentPlayerTurn: TurnEnum.PlayerOne,
    Player1Win: false,
    Player2Win: false},
  gameRef:"",
  game_code:"",
  }
  constructor(private supabaseService:SupabaseService,private gameCreateService:CreateGameService) { 

  }
  getGameCode(){
    return this.gameCode;
  }
  setGameCode(gameCode:string){
    this.gameCode=gameCode
  }
  getMapData(){
    return this.gameStatus.MountainObject;
  }
  getTurnData(){
    return this.gameStatus.TurnObject;
  }
  getSpiceData(){
    return this.gameStatus.SpiceObject;
  }
  getPlayerOneData(){
    return this.gameStatus.PlayersObject.PlayerOneObject;
  }
  getPlayerTwoData(){
    return this.gameStatus.PlayersObject.PlayerTwoObject;
  }
  setCurrentPlayer(playerType: string, uid: string, house: string) {
    const currentPlayer = {
      currentPlayer: playerType,
      currentPlayerId: uid,
      house: house
    };
    this.playerStatus = currentPlayer;
  }
  getCurrentPlayer(){
    return this.playerStatus;
  }
  subscribeToGameUpdates(gameCode:string) {
    console.log("subscribed");
    console.log("gamecode",gameCode);
    this.supabaseService.subscribeToGameUpdates(gameCode,(payload) => {
      console.log(payload)
      if(payload){
        console.log(payload);
        this.gameStatus = {
          MountainObject: {
            MountainPositions: payload.MountainObject.MountainPositions,
            OccupiedCells: payload.MountainObject.OccupiedCells,
          },
          PlayersObject: {
            PlayerOneObject: payload.PlayersObject.PlayerOneObject,
            PlayerTwoObject: payload.PlayersObject.PlayerTwoObject,
          },
          SpiceObject: {
            SpiceFieldIndices: payload.SpiceObject.SpiceFieldIndices,
            PlayerOneHarvesterIndices: payload.SpiceObject.PlayerOneHarvesterIndices,
            PlayerTwoHarvesterIndices: payload.SpiceObject.PlayerTwoHarvesterIndices,
            PlayerOneNumberOfHarvesters: payload.SpiceObject.PlayerOneNumberOfHarvesters,
            PlayerTwoNumberOfHarvesters: payload.SpiceObject.PlayerTwoNumberOfHarvesters,
          },
          TurnObject: {
            CurrentPlayerTurn: payload.TurnObject.CurrentPlayerTurn,
            Player1Win: payload.TurnObject.Player1Win,
            Player2Win: payload.TurnObject.Player2Win,
          },
          gameRef: payload.game_Ref,
          game_code: payload.game_code,
        };
      }
  })  
  }
  unsubscribeFromGameUpdates(){
    this.supabaseService.unsubscribeFromGameUpdates();
  }
}

