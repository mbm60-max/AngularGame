import { Injectable } from '@angular/core';
import { MountainObject, PlayerObject, PlayersObject, SpiceObject, SupabaseService, TurnEnum, TurnObject } from './supabase.service';
import { CreateGameService } from './create-game.service';
import { Subject } from 'rxjs';
import { SpiceManagerService, SpiceState } from './spice-manager.service';
import { EventCardService } from './event-card.service';
import { UnitCreditsService } from './unit-credits.service';
import { WaterService, WaterState } from './water.service';
import { MountainPosition } from './map-generator.service';

export interface PlayerType {
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
interface TurnStatus{
  hasMoved:boolean,
  hasPlaced:boolean,
  hasTakenCard:boolean,
  combatFinished:boolean,
  hasRolled:boolean,
}

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {
  private turnStatus:TurnStatus={
    hasMoved:false,
    hasPlaced:false,
    hasTakenCard:false,
    combatFinished:false,
    hasRolled:false,
  }
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
        TotalWater:  0,
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
    PlayerTwoNumberOfHarvesters: 0,
    PlayerOneSpice:0,
    PlayerTwoSpice:0,
  },
  TurnObject:{
    CurrentPlayerTurn: TurnEnum.PlayerOne,
    EventCards:[],
    Player1Win: false,
    Player2Win: false
  },
  gameRef:"",
  game_code:"",
  }
  MountainPositionsUpdate:MountainPosition[]=[];
  OccupiedCellsUpdate:boolean[]=[];

  p1NumberOfTroopsUpdate:number=0;
  p1TroopIndicesUpdate:number[]=[];
  p1NumberOfCreditsUpdate:number=0;
  p1WaterPumpIndicesUpdate:number[]=[];
  p1TotalWaterUpdate:number=0;
  p1HouseUpdate:string="";

  p2NumberOfTroopsUpdate:number=0;
  p2TroopIndicesUpdate:number[]=[];
  p2NumberOfCreditsUpdate:number=0;
  p2WaterPumpIndicesUpdate:number[]=[];
  p2TotalWaterUpdate:number=0;
  p2HouseUpdate:string="";

  SpiceFieldIndicesUpdate:number[] =[];
  PlayerOneHarvesterIndicesUpdate:number[] =[];
  PlayerTwoHarvesterIndicesUpdate:number[] =[];
  PlayerOneNumberOfHarvestersUpdate:number =0;
  PlayerTwoNumberOfHarvestersUpdate:number =0;
  PlayerOneSpiceUpdate:number =0;
  PlayerTwoSpiceUpdate:number =0;
  
  CurrentPlayerTurnUpdate: TurnEnum=TurnEnum.PlayerOne;
  EventCardsUpdate:string[]=[];
  Player1WinUpdate:boolean = false;
  Player2WinUpdate:boolean = false;
  
  private gameStatusUpdated = new Subject<boolean>();
  private waterStatus= new Subject<WaterState>();
  private creditStatus = new Subject<number>();
  private spiceStatus = new Subject<SpiceState>();
  private eventCardStatus= new Subject<string[]>();
  private houseStatus = new Subject<string>();
  private endTurnStatus = new Subject<boolean>();
  private toggleValue = false;
  constructor(private supabaseService:SupabaseService,private gameCreateService:CreateGameService) { 

  }
  
  setTurnStatus(turnStatus: TurnStatus) {
    this.turnStatus = { ...this.turnStatus, ...turnStatus };
  }
  getTurnStatus(){
    return this.turnStatus;
  }
  toggleBoolean() {
    this.toggleValue = !this.toggleValue;
    this.gameStatusUpdated.next(this.toggleValue);
  }
  updateEmitterStatus(remainingSpice:number,numberOfHarvesters:number,spiceGenerated:number,remainingWater:number,numberOfPumps:number,waterGenerated:number,waterUsed:number,opponentWater:number,credits:number,cardList:string[],house:string){
    const spiceStatus:SpiceState={
      remainingSpice: remainingSpice,
      numberOfHarvesters: numberOfHarvesters,
      spiceGenerated: spiceGenerated,
    }
    const waterStatus:WaterState={
      remainingWater: remainingWater,
      numberOfPumps: numberOfPumps,
      waterGenerated: waterGenerated,
      waterUsed: waterUsed,
      opponentWater: opponentWater,
    }
    this.waterStatus.next(waterStatus);
    this.eventCardStatus.next(cardList);
    this.creditStatus.next(credits);
    this.spiceStatus.next(spiceStatus);
    this.houseStatus.next(house);
  }
  getToggleValue() {
    return this.toggleValue;
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
    this.supabaseService.subscribeToGameUpdates(gameCode,(payload) => {
      console.log(payload)
      if(payload){
        if(payload.eventType === 'UPDATE' || payload.eventType === "INSERT"){
          const eventCards = payload.new.TurnObject.EventCards;
          this.gameStatus = {
            MountainObject: {
              MountainPositions: payload.new.MountainObject.MountainPositions,
              OccupiedCells: payload.new.MountainObject.OccupiedCells,
            },
            PlayersObject: {
              PlayerOneObject: payload.new.PlayerObject.PlayerOneObject,
              PlayerTwoObject: payload.new.PlayerObject.PlayerTwoObject,
            },
            SpiceObject: {
              SpiceFieldIndices: payload.new.SpiceObject.SpiceFieldIndices,
              PlayerOneHarvesterIndices: payload.new.SpiceObject.PlayerOneHarvesterIndices,
              PlayerTwoHarvesterIndices: payload.new.SpiceObject.PlayerTwoHarvesterIndices,
              PlayerOneNumberOfHarvesters: payload.new.SpiceObject.PlayerOneNumberOfHarvesters,
              PlayerTwoNumberOfHarvesters: payload.new.SpiceObject.PlayerTwoNumberOfHarvesters,
              PlayerOneSpice:payload.new.SpiceObject.PlayerOneSpice,
              PlayerTwoSpice:payload.new.SpiceObject.PlayerTwoSpice,
            },
            TurnObject: {
              CurrentPlayerTurn: payload.new.TurnObject.CurrentPlayerTurn,
              EventCards: eventCards,
              Player1Win: payload.new.TurnObject.Player1Win,
              Player2Win: payload.new.TurnObject.Player2Win,
            },
            gameRef: payload.new.game_Ref,
            game_code: payload.new.game_code,
          };
          this.toggleBoolean();
          const player = this.getCurrentPlayer();
          const p1troops = payload.new.PlayerObject.PlayerOneObject.NumberOfTroops;
          const p2troops = payload.new.PlayerObject.PlayerTwoObject.NumberOfTroops;
          const p1Water = payload.new.PlayerObject.PlayerOneObject.TotalWater;
          const p2Water = payload.new.PlayerObject.PlayerTwoObject.TotalWater;
          if(player.currentPlayer=="PlayerOne"){
            const numberOfPumps =payload.new.PlayerObject.PlayerOneObject.WaterPumpIndices.length;
            const p1Credits = payload.new.PlayerObject.PlayerOneObject.NumberOfCredits;
            if(player.house == "House Harkonen"){
              const waterUsed = p1troops*5;
              this.updateEmitterStatus(payload.new.SpiceObject.PlayerOneSpice,payload.new.SpiceObject.PlayerOneHarvesterIndices.length,payload.new.SpiceObject.PlayerOneHarvesterIndices.length,p1Water,numberOfPumps,numberOfPumps*5,waterUsed,p2Water,p1Credits,eventCards,player.house);
            }else{
              const waterUsed = p1troops*2;
              this.updateEmitterStatus(payload.new.SpiceObject.PlayerOneSpice,payload.new.SpiceObject.PlayerOneHarvesterIndices.length,payload.new.SpiceObject.PlayerOneHarvesterIndices.length,p1Water,numberOfPumps,numberOfPumps*5,waterUsed,p2Water,p1Credits,eventCards,player.house);
            }
          }else{
            const numberOfPumps =payload.new.PlayerObject.PlayerTwoObject.WaterPumpIndices.length;
            const p2Credits = payload.new.PlayerObject.PlayerTwoObject.NumberOfCredits;
            if(player.house == "House Harkonen"){
              const waterUsed = p2troops*5;
              this.updateEmitterStatus(payload.new.SpiceObject.PlayerTwoSpice,payload.new.SpiceObject.PlayerTwoHarvesterIndices.length,payload.new.SpiceObject.PlayerTwoHarvesterIndices.length,p2Water,numberOfPumps,numberOfPumps*5,waterUsed,p1Water,p2Credits,eventCards,player.house);
            }else{
              const waterUsed = p2troops*2;
              this.updateEmitterStatus(payload.new.SpiceObject.PlayerTwoSpice,payload.new.SpiceObject.PlayerTwoHarvesterIndices.length,payload.new.SpiceObject.PlayerTwoHarvesterIndices.length,p2Water,numberOfPumps,numberOfPumps*5,waterUsed,p1Water,p2Credits,eventCards,player.house);
            }
          }
        }
      }else{
        console.error("No Payload")
      }
  })  
  }
  endTurn(){
    this.endTurnStatus.next(true);
    this.setTurnUpdate();
    
    const mountainObject:MountainObject={
      MountainPositions: this.MountainPositionsUpdate,
      OccupiedCells: this.OccupiedCellsUpdate,
    }
    const playersObject:PlayersObject={
      PlayerOneObject: {
        NumberOfTroops: this.p1NumberOfTroopsUpdate,
        TroopIndices: this.p1TroopIndicesUpdate,
        NumberOfCredits: this.p1NumberOfCreditsUpdate,
        WaterPumpIndices: this.p1WaterPumpIndicesUpdate,
        TotalWater: this.p1TotalWaterUpdate,
        House: this.p1HouseUpdate,
      },
      PlayerTwoObject: {
        NumberOfTroops: this.p2NumberOfTroopsUpdate,
        TroopIndices: this.p2TroopIndicesUpdate,
        NumberOfCredits: this.p2NumberOfCreditsUpdate,
        WaterPumpIndices: this.p2WaterPumpIndicesUpdate,
        TotalWater: this.p2TotalWaterUpdate,
        House: this.p2HouseUpdate,
      },
    }
    const spiceObject:SpiceObject={
      SpiceFieldIndices: this.SpiceFieldIndicesUpdate,
      PlayerOneHarvesterIndices: this.PlayerOneHarvesterIndicesUpdate,
      PlayerTwoHarvesterIndices: this.PlayerTwoHarvesterIndicesUpdate,
      PlayerOneNumberOfHarvesters:this.PlayerOneNumberOfHarvestersUpdate,
      PlayerTwoNumberOfHarvesters:this.PlayerTwoNumberOfHarvestersUpdate,
      PlayerOneSpice: this.PlayerOneSpiceUpdate,
      PlayerTwoSpice: this.PlayerTwoSpiceUpdate,
    }
    const turnObject:TurnObject={
      CurrentPlayerTurn: this.CurrentPlayerTurnUpdate,
      EventCards: this.EventCardsUpdate,
      Player1Win: this.Player1WinUpdate,
      Player2Win: this.Player2WinUpdate,
    }
    console.log("updated game status")
    this.supabaseService.updateGameStatus(this.gameCode,mountainObject,playersObject,spiceObject,turnObject);
  }
  setBoardUpdate(MountainPositionsUpdate:MountainPosition[],OccupiedCellsUpdate:boolean[],p1NumberOfTroopsUpdate:number,p1TroopIndicesUpdate:number[],
                 p1WaterPumpIndicesUpdate:number[],p1HouseUpdate:string,p2NumberOfTroopsUpdate:number,p2TroopIndicesUpdate:number[],p2WaterPumpIndicesUpdate:number[],p2HouseUpdate:string,
                 SpiceFieldIndicesUpdate:number[],PlayerOneHarvesterIndicesUpdate:number[],PlayerTwoHarvesterIndicesUpdate:number[],PlayerOneNumberOfHarvestersUpdate:number,PlayerTwoNumberOfHarvestersUpdate:number){
                  this.MountainPositionsUpdate=MountainPositionsUpdate;
                  this.OccupiedCellsUpdate=OccupiedCellsUpdate;

                  this.p1NumberOfTroopsUpdate=p1NumberOfTroopsUpdate;
                  this.p1TroopIndicesUpdate=p1TroopIndicesUpdate;
                  this.p1WaterPumpIndicesUpdate=p1WaterPumpIndicesUpdate;
                  this.p1HouseUpdate=p1HouseUpdate;

                  this.p2NumberOfTroopsUpdate=p2NumberOfTroopsUpdate;
                  this.p2TroopIndicesUpdate=p2TroopIndicesUpdate;
                  this.p2WaterPumpIndicesUpdate=p2WaterPumpIndicesUpdate;
                  this.p2HouseUpdate=p2HouseUpdate;

                  this.SpiceFieldIndicesUpdate=SpiceFieldIndicesUpdate;
                  this.PlayerOneHarvesterIndicesUpdate=PlayerOneHarvesterIndicesUpdate;
                  this.PlayerTwoHarvesterIndicesUpdate=PlayerTwoHarvesterIndicesUpdate;
                  this.PlayerOneNumberOfHarvestersUpdate=PlayerOneNumberOfHarvestersUpdate;
                  this.PlayerTwoNumberOfHarvestersUpdate=PlayerTwoNumberOfHarvestersUpdate;
  }
  setCreditUpdate(p1NumberOfCreditsUpdate:number,p2NumberOfCreditsUpdate:number){
    this.p1NumberOfCreditsUpdate=p1NumberOfCreditsUpdate;
    this.p2NumberOfCreditsUpdate=p2NumberOfCreditsUpdate;
  }
  setWaterUpdate(p1TotalWaterUpdate:number,p2TotalWaterUpdate:number){
    this.p1TotalWaterUpdate = p1TotalWaterUpdate;
    this.p2TotalWaterUpdate = p2TotalWaterUpdate;
  }
  setSpiceUpdate(PlayerOneSpiceUpdate:number,PlayerTwoSpiceUpdate:number){
    this.PlayerOneSpiceUpdate=PlayerOneSpiceUpdate;
    this.PlayerTwoSpiceUpdate=PlayerTwoSpiceUpdate;
  }
  //to be added once event cards are fixed
  setTurnUpdate(){
    this.CurrentPlayerTurnUpdate=this.gameStatus.TurnObject.CurrentPlayerTurn = TurnEnum.PlayerOne?TurnEnum.PlayerTwo:TurnEnum.PlayerOne;
    this.EventCardsUpdate=[];
    this.Player1WinUpdate=false;
    this.Player2WinUpdate=false;
  }
  unsubscribeFromGameUpdates(){
    this.supabaseService.unsubscribeFromGameUpdates();
  }
  getGameStatusUpdates() {
    return this.gameStatusUpdated.asObservable();
  }
  getWaterStatusUpdates() {
    return this.waterStatus.asObservable();
  }
  getCreditStatusUpdates() {
    return this.creditStatus.asObservable();
  }
  getSpiceStatusUpdates() {
    return this.spiceStatus.asObservable();
  }
  getEventCardStatusUpdates() {
    return this.eventCardStatus.asObservable();
  }
  getHouseStatusUpdates() {
    return this.houseStatus.asObservable();
  }
  alertTurnEnd() {
    return this.endTurnStatus.asObservable();
  }
}

