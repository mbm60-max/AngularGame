import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HousePickerService {
  private selectedHouses = {
    playerOneHouse:"",
    playerTwoHouse:"",
  }
  constructor() { }
  setSelectedHouse(selectedHouse:string){
    this.selectedHouses.playerOneHouse=selectedHouse;
    if(selectedHouse=="Harkonen"){
      this.selectedHouses.playerTwoHouse="Fremen";
    }else{
      this.selectedHouses.playerTwoHouse="Harkonen";
    }
  }
  getSelectedHouses(){
    return this.selectedHouses;
  }
}
