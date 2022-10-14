import { gridCoordsAreClear } from '../utils/utils.js'
import { SuperRotationSystem } from '../rotation-systems/SuperRS'
// import { ClassicRotationSystem } from '../rotation-systems/SuperRS'

export class TetriminoMovementHandler {


  constructor() {
    this.rotationSystemMap = this.setRotationSystemMap()
    this.rotationSystem = this.setRotationSystem()
  }

  setRotationSystemMap() {
    return new Map([
      ['super', SuperRotationSystem],
      // ['classic', ClassicRotationSystem]
    ])
  }

  setRotationSystem(rotationSystem) {
    this.rotationSystem = this.rotationSystemMap.get(rotationSystem)
  }

  /**
   * All movement controller methods return void
   * They will alter the current tetrimino position, nothing more
   */

  flipRight(playField, tetrimino) {

    const newCoords = this.rotationSystem.getValidTargetGridCoords(tetrimino, 'right', playField, )
    if (newCoords) {
      tetrimino.setCurrentGridPosition(newCoords)
    }
  }
  
  flipLeft() {
    const newCoords = this.rotationSystem.getValidTargetGridCoords(tetrimino, 'left', playField, )
    if (newCoords) {
      tetrimino.setCurrentGridPosition(newCoords)
    }
  }

  moveRightOne(playField, tetrimino) {
    const coordsWithinLocalGrid = tetrimino.orientations[tetrimino.currentOrientation].primaryPosition
    const targetCoords = coordsWithinLocalGrid.map(coord => {
      return [coord[0], coord[1] + tetrimino.currentGridPosition[1] + 1]
    })

    const newCoords = gridCoordsAreClear(targetCoords, playField) ? targetCoords : null
    if (newCoords) {
      tetrimino.setCurrentGridPosition(newCoords)
    }
  }

  moveLeftOne(playField, tetrimino) {
    const coordsWithinLocalGrid = tetrimino.orientations[tetrimino.currentOrientation].primaryPosition
    const targetCoords = coordsWithinLocalGrid.map(coord => {
      return [coord[0], coord[1] + tetrimino.currentGridPosition[1] - 1]
    })

    const newCoords = gridCoordsAreClear(targetCoords, playField) ? targetCoords : null
    if (newCoords) {
      tetrimino.setCurrentGridPosition(newCoords)
    }

  }

  moveOneDown(playField, tetrimino) {
    
    const coordsWithinLocalGrid = tetrimino.orientations[tetrimino.currentOrientation].primaryPosition
    const targetCoords = coordsWithinLocalGrid.map(coord => {
      return [coord[0] + tetrimino.currentGridPosition[0] + 1, coord[1]]
    })

    const newCoords = gridCoordsAreClear(targetCoords, playField) ? targetCoords : null
    if (newCoords) {
      tetrimino.setCurrentGridPosition(newCoords)
    }

  }


  moveLeft() {

  }
  moveRight() {

  }
  // This is abstracted further from moveOne, as moveOne
  softDrop() {

  }

  hardDrop() {

  }

}