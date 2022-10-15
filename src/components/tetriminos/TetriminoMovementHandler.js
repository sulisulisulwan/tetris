import { gridCoordsAreClear } from '../../utils/utils.js'
import { SuperRotationSystem } from '../../rotation-systems/SuperRS.js'
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
    return this
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


  /**
   * moveOneDown()
   * 
   * This alters the playField and tetrimino state, currently as a side effect.
   * Needs a refactor.
   * 
   * @param {*} playField 
   * @param {*} tetrimino 
   * @returns 
   */
  moveOneDown(playField, tetrimino) {
    
    // Get the current location of all of the minos in the tetrimino
    const coordsWithinLocalGrid = tetrimino.orientations[tetrimino.currentOrientation].primaryPosition

    const oldCoords = []
    const targetCoords = []

    // Get each mino square coordinate for both the old position and the target position
    for (let i = 0; i < coordsWithinLocalGrid.length; i += 1) {
      const oldCoord = [coordsWithinLocalGrid[i][0] + tetrimino.currentGridPosition[0], coordsWithinLocalGrid[i][1] + tetrimino.currentGridPosition[1]]
      const targetCoord = [coordsWithinLocalGrid[i][0] + tetrimino.currentGridPosition[0] + 1, coordsWithinLocalGrid[i][1] + tetrimino.currentGridPosition[1]]
      oldCoords.push(oldCoord)
      targetCoords.push(targetCoord)
    }

    // Verify if the new target position is unoccupied.
    if (!gridCoordsAreClear(targetCoords, playField)) {
      return false
    }
    
    // Update the new point of reference for the tetrimino local grid
    const [oldVertical, oldHorizontal] = tetrimino.currentGridPosition
    tetrimino.setCurrentGridPosition([oldVertical + 1, oldHorizontal])
      
    // Update the playfield by removing the old coordinates and inputting the new.
    
    for (let i = 0; i < oldCoords.length; i += 1) {
      playField[oldCoords[i][0]][oldCoords[i][1]] = '[_]'
    }
    for (let i = 0; i < targetCoords.length; i += 1) {
      playField[targetCoords[i][0]][targetCoords[i][1]] = tetrimino.minoGraphic
    }
    return true

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