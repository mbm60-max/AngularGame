import { Injectable, OnDestroy } from '@angular/core';
import { WaterService } from './water.service';
import { GameManagerService} from './game-manager.service';
import { UnitCreditsService } from './unit-credits.service';
import { TileSpawnService, TileUpdateState } from './tile-spawn.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventCardService implements OnDestroy {
  pumpIndices:number[]=[];
  occupiedIndices:number[]=[];
  troopIndices:number[]=[];
  cardList:string[]=[];
  eventCardStateSubscription: Subscription | undefined;
  constructor(private waterService:WaterService,private gameManager:GameManagerService,private creditService:UnitCreditsService,private tileSpawner:TileSpawnService) {
    
      this.eventCardStateSubscription = this.gameManager.getEventCardStatusUpdates().subscribe(() => {
        this.setCardPack();
       });
    }
    ngOnDestroy(): void {
      if (this.eventCardStateSubscription) {
        this.eventCardStateSubscription.unsubscribe();
      }
    }
    setCardPack(){
      const playerData = this.gameManager.getCurrentPlayer();
      const playerOneData = this.gameManager.getPlayerOneData();
      const playerTwoData = this.gameManager.getPlayerTwoData()
      const spiceData = this.gameManager.getSpiceData();
      const turnData = this.gameManager.getTurnData();
      this.cardList =  turnData.EventCards;
      console.log("turn data",turnData)
      const player = playerData.currentPlayer;
      const p1Pumps=playerOneData.WaterPumpIndices;
      const p2Pumps=playerTwoData.WaterPumpIndices;
      const p1Troops=playerOneData.TroopIndices;
      const p2Troops=playerTwoData.TroopIndices;
      const p1Harvesters= spiceData.PlayerOneHarvesterIndices;
      const p2Harvesters= spiceData.PlayerTwoHarvesterIndices;
      const spiceFields = spiceData.SpiceFieldIndices;
      if(player == "PlayerOne"){ 
       this.pumpIndices=playerOneData.WaterPumpIndices;
       this.troopIndices=playerOneData.TroopIndices;
       this.occupiedIndices = [
        ...p1Pumps,
        ...p2Pumps,
        ...p1Troops,
        ...p2Troops,
        ...p1Harvesters,
        ...p2Harvesters,
        ...spiceFields
      ];
      }else{
        this.pumpIndices=playerTwoData.WaterPumpIndices;
       this.troopIndices=playerTwoData.TroopIndices;
       this.occupiedIndices = [
        ...p1Pumps,
        ...p2Pumps,
        ...p1Troops,
        ...p2Troops,
        ...p1Harvesters,
        ...p2Harvesters,
        ...spiceFields
      ];
      }
    }
    
    
  
  eventCardMapping: { [key: string]: Function } = {
    "Lose 5 Credits": this.lose5Credits,
    "Lose 10 Credits": this.lose10Credits,
    "Gain 5 Credits": this.gain5Credits,
    "Gain 10 Credits": this.gain10Credits,
    "Lose 5 Water": this.lose5Water,
    "Lose 10 Water": this.lose10Water,
    "Gain 5 Water": this.gain5Water,
    "Gain 10 Water": this.gain10Water,
    "Destroy Pump": this.destroyPump,
    "Give Pump": this.givePump,
    "Kill Troop": this.killTroop,
    "Gain Troop": this.gainTroop
  };
  eventCardKeys: string[] = Object.keys(this.eventCardMapping);
  shufflePack(): string[] {
    for (let i = this.eventCardKeys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.eventCardKeys[i], this.eventCardKeys[j]] = [this.eventCardKeys[j], this.eventCardKeys[i]];
    }
    return this.eventCardKeys;
  }

  pickRandomIndex(array:number[]){
    if (array.length === 0) {
      throw new Error('Array is empty');
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return randomIndex;
  }
  pickRandomIndexNotOccupied(array: number[]): number {
    console.log(array)
    if (array.length === 720) {
        throw new Error('Array contains all indices from 0 to 719');
    }
    const triedSet = new Set<number>();
    while (true) {
        const randomIndex = Math.floor(Math.random() * 720);
        if (!array.includes(randomIndex) && !triedSet.has(randomIndex)) {
            return randomIndex;
        }
        triedSet.add(randomIndex);
        if (triedSet.size === 720 - array.length) {
            throw new Error('All available indices are already in the array');
        }
    }
}
takeCard(): string {
  const card = this.cardList.shift();
  if (card) {
    const cardFunction = this.eventCardMapping[card];
    if (cardFunction) {
      cardFunction(); // Trigger the corresponding function from the eventCardMapping
    }
    this.cardList.push(card);
    return card;
  } else {
    console.log(this.cardList)
    throw new Error("No more cards left.");
  }
}
  lose5Credits() {
    const subscription = this.creditService.getCreditState().subscribe(currentCredits => {
      this.creditService.setCreditState(currentCredits - 5);
      subscription.unsubscribe(); 
  });
  }
  lose10Credits() {
    const subscription = this.creditService.getCreditState().subscribe(currentCredits => {
      this.creditService.setCreditState(currentCredits - 10);
      subscription.unsubscribe(); 
  });
  }
  gain5Credits() {
    const subscription = this.creditService.getCreditState().subscribe(currentCredits => {
      this.creditService.setCreditState(currentCredits + 5);
      subscription.unsubscribe(); 
  });
  }
  gain10Credits() {
    const subscription = this.creditService.getCreditState().subscribe(currentCredits => {
      this.creditService.setCreditState(currentCredits + 10);
      subscription.unsubscribe(); 
  });
  }

  lose5Water() {
    const subscription = this.waterService.getWaterState().subscribe(currentState => {
      let updateState = {...currentState};
      updateState.remainingWater-=5;
      this.waterService.setWaterState(updateState);
      subscription.unsubscribe(); 
  });
  }

  lose10Water() {
    const subscription = this.waterService.getWaterState().subscribe(currentState => {
      let updateState = {...currentState};
      updateState.remainingWater-=10;
      this.waterService.setWaterState(updateState);
      subscription.unsubscribe(); 
  });
  }

  gain5Water() {
    const subscription = this.waterService.getWaterState().subscribe(currentState => {
      let updateState = {...currentState};
      updateState.remainingWater+=5;
      this.waterService.setWaterState(updateState);
      subscription.unsubscribe(); 
  });
  }

  gain10Water() {
    const subscription = this.waterService.getWaterState().subscribe(currentState => {
      let updateState = {...currentState};
      updateState.remainingWater+=10;
      this.waterService.setWaterState(updateState);
      subscription.unsubscribe(); 
  });
  }

  destroyPump() {
    const removeIndex = this.pumpIndices[this.pickRandomIndex(this.pumpIndices)]
    const tileState:TileUpdateState={
      src: "",
      indexTarget: removeIndex,
      type: "Clear Object",
    }
    this.removeFromLists(removeIndex);
    this.tileSpawner.setTileState(tileState);
    const subscription = this.waterService.getWaterState().subscribe(currentState => {
      let updateState = {...currentState};
      updateState.numberOfPumps -=1;
      this.waterService.setWaterState(updateState);
      subscription.unsubscribe(); 
  });
  }
  givePump() {
    const newIndex = this.pickRandomIndexNotOccupied(this.occupiedIndices);
    const tileState:TileUpdateState={
      src: "./assets/waterPump.svg",
      indexTarget: newIndex,
      type: "Water Pump",
    }
    this.pumpIndices = [...this.pumpIndices,newIndex];
    this.occupiedIndices = [...this.occupiedIndices,newIndex];
    this.tileSpawner.setTileState(tileState);
    const subscription = this.waterService.getWaterState().subscribe(currentState => {
      let updateState = {...currentState};
      updateState.numberOfPumps +=1;
      this.waterService.setWaterState(updateState);
      subscription.unsubscribe(); 
  });
  }

  killTroop() {
    const removeIndex = this.troopIndices[this.pickRandomIndex(this.troopIndices)]
    const tileState:TileUpdateState={
      src: "",
      indexTarget: removeIndex,
      type: "Clear Troop",
    }
    this.removeFromLists(removeIndex);
    this.tileSpawner.setTileState(tileState);
  }

  gainTroop() {
    const newIndex = this.pickRandomIndexNotOccupied(this.occupiedIndices);
    const tileState:TileUpdateState={
      src: "",
      indexTarget: newIndex,
      type: "Spawn Troop",
    }
    this.troopIndices = [...this.troopIndices,newIndex];
    this.occupiedIndices = [...this.occupiedIndices,newIndex];
    this.tileSpawner.setTileState(tileState);
  
  }
  private removeFromLists (removeIndex:number){
    const indexToRemove = this.troopIndices.indexOf(removeIndex);
    if (indexToRemove !== -1) {
        this.troopIndices.splice(indexToRemove, 1);
    }

    const occupiedIndexToRemove = this.occupiedIndices.indexOf(removeIndex);
    if (occupiedIndexToRemove !== -1) {
        this.occupiedIndices.splice(occupiedIndexToRemove, 1);
    }
  }
}

