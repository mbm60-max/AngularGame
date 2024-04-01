import { Injectable } from '@angular/core';

export interface MountainPosition {
  src: string;
  left: number;
  top: number;
  rotation: number;
}

interface MountainOptions {
  images: { src: string; width: number; height: number }[];
  rotations: number[];
  maxHeight: number;
  maxWidth: number;
}

const mountainOptions: MountainOptions = {
  images: [{ src: "/assets/mountain1.svg", width: 300, height: 390 },{ src: "/assets/mountain2.svg", width: 320, height: 180 },{ src: "/assets/mountain3.svg", width: 90, height: 120 },
           { src: "/assets/mountain4.svg", width: 90, height: 150 },{ src: "/assets/mountain5.svg", width: 60, height: 60 },{ src: "/assets/mountain6.svg", width: 210, height: 300 }],
  rotations: [0],//, 90, 180, 270
  maxHeight: 1050,
  maxWidth: 570,
};

@Injectable({
  providedIn: 'root'
})
export class MapGeneratorService {
  selectedRotation: number = 0;
  occupiedCells: boolean[] = Array(720).fill(false);
  numberOfRetries:number= 0;
  constructor() { }
  getMountainPositions(numberToGenerate: number): { positions: MountainPosition[]; occupiedCells: boolean[] } {
    const positions: MountainPosition[] = [];
    const occupiedCells: boolean[] = this.occupiedCells.slice(); // Make a copy of the occupiedCells array
    const { images, rotations, maxHeight, maxWidth } = mountainOptions;
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
  
    for (let i = 0; i < numberToGenerate; i++) {
      console.log(`trying to generate ${i}`);
      const randomImage = images[Math.floor(Math.random() * images.length)];
      let randomLeft = (Math.floor(Math.random() * 35)) * 30;
      let randomTop = (Math.floor(Math.random() * 35)) * 30;
      let inBounds = true;
  
      if ((randomRotation === 90 || randomRotation === 270) && (randomImage.src == "/assets/mountain2.svg" || randomImage.src == "/assets/mountain3.svg")) {
        randomLeft -= 15;
        randomTop -= 15;
      }
  
      let heightIndex = randomImage.height / 30;
      let widthIndex = randomImage.width / 30;
      let leftIndex = randomLeft / 30;
      let topIndex = randomTop / 30;
      let overlap = false;
  
      switch (this.selectedRotation) {
        case 0:
          inBounds = (randomLeft >= 0 && randomLeft + randomImage.width <= maxHeight) && (randomTop >= 0 && randomTop + randomImage.height <= maxWidth);
          for (let i = leftIndex; i < leftIndex + widthIndex; i++) {
            for (let j = topIndex; j < topIndex + heightIndex; j++) {
              const cellIndex = j * 36 + i;
              if (occupiedCells[cellIndex] == true) {
                overlap = true;
                break;
              }
            }
          }
          for (let i = leftIndex; i < leftIndex + widthIndex; i++) {
            for (let j = topIndex; j < topIndex + heightIndex; j++) {
              const cellIndex = j * 36 + i;
              occupiedCells[cellIndex] = true;
            }
          }
          break;
        case 90:
          inBounds = (randomTop >= 0 && randomTop + randomImage.width <= maxHeight) && (randomLeft >= 0 && randomLeft + randomImage.height <= maxWidth);
          break;
        case 180:
          inBounds = (randomLeft >= 0 && randomLeft + randomImage.width <= maxHeight) && (randomTop >= 0 && randomTop + randomImage.height <= maxWidth);
          break;
        case 270:
          inBounds = (randomTop >= 0 && randomTop + randomImage.width <= maxHeight) && (randomLeft >= 0 && randomLeft + randomImage.height <= maxWidth);
          break;
        default:
          console.error("Rotation should be 0, 90, 180, or 270");
          break;
      }
  
      // Check for overlap with existing positions
      if (!overlap && inBounds) {
        positions.push({ src: randomImage.src, left: randomLeft, top: randomTop, rotation: randomRotation });
      } else if (this.numberOfRetries > 100) {
        return { positions, occupiedCells };
      } else {
        this.numberOfRetries += 1;
        i--;
      }
    }
  
    return { positions, occupiedCells };
  }
  
}
/*import { Injectable } from '@angular/core';

export interface MountainPosition {
  src: string;
  left: number;
  top: number;
  rotation: number;
}

interface MountainOptions {
  images: { src: string; width: number; height: number }[];
  rotations: number[];
  maxHeight: number;
  maxWidth: number;
}

const mountainOptions: MountainOptions = {
  images: [{ src: "/assets/mountain.svg", width: 300, height: 360 }],
  rotations: [0, 90, 180, 270],
  maxHeight: maxHeight,
  maxWidth: maxWidth,
};

@Injectable({
  providedIn: 'root'
})
export class MapGeneratorService {
  selectedRotation: number = 0;

  constructor() { }

  getMountainPositions(numberToGenerate: number): MountainPosition[] {
    const positions: MountainPosition[] = [];
    const { images, rotations, maxHeight, maxWidth } = mountainOptions;

    for (let i = 0; i < numberToGenerate; i++) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
      const randomLeft = Math.floor(Math.random() * (maxWidth - randomImage.width));
      const randomTop = Math.floor(Math.random() * (maxHeight - randomImage.height));

      // Check if the mountain position overlaps with existing positions
      let overlap = false;
      for (const position of positions) {
        const mountainWidth = position.left + images[0].width;
        const mountainHeight = position.top + images[0].height;
        if (
          (randomLeft >= position.left && randomLeft <= mountainWidth) ||
          (randomLeft + randomImage.width >= position.left && randomLeft + randomImage.width <= mountainWidth)
        ) {
          if (
            (randomTop >= position.top && randomTop <= mountainHeight) ||
            (randomTop + randomImage.height >= position.top && randomTop + randomImage.height <= mountainHeight)
          ) {
            overlap = true;
            break;
          }
        }
      }

      if (!overlap) {
        positions.push({ src: randomImage.src, left: randomLeft, top: randomTop, rotation: randomRotation });
      } else {
        // If overlap detected, decrement i to try generating again for the same index
        i--;
      }
    }

    return positions;
  }
}*/