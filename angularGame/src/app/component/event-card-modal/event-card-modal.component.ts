import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-card-modal',
  standalone: true,
  imports: [],
  templateUrl: './event-card-modal.component.html',
  styleUrl: './event-card-modal.component.scss'
})
export class EventCardModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EventCardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
