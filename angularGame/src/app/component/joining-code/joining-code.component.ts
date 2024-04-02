import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreateGameService } from '../../service/create-game.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-joining-code',
  standalone: true,
  imports: [MatCardModule,NgIf],
  templateUrl: './joining-code.component.html',
  styleUrl: './joining-code.component.scss'
})
export class JoiningCodeComponent {
  codeArray:string[] = ['', '', '', '', '', ''];
  codeError:string="";
  constructor(private router:Router,private gameCreateService:CreateGameService){

  }
  handleInput(index: number, event: any) {
    const inputValue = event.target.value;
    
    // Validate input (optional)
    if (/^[a-zA-Z0-9]$/.test(inputValue)) {
      this.codeArray[index] = inputValue;
      
      // Move focus to the next input box
      const nextInputIndex = index + 1;
      if (nextInputIndex < 6) {
        const nextInput = document.querySelectorAll('.code-input input')[nextInputIndex] as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else {
      // Clear invalid input
      this.codeArray[index] = '';
    }
  }
  setGameCode() {
    const gameCode = this.codeArray.join("");
    this.gameCreateService.setCode(gameCode)
    this.router.navigate(['/gameJoin']);
  }
}
