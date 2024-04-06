import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventCardService } from '../../service/event-card.service';
import { EventCardModalComponent } from '../event-card-modal/event-card-modal.component';
import { GameManagerService } from '../../service/game-manager.service';

@Component({
  selector: 'app-event-card-deck',
  standalone: true,
  imports: [],
  templateUrl: './event-card-deck.component.html',
  styleUrl: './event-card-deck.component.scss'
})
export class EventCardDeckComponent {
  @Input() toggleTurn: boolean = false;
  constructor(private dialog: MatDialog, private eventCardService: EventCardService,private gameManager:GameManagerService) {}

  openModal(): void {
    const cardText = this.eventCardService.takeCard();
    console.log("Chosen  Card",cardText);
    const currentTurnStatus = this.gameManager.getTurnStatus();
      this.gameManager.setTurnStatus({
      hasMoved: currentTurnStatus.hasMoved,
      hasPlaced: currentTurnStatus.hasPlaced,
      hasTakenCard: true,
      combatFinished: currentTurnStatus.combatFinished,
      hasRolled: currentTurnStatus.hasRolled,
  })
    this.dialog.open(EventCardModalComponent, {
      data: { title: cardText },
      panelClass: 'event-card-modal'
    });
  }
}
