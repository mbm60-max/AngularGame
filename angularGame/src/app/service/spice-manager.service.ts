import { Injectable } from '@angular/core';
import { MapGeneratorService } from './map-generator.service';
enum PlayerEnum{
  Player1="Player1",
  Player2="Player2",
  None="None"
}
interface SpiceCell {
  cellIndex: number;
  ownedBy: PlayerEnum;
  hasHarvester: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpiceManagerService {
  private spiceCells: SpiceCell[] = [];
  constructor(private mapGeneratorService: MapGeneratorService) { 
    this.generateSpiceCells()
  }
  setSpiceCell(cellIndex: number, ownedBy: PlayerEnum, hasHarvester: boolean) {
    const existingCellIndex = this.spiceCells.findIndex(cell => cell.cellIndex === cellIndex);

    if (existingCellIndex !== -1) {
      // If the cell already exists, update its properties
      this.spiceCells[existingCellIndex].ownedBy = ownedBy;
      this.spiceCells[existingCellIndex].hasHarvester = hasHarvester;
    } else {
      // If the cell doesn't exist, create a new one
      this.spiceCells.push({ cellIndex, ownedBy, hasHarvester });
    }
  }
  generateSpiceCells() {
    const spiceCellsFromMap = this.mapGeneratorService.getSpiceCells();
    
    spiceCellsFromMap.forEach(cellIndex => {
      this.setSpiceCell(cellIndex, PlayerEnum.None, false);
    });
  }
  getSpiceCells(){
    return this.spiceCells;
  }
  getSpiceCellsIndices() {
    return this.spiceCells.map(cell => cell.cellIndex);
  }
}
