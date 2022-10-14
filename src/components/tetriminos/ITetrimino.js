import { BaseTetrimino } from './BaseTetrimino.js'

export class ITetrimino extends BaseTetrimino {

  constructor() {
    super()
    this.startingGridPosition = [19, 3]
    this.currentGridPosition = [19, 3]
    this.localGridSize = 4
    this.orientations = {
      north: {
        primaryPosition: [[1,0], [1,1], [1,2], [1,3]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [1,3], 4: [1,0], 5: [1,3] }
      },
      east: {
        primaryPosition: [[0,2], [1,2], [2,2], [3,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [1,2], 4: [0,2], 5: [3,2] }      
      },
      south: {
        primaryPosition: [[2,0], [2,1], [2,2], [2,3]],
        rotationPoints: { 1: [1,1], 2: [1,3], 3: [1,0], 4: [2,2], 5: [2,0] }
      },
      west: {
        primaryPosition: [[0,1], [1,1], [2,1], [3,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [3,1], 5: [0,1] }
      }
    }  

  }
}