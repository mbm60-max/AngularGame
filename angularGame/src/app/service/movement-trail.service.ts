import { Injectable } from '@angular/core';
import { Cell } from '../component/board/board.component';


@Injectable({
  providedIn: 'root'
})
export class MovementTrailService {

  constructor() { }
///currently counts the step before not the step taken
  getTrail(startIndex: number, endIndex: number, mountainPositions: boolean[]): { trail: number[]; totalCost: number } {
    const numRows = 20;
    const numCols = 36;
    const totalCells = numRows * numCols;
    const INF = Number.MAX_SAFE_INTEGER;
    const distances: number[] = Array(totalCells).fill(INF);
    const visited: boolean[] = Array(totalCells).fill(false);
    const trail: number[] = [];
  
    const isValidIndex = (index: number): boolean => {
      return index >= 0 && index < totalCells;
    };
  
    const getNeighbors = (index: number): number[] => {
      const neighbors: number[] = [];
      const row = Math.floor(index / numCols);
      const col = index % numCols;
      const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
      ];
  
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const newIndex = newRow * numCols + newCol;
        if (isValidIndex(newIndex) && newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
          neighbors.push(newIndex);
        }
      }
  
      return neighbors;
    };
  
    distances[startIndex] = 0;
  
    for (let i = 0; i < totalCells - 1; i++) {
      let minDist = INF;
      let minIndex = -1;
  
      for (let j = 0; j < totalCells; j++) {
        if (!visited[j] && distances[j] < minDist) {
          minDist = distances[j];
          minIndex = j;
        }
      }
  
      if (minIndex === -1) {
        break;
      }
  
      visited[minIndex] = true;
      const neighbors = getNeighbors(minIndex);
      for (const neighbor of neighbors) {
        const cost = mountainPositions[neighbor] ==true ? 2 : 1;
        if (!visited[neighbor] && distances[minIndex] + cost < distances[neighbor]) {
          distances[neighbor] = distances[minIndex] + cost;
        }
      }
    }
  
    // Reconstruct path
    let currentIndex = endIndex;
    trail.push(currentIndex);
    let totalCost = 0;
    while (currentIndex !== startIndex) {
      const neighbors = getNeighbors(currentIndex);
      let minNeighbor = -1;
      let minDist = INF;
      for (const neighbor of neighbors) {
        const cost = mountainPositions[neighbor] ==true ? 2 : 1;
        if (distances[neighbor] + cost < minDist) {
          minDist = distances[neighbor] + cost;
          minNeighbor = neighbor;
        }
      }
      if (minNeighbor === -1) {
        break;
      }
      currentIndex = minNeighbor;
      trail.push(currentIndex);
      totalCost += minDist - distances[currentIndex];
    }
  
    return { trail: trail.reverse(), totalCost };
  }
  
}

