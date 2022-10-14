import { BaseTetrimino } from './BaseTetrimino.js'

export class STetrimino extends BaseTetrimino {

  constructor() {
    super()
    this.minoGraphic = '[a]'
    this.startingGridPosition = [18, 2]
    this.currentGridPosition = [18, 2]
    this.localGridSize = 3
    this.currentOrientation = 'north'
    this.orientations = {
      north: {
        primaryPosition: [[0,1], [0,2], [1,0], [1,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,1], [1,1], [1,2], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] }
      },
      south: {
        primaryPosition: [[1,1], [1,2], [2,0], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,0], [1,0], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] }
      }
    } 
  }
}