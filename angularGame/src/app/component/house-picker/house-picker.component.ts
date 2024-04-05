import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { HousePickerService } from '../../service/house-picker.service';

@Component({
  selector: 'app-house-picker',
  standalone: true,
  imports: [NgClass],
  templateUrl: './house-picker.component.html',
  styleUrl: './house-picker.component.scss'
})
export class HousePickerComponent {
  constructor(private housePickerService: HousePickerService) {}

  @Output() houseSelected = new EventEmitter<string>();

  selectHouse(house: string) {
    this.housePickerService.setSelectedHouse(house);
  }

}
