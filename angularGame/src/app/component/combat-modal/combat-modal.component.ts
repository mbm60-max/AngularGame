import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CombatRunnerService, DialogData } from '../../service/combat-runner.service';
import { NgIf } from '@angular/common';
import { TileSpawnService, TileUpdateState } from '../../service/tile-spawn.service';


@Component({
  standalone: true,
  selector: 'app-combat-modal',
  templateUrl: './combat-modal.component.html',
  styleUrl: './combat-modal.component.scss',
  imports:[NgIf],
})
export class CombatModalComponent {
  playerOneScore: number = 0;
  playerTwoScore: number = 0;
  fightFinished:boolean = false;
  winner:string="";
  playerOneDice:number = 0;
  playerTwoDice:number = 0;
  playerBonus:string="";


  constructor(private combatRunner:CombatRunnerService,private tileSpawnService:TileSpawnService,
    public dialogRef: MatDialogRef<CombatModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.playerOneScore = +data.playerOneScore;
      this.playerTwoScore = +data.playerTwoScore;
    }

    runFight(): void {
      const {playerOneScore, playerTwoScore,playerOneDice,playerTwoDice,playerBonus} = this.combatRunner.runFight(+this.data.playerOneTroops, +this.data.playerTwoTroops,this.data.title);
      this.playerOneScore = playerOneScore;
      this.playerTwoScore = playerTwoScore;
      this.winner = playerOneScore>playerTwoScore?"Aggressor":"Defender";
      this.playerOneDice=playerOneDice;
      this.playerTwoDice=playerTwoDice;
      this.playerBonus=playerBonus;
      this.fightFinished = true;
      if(this.winner == "Aggressor"){
        const tileState:TileUpdateState={
          src: '',
          indexTarget: this.tileSpawnService.getAggresorIndex(),
          type: 'Clear Object',
        }
        this.tileSpawnService.setTileState(tileState);
      }
    }
    endFight():void{
      this.combatRunner.setWinner(this.winner);
      this.dialogRef.close();
    }

}