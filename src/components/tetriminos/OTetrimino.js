import { BaseTetrimino } from './BaseTetrimino.js'

export class OTetrimino extends BaseTetrimino {
  
  constructor() {
    super()
    this.minoGraphic = '[e]'
    this.startingGridPosition = [18, 3]
    this.currentGridPosition = [18, 3] // 22nd row from bottom and 4th square from left
    this.localGridSize = 3
    this.currentOrientation = 'north'
    this.orientations = {
      north: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      south: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      }
    } 
  }

}