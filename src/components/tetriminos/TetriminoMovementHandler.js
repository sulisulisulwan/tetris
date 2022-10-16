import { gridCoordsAreClear, makeCopy } from '../../utils/utils.js'
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

  right(tetrimino, verticalIdx) {
    const coordsWithinLocalGrid = tetrimino.orientations[tetrimino.currentOrientation].primaryPosition
    const oldCoord = [coordsWithinLocalGrid[verticalIdx][0] + tetrimino.currentGridPosition[0], coordsWithinLocalGrid[verticalIdx][1] + tetrimino.currentGridPosition[1]]
    const targetCoord = [coordsWithinLocalGrid[verticalIdx][0] + tetrimino.currentGridPosition[0], coordsWithinLocalGrid[verticalIdx][1] + tetrimino.currentGridPosition[1] + 1]
    return { oldCoord, targetCoord }
  }

  left(tetrimino, verticalIdx) {
    const coordsWithinLocalGrid = tetrimino.orientations[tetrimino.currentOrientation].primaryPosition
    const oldCoord = [coordsWithinLocalGrid[verticalIdx][0] + tetrimino.currentGridPosition[0], coordsWithinLocalGrid[verticalIdx][1] + tetrimino.currentGridPosition[1]]
    const targetCoord = [coordsWithinLocalGrid[verticalIdx][0] + tetrimino.currentGridPosition[0], coordsWithinLocalGrid[verticalIdx][1] + tetrimino.currentGridPosition[1] - 1]
    return { oldCoord, targetCoord }
  }

  down(tetrimino, verticalIdx) {
    
    const coordsWithinLocalGrid = tetrimino.orientations[tetrimino.currentOrientation].primaryPosition
    const oldCoord = [coordsWithinLocalGrid[verticalIdx][0] + tetrimino.currentGridPosition[0], coordsWithinLocalGrid[verticalIdx][1] + tetrimino.currentGridPosition[1]]
    const targetCoord = [coordsWithinLocalGrid[verticalIdx][0] + tetrimino.currentGridPosition[0] + 1, coordsWithinLocalGrid[verticalIdx][1] + tetrimino.currentGridPosition[1]]
    return { oldCoord, targetCoord }
  }

  updateTetrimino(tetrimino, direction) {
    const [oldVertical, oldHorizontal] = tetrimino.currentGridPosition
    if (direction === 'left') {
      tetrimino.currentGridPosition = [oldVertical, oldHorizontal - 1]
    } else if (direction === 'right') {
      tetrimino.currentGridPosition = [oldVertical, oldHorizontal + 1]
    } else if (direction === 'down') {
      tetrimino.currentGridPosition = [oldVertical + 1, oldHorizontal]
    }

    return tetrimino
  }

  moveOne(direction, playField, tetrimino) {

    const oldCoords = []
    const targetCoords = []

    // Get old and new coordinates
    for (let i = 0; i < tetrimino.orientations[tetrimino.currentOrientation].primaryPosition.length; i += 1) {
      const { oldCoord, targetCoord } = this[direction](tetrimino, i)
      oldCoords.push(oldCoord)
      targetCoords.push(targetCoord)
    }

    // Clear out the old coordinates to test new coordinates
    oldCoords.forEach(coord => {
      playField[coord[0]][coord[1]] = '[_]'
    })
    
    if (!gridCoordsAreClear(targetCoords, playField)) {
      // Revert to old coordinates if failed.
      oldCoords.forEach(coord => {

        
        playField[coord[0]][coord[1]] = tetrimino.minoGraphic
      })

      return {
        newPlayField: playField, 
        newTetrimino: tetrimino,
        successfulMove: false
      }
    }

    // Update tetrimino object 
    tetrimino = this.updateTetrimino(tetrimino, direction)
      
    // Update the playfield 
    targetCoords.forEach(coord => {
      playField[coord[0]][coord[1]] = tetrimino.minoGraphic
    })

    return {
      newPlayField: playField, 
      newTetrimino: tetrimino,
      successfulMove: true
    }

  }

  // This is abstracted further from moveOne, as moveOne
  softDrop() {

  }

  hardDrop() {

  }

}