import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TileEnum, TileSpawnService } from '../../service/tile-spawn.service';

@Component({
  selector: 'app-tile-spawner',
  standalone: true,
  imports: [DragDropModule,NgIf,NgFor],
  templateUrl: './tile-spawner.component.html',
  styleUrl: './tile-spawner.component.scss'
})
export class TileSpawnerComponent {
  tiles: TileEnum[] = [TileEnum.Harvester, TileEnum.WaterPump, TileEnum.Fremen];
  selectedTileIndex: number | null = null;

  constructor(private tileSpawnService: TileSpawnService) {}

  handleTileClick(index: number) {
    if (this.selectedTileIndex === index) {
      this.selectedTileIndex = null;
      this.tileSpawnService.setSelectedType(TileEnum.None);
    } else {
      this.selectedTileIndex = index;
      this.tileSpawnService.setSelectedType(this.tiles[index]);
    }
  }
}
