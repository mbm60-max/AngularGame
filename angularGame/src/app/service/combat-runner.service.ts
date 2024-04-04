import { Injectable } from '@angular/core';
import { CombatModalComponent } from '../component/combat-modal/combat-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

export interface DialogData{
  title:string;
  playerOneTroops:string;
  playerTwoTroops:string;
  playerOneScore:string;
  playerTwoScore:string;
}
@Injectable({
  providedIn: 'root'
})
export class CombatRunnerService {
  rows:number=20;
  columns:number=36;
  directions: { [key: string]: number } = {
    left: -1,
    right: 1,
    up: -this.columns,
    down: this.columns,
    upperLeft: -this.columns - 1,
    upperRight: -this.columns + 1,
    lowerLeft: this.columns - 1,
    lowerRight: this.columns + 1
};
private winnerSubject = new Subject<string>();
winner$ = this.winnerSubject.asObservable();

 
  constructor(private dialog: MatDialog) { }
  setWinner(winner: string) {
    this.winnerSubject.next(winner);
  }

  getWinner(): Observable<string> {
    return this.winner$;
  }
  openCombatModal(title: string, playerOneTroops: number, playerTwoTroops: number): void {
    const dialogRef = this.dialog.open(CombatModalComponent, {
      width: '250px',
      data: {
        title,
        playerOneScore: 0,
        playerTwoScore: 0,
        playerOneTroops,
        playerTwoTroops
      }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      console.log('The dialog was closed');
    });
  }
  private isIndexOutOfBounds = (index: number) => index < 0 || index >= this.rows * this.columns;
  searchSurroundings(aggressorIndex: number, defenderIndex: number, board: number[]):{engagedTroops:number[],engagedEnemies:number[]} {
    const enlistedTroops = new Set([aggressorIndex]);
    const enemyEnlistedTroops = new Set([defenderIndex]);
    const troopsToCheck = [aggressorIndex];
    const enemiesToCheck = [defenderIndex];
    enlistedTroops.add(aggressorIndex);
    enemyEnlistedTroops.add(defenderIndex);
    // Function to check if index is out of bounds

    // Function to check if index is already enlisted or to enlist it
    const enlistIndex = (index: number, set: Set<number>, list: number[]) => {
        if (!set.has(index)) {
            set.add(index);
            list.push(index);
        }
    };

    while (troopsToCheck.length > 0) {
        const currentTroopIndex = troopsToCheck.shift()!;
        for (const direction in this.directions) {
            const newIndex = currentTroopIndex + this.directions[direction];
            if (!this.isIndexOutOfBounds(newIndex) && !enlistedTroops.has(newIndex)) {
              if(board[newIndex]==1){
                enlistIndex(newIndex, enlistedTroops, troopsToCheck);
              }
            }
        }
    }

    while (enemiesToCheck.length > 0) {
        const currentEnemyIndex = enemiesToCheck.shift()!;
        for (const direction in this.directions) {
            const newIndex = currentEnemyIndex + this.directions[direction];
            if (!this.isIndexOutOfBounds(newIndex) && !enemyEnlistedTroops.has(newIndex)) {
                if(board[newIndex]==2){
                  enlistIndex(newIndex, enemyEnlistedTroops, enemiesToCheck);
                }
            }
        }
    }
    const engagedTroops = Array.from(enlistedTroops);
    const engagedEnemies= Array.from(enemyEnlistedTroops);
    console.log(engagedTroops);
    console.log(engagedEnemies);
    return {engagedTroops,engagedEnemies};
}

  checkForCombat(aggressorIndex: number, board: number[]): {inCombat:boolean,defenderIndex:number} {

    // Check if any adjacent tiles contain the number 2
    for (const direction in this.directions) {
        const newIndex = aggressorIndex + this.directions[direction];
        if (!this.isIndexOutOfBounds(newIndex) && board[newIndex] === 2) {
            return {inCombat:true,defenderIndex:newIndex}; // Found adjacent tile containing 2
        }
    }
    return{inCombat:false,defenderIndex:-1}; // No adjacent tile contains 2
}

runFight(playerOneTroops: number, playerTwoTroops: number,startedBy:string): { playerOneScore: number, playerTwoScore: number,playerOneDice:number,playerTwoDice:number,playerBonus:string } {

  const playerOneDice = Math.floor(Math.random() * 6) + 1;
  const playerTwoDice = Math.floor(Math.random() * 6) + 1;
  if(startedBy == "Harkonen"){
    const playerOneScore = (playerOneTroops*playerOneDice) +2; 
    const playerTwoScore = playerTwoTroops*playerTwoDice;
    const playerBonus = "Player One";
    return { playerOneScore, playerTwoScore,playerOneDice,playerTwoDice,playerBonus};
  }
  const playerOneScore = (playerOneTroops*playerOneDice);
  const playerTwoScore = (playerTwoTroops*playerTwoDice)+2;
  const playerBonus = "Player Two";
  return { playerOneScore, playerTwoScore,playerOneDice,playerTwoDice,playerBonus };
  }
  
 
}
