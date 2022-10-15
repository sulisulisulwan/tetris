import { gridCoordsAreClear } from '../../utils/utils.js'

export class BaseTetrimino {

  constructor() {
    this.startingGridPosition = [18, 3]
    this.currentGridPosition = [18, 3]
    this.localGridSize = 3
    this.orientations = {
      north: '',
      east: '',
      south: '',
      west: ''
    } 
    
    this.status = 'inQueue'
    // this.ghostCoordinates = this.getGhostCoordinates()
  }

  setCurrentGridPosition(newGridPosition) {
    this.currentGridPosition = newGridPosition
    //sets calculated grid position
    //DOESNT CALCULATE THE GRID POSITION
  }

  setCurrentOrientation(orientation) {
    this.currentOrientation = orientation
  }
  // Status setters

  setStatusNewlyGenerated() {
    this.status = 'newlyGenerated'
  }

  setStatusInPlay() {
    this.status = 'inPlay'
  }

  setStatusLocked() {
    this.status = 'locked'
  }

  // Getters

  getLocalGrid() {
    const grid = new Array(this.localGridSize).fill(null)
    return grid.map(row => new Array(this.localGridSize).fill('[_]', 0, this.localGridSize))
  }

  reset() {
    this.setCurrentGridPosition(this.startingGridPosition)
    this.setCurrentOrientation('north')
  }

}

/**
 * --------------------------
 * Different Status states:
 * 
 * inQueue          <- state before tetrimino exists on playfield.
 * newlyGenerated   <- state before player legally moves tetrimino
 * inPlay           <- state when a player first legally moves tetrimino
 * locked           <- state when a legally moved tetrimino is out of play
 * --------------------------
 */
