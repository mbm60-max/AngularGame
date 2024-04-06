import { Component, Input, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { MapGeneratorService, MountainPosition } from '../../service/map-generator.service';
import { MovementTrailService } from '../../service/movement-trail.service';
import { DiceComponent } from '../dice/dice.component';
import { MovementService } from '../../service/movement-service.service';
import { TileEnum, TileSpawnService, TileUpdateState } from '../../service/tile-spawn.service';
import { SpiceManagerService } from '../../service/spice-manager.service';
import { GameManagerService } from '../../service/game-manager.service';
import { CombatRunnerService } from '../../service/combat-runner.service';
import { Subscription } from 'rxjs';
import { WaterService, WaterState } from '../../service/water.service';
export interface Cell {
  index: number;
  src: string;
  isOccupied:boolean;
}

enum HouseEnum{
  Harkonen = 'Harkonen',
  Fremen = 'Fremen',
}
@Component({
  selector: 'app-board',
  standalone: true,
  imports:[NgFor,NgIf,DragDropModule,DiceComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit{
  @Input() lastRoll: number | null = null;
  mountainPositions: MountainPosition[]=[];
  trail:number[]=[];
  trailColor:string="rgba(0, 0, 255, 0.1)";
  board: number[] = Array(720).fill(0);
  waterAndSpiceBoard: string[] = Array(720).fill("");
  remainingMoves:number=-1;
  house:string="";
  mountainBoard:boolean[] = Array(720).fill(false);
  virtualBoard: Cell[] = Array.from({ length: 720 }, (_, index) => ({
    index: index,
    src: '',
    isOccupied: false
  }));
  winnerSubscription: Subscription | undefined;
  waterStateSubscription: Subscription | undefined;
  tileUpdateSubscription: Subscription | undefined;
  playerHouse:HouseEnum=HouseEnum.Harkonen;
  harvesterPlaced:boolean=false;
  troopImageSrc:string="";
  enemyTroopImageSrc:string="";
  updatedWaterState!:WaterState;
  constructor(private movementTrailService:MovementTrailService,private movementService:MovementService,private tileSpawnService:TileSpawnService,private gameManagerService:GameManagerService,private combatRunnerService:CombatRunnerService,private waterService:WaterService) {
  this.waterAndSpiceBoard[111]="./assets/spiceHarvester.svg"
  }
  ngOnInit(): void {
    setTimeout(() => {
    this.initialiseBoard();
    this.gameManagerService.getGameStatusUpdates()
      .subscribe(value => {
        console.log("game status update in board",value)
        //maybe only update when value != original stored
        this.initialiseBoard();
        // Do something with the updated value
      });
    this.tileUpdateSubscription = this.tileSpawnService.getTileState().subscribe((tileState: TileUpdateState) => {
      console.log("tile update requested")
      switch(tileState.type){
        case("Spawn Troop"):
        this.handleTroopSpawn([tileState.indexTarget],[],this.house);
        break;
        case("Spice Harvester"):
        this.waterAndSpiceBoard[tileState.indexTarget]=tileState.src;
        break;
        case("Water Pump"):
        this.waterAndSpiceBoard[tileState.indexTarget]=tileState.src;
        break;
        case("Enemy Object"):
        this.waterAndSpiceBoard[tileState.indexTarget]=tileState.src;
        break;
        case("Clear Object"):
        this.waterAndSpiceBoard[tileState.indexTarget]="";
        break;
        case("Clear Troop"):
        this.board[tileState.indexTarget]=0
        this.virtualBoard[tileState.indexTarget] = { index:tileState.indexTarget, src: '', isOccupied: false };
        break;
      }
    this.gameManagerService.alertTurnEnd().subscribe((isEnded:boolean)=>{
        if(isEnded){
        this.remainingMoves=0;
        const boardData = this.getDataFromBoard();
        this.gameManagerService.setBoardUpdate(this.mountainPositions,this.mountainBoard,boardData.p1NumberOfTroops,boardData.playerOneTroops,boardData.playerOnePumps,boardData.p1House,
                                                boardData.p2NumberOfTroops,boardData.playerTwoTroops,boardData.playerTwoPumps,boardData.p2House,
                                                boardData.spice,boardData.playerOneHarvesters,boardData.playerTwoHarvesters,boardData.playerOneNumberOfHarvesters,boardData.playerTwoNumberOfHarvesters);
        }
      })
    });
  }, 1500);
  }
  initialiseBoard(){
    this.board = Array(720).fill(0);
    this.waterAndSpiceBoard = Array(720).fill("");
    this.mountainBoard = Array(720).fill(false);
    this.virtualBoard = Array.from({ length: 720 }, (_, index) => ({
      index: index,
      src: '',
      isOccupied: false
    }));
    const playerData = this.gameManagerService.getCurrentPlayer();
      const playerOneData = this.gameManagerService.getPlayerOneData();
      const playerTwoData = this.gameManagerService.getPlayerTwoData()
      const player = playerData.currentPlayer;
      this.house = playerData.house;
      if(player == "PlayerOne"){
        const troopIndices = playerOneData.TroopIndices;
        const enemyTroopIndices= playerTwoData.TroopIndices;
        this.handleTroopSpawn(troopIndices,enemyTroopIndices,this.house);
      }else{
        const troopIndices = playerTwoData.TroopIndices;
        const enemyTroopIndices= playerOneData.TroopIndices;
        this.handleTroopSpawn(troopIndices,enemyTroopIndices,this.house);
      }
   const mapData = this.gameManagerService.getMapData();
    this.mountainPositions = mapData.MountainPositions;
    let occupiedCells = mapData.OccupiedCells;

    for (let i = 0; i < this.virtualBoard.length; i++) {
      if (occupiedCells[i]) {
        this.mountainBoard[i] = true;
      }
    }
    const spiceData = this.gameManagerService.getSpiceData();
    const spiceCells = spiceData.SpiceFieldIndices;
    for(let i=0; i<spiceCells.length;i++){
      this.waterAndSpiceBoard[spiceCells[i]]="./assets/spiceField.svg";
    }
    const p1Harvesters = spiceData.PlayerOneHarvesterIndices
    const p2Harvesters = spiceData.PlayerTwoHarvesterIndices
    const p1Pumps =  playerOneData.WaterPumpIndices
    const p2Pumps = playerTwoData.WaterPumpIndices
    if(player == "PlayerOne"){
      for(let i=0; i<p1Harvesters.length;i++){
        this.waterAndSpiceBoard[p1Harvesters[i]]="./assets/spiceHarvester.svg";
      }
      for(let i=0; i<p1Pumps.length;i++){
        this.waterAndSpiceBoard[p1Pumps[i]]="./assets/waterPump.svg";
      }
      for(let i=0; i<p2Harvesters.length;i++){
        this.waterAndSpiceBoard[p2Harvesters[i]]="./assets/enemyHarvester.svg";
      }
      for(let i=0; i<p2Pumps.length;i++){
        this.waterAndSpiceBoard[p2Pumps[i]]="./assets/enemyPump.svg";
      }
    }else{
      for(let i=0; i<p2Harvesters.length;i++){
        this.waterAndSpiceBoard[p2Harvesters[i]]="./assets/spiceHarvester.svg";
      }
      for(let i=0; i<p2Pumps.length;i++){
        this.waterAndSpiceBoard[p2Pumps[i]]="./assets/waterPump.svg";
      }
      for(let i=0; i<p1Harvesters.length;i++){
        this.waterAndSpiceBoard[p1Harvesters[i]]="./assets/enemyHarvester.svg";
      }
      for(let i=0; i<p1Pumps.length;i++){
        this.waterAndSpiceBoard[p1Pumps[i]]="./assets/enemyPump.svg";
      }
    }
  }
  getDataFromBoard(){
    const playerData = this.gameManagerService.getCurrentPlayer();
    const board = this.board; 
    const house = playerData.house;
    const waterAndSpiceBoard = this.waterAndSpiceBoard;
    const friendly: number[] = [];
    const enemy: number[] = [];
    const pumps:number[]=[];
    const enemyPumps:number[]=[];
    const harvesters:number[]=[];
    const enemyHarvesters:number[]=[];
    const spice:number[]=[];
    for (let i = 0; i < board.length; i++) {
        const cellValue = board[i];
        if (cellValue === 1) {
            // Troop belonging to the current player
            friendly.push(i);
        } else if (cellValue === 2) {
            // Troop belonging to the opponent
            enemy.push(i);
        }
    }
    for (let i = 0; i < waterAndSpiceBoard.length; i++) {
      const cellValue = waterAndSpiceBoard[i];
      switch(cellValue){
        case("./assets/waterPump.svg"):
          pumps.push(i);
        break;
        case("./assets/enemyPump.svg"):
          enemyPumps.push(i);
        break;
        case("./assets/spiceHarvester.svg"):
          harvesters.push(i);
        break;
        case("./assets/enemyHarvester.svg"):
          enemyHarvesters.push(i);
        break;
        case("./assets/spiceField.svg"):
          spice.push(i);
        break;
      }
  }
    const playerOneTroops = playerData.currentPlayer === "PlayerOne" ? friendly : enemy;
    const playerTwoTroops = playerData.currentPlayer === "PlayerOne" ? enemy : friendly;
    const playerOnePumps = playerData.currentPlayer === "PlayerOne" ? pumps:enemyPumps;
    const playerTwoPumps = playerData.currentPlayer === "PlayerOne" ? enemyPumps:pumps;
    const playerOneHarvesters = playerData.currentPlayer === "PlayerOne" ? harvesters:enemyHarvesters;
    const playerTwoHarvesters = playerData.currentPlayer === "PlayerOne" ? enemyHarvesters:harvesters;
    const p1House = house;
    const p2House = house === "House Harkonen"?"Fremen":"House Harkonen";
    return {
      playerOneTroops,
      playerTwoTroops,
      p1NumberOfTroops: playerOneTroops.length,
      p2NumberOfTroops: playerTwoTroops.length,
      playerOnePumps,
      playerTwoPumps,
      playerOneHarvesters,
      playerTwoHarvesters,
      playerOneNumberOfPumps:playerOnePumps.length,
      playerTwoNumberOfPumps:playerTwoPumps.length,
      playerOneNumberOfHarvesters:playerOneHarvesters.length,
      playerTwoNumberOfHarvesters:playerTwoHarvesters.length,
      p1House,
      p2House,
      spice,
  };
  }

  handleTroopSpawn(troopIndices: number[], enemyTroopIndices: number[], house: string) {
    this.troopImageSrc = house === "House Harkonen" ? "./assets/harkonen.svg" : "./assets/soldier.svg";
    this.enemyTroopImageSrc = house === "House Harkonen" ? "./assets/soldier.svg" : "./assets/harkonen.svg";
  
    troopIndices.forEach(index => {
      // Set the board to 1 for each troop index
      this.board[index] = 1;
      // Set the virtual board with appropriate image for each troop index
      this.virtualBoard[index] = { index, src: this.troopImageSrc, isOccupied: true };
    });
  
    enemyTroopIndices.forEach(index => {
      // Set the board to 2 for each enemy troop index
      this.board[index] = 2;
      // Set the virtual board with appropriate image for each enemy troop index
      this.virtualBoard[index] = { index, src: this.enemyTroopImageSrc, isOccupied: true };
    });
  }
  currentPath(index: number): string {
    return this.virtualBoard[index].src;
  }
  checkIsAlreadyOccupied(index: number): boolean {
    const boardOccupied = this.board[index] !== 0;
    const waterAndSpiceOccupied = this.waterAndSpiceBoard[index] !== "";
    return boardOccupied || waterAndSpiceOccupied;
  }
  toggleCell(index: number) {
    const tileData = this.tileSpawnService.getSelectedTileData();
    const isAlreadyOccupied = this.checkIsAlreadyOccupied(index);
    const tileState:TileUpdateState={
      src: tileData.src,
      indexTarget: index,
      type: tileData.type,
    }
    if(tileData.type == "Spice Harvester" && !this.harvesterPlaced ){
      if(this.waterAndSpiceBoard[index]=="./assets/spiceField.svg"){
        this.tileSpawnService.setTileState(tileState);
        this.harvesterPlaced =true;
      }else{
        console.log("this is not a spice field");
      }
    }else if(tileData.type == "Water Pump"){
      if(isAlreadyOccupied){
        return;
       }
      this.tileSpawnService.setTileState(tileState);
      this.tileSpawnService.setSpice();
    }else if(tileData.type == "Spawn Troop"){
      if(isAlreadyOccupied){
        return;
       }
      this.tileSpawnService.setTileState(tileState);
      this.tileSpawnService.setCredits();
    }else{
      console.log("You can't place multiple harvesters in one turn");
    }
   
}
  drop(event: CdkDragDrop<number>) {
    const previousIndex =event.previousContainer.data;
    const newIndex =event.container.data;
    let trailData = this.movementTrailService.getTrail(previousIndex, newIndex, this.mountainBoard);
    this.trail = trailData.trail;
    if(this.movementService.canMove(trailData.totalCost)){
      this.board[previousIndex] = 0;
      this.board[newIndex] = 1;
      this.virtualBoard[previousIndex]={index:previousIndex,src:"",isOccupied:false}
      this.virtualBoard[newIndex]={index:newIndex,src:this.troopImageSrc,isOccupied:true}
      const combatTrigger = this.combatRunnerService.checkForCombat(newIndex,this.board);
      if(combatTrigger.inCombat){
        this.tileSpawnService.setAggressorIndex(newIndex);
        const combatIndices = this.combatRunnerService.searchSurroundings(newIndex,combatTrigger.defenderIndex,this.board);
        this.winnerSubscription = this.combatRunnerService.getWinner().subscribe((winner: any) => {
          // Handle the winner change here
          console.log("troop removal called")
          this.handleTroopRemoval(winner,combatIndices.engagedTroops,combatIndices.engagedEnemies);
        });
        this.combatRunnerService.openCombatModal(this.house,combatIndices.engagedTroops.length,combatIndices.engagedEnemies.length);
        
        //when combat modal is closed get updated data and change items on map
      }else if(this.waterAndSpiceBoard[newIndex]=="./assets/enemyPump.svg" || this.waterAndSpiceBoard[newIndex]=="./assets/enemyHarvester.svg"){
        const tileState:TileUpdateState={
          src: '',
          indexTarget: newIndex,
          type: 'Clear Object',
        }
        this.tileSpawnService.setTileState(tileState);
      }
      this.trailColor = "rgba(0, 0, 255, 0.3)";
      this.movementService.setRemainingMoves(this.movementService.getCurrentRemainingMoves()-(trailData.totalCost));
      const currentTurnStatus = this.gameManagerService.getTurnStatus();
      this.gameManagerService.setTurnStatus({
      hasMoved: true,
      hasPlaced: currentTurnStatus.hasPlaced,
      hasTakenCard: currentTurnStatus.hasTakenCard,
      combatFinished: currentTurnStatus.combatFinished,
      hasRolled: currentTurnStatus.hasRolled,
    });
      return;
    }
    this.trailColor = "rgba(230, 62, 50,0.5)";
  }

  handleTroopRemoval(winner:string,enlistedTroops:number[],enlistedEnemies:number[]){
    if(winner == "Aggressor"){
      for(let i = 0;i<enlistedEnemies.length;i++){
        this.board[enlistedEnemies[i]]=0
        this.virtualBoard[enlistedEnemies[i]] = { index:enlistedEnemies[i], src: '', isOccupied: false };
      }
    }else{
      for(let i = 0;i<enlistedTroops.length;i++){
        this.board[enlistedTroops[i]]=0
        this.virtualBoard[enlistedTroops[i]] = { index:enlistedTroops[i], src: '', isOccupied: false };
      }
    }
    if (this.winnerSubscription) {
      this.winnerSubscription.unsubscribe();
    }
    //upadte game state
    //add water ?
    this.updatedWaterState = this.waterService.getCurrentWaterState();
    if(this.house == "House Harkonen"){
      if (winner != "Aggressor") {
        this.updatedWaterState.opponentWater+=(enlistedTroops.length*5);
      }
      this.waterService.setWaterState(this.updatedWaterState);
    }
    if(this.house != "House Harkonen"){
      if (winner == "Aggressor") {
        this.updatedWaterState.remainingWater+=(enlistedEnemies.length*5);
      }
      this.waterService.setWaterState(this.updatedWaterState);
    }
    const currentTurnStatus = this.gameManagerService.getTurnStatus();
      this.gameManagerService.setTurnStatus({
      hasMoved: currentTurnStatus.hasMoved,
      hasPlaced: currentTurnStatus.hasPlaced,
      hasTakenCard: currentTurnStatus.hasTakenCard,
      combatFinished: true,
      hasRolled: currentTurnStatus.hasRolled,
  })
  } 
  enterPredicate = (drag: CdkDrag, drop: CdkDropList) =>
    this.board[drop.data] === 0;
} 
