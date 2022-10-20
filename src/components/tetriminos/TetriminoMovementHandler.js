import { gridCoordsAreClear, makeCopy } from '../../utils/utils.js'
import { SuperRotationSystem } from '../../rotation-systems/SuperRS.js'
// import { ClassicRotationSystem } from '../rotation-systems/SuperRS'

export class TetriminoMovementHandler {

  constructor() {
    this.rotationSystemMap = this.setRotationSystemMap()
    this.rotationSystem = this.setRotationSystem('super')
  }

  setRotationSystemMap() {
    return new Map([
      ['super', SuperRotationSystem],
      // ['classic', ClassicRotationSystem]
    ])
  }

  setRotationSystem(rotationSystem) {
    const rotatingSystemCtr = this.rotationSystemMap.get(rotationSystem)
    return new rotatingSystemCtr()
  }

  /**
   * All movement controller methods return void
   * They will alter the current tetrimino position, nothing more
   */

  flipClockwise(playField, tetrimino) {
    return this.rotationSystem.flip(tetrimino, 'flipClockwise', playField)
  }
  
  flipCounterClockwise(playField, tetrimino) {
    return this.rotationSystem.flip(tetrimino, 'flipCounterClockwise', playField)
  }

  right(tetrimino, verticalIdx) {
    const oldCoordsOffOrigin = tetrimino.orientations[tetrimino.currentOrientation].coordsOffOrigin
    const oldCoordOnPlayfield = [oldCoordsOffOrigin[verticalIdx][0] + tetrimino.currentOriginOnPlayfield[0], oldCoordsOffOrigin[verticalIdx][1] + tetrimino.currentOriginOnPlayfield[1]]
    const targetCoordOnPlayfield = [oldCoordsOffOrigin[verticalIdx][0] + tetrimino.currentOriginOnPlayfield[0], oldCoordsOffOrigin[verticalIdx][1] + tetrimino.currentOriginOnPlayfield[1] + 1]
    return { oldCoordOnPlayfield, targetCoordOnPlayfield }
  }

  left(tetrimino, verticalIdx) {
    const oldCoordsOffOrigin = tetrimino.orientations[tetrimino.currentOrientation].coordsOffOrigin
    const oldCoordOnPlayfield = [oldCoordsOffOrigin[verticalIdx][0] + tetrimino.currentOriginOnPlayfield[0], oldCoordsOffOrigin[verticalIdx][1] + tetrimino.currentOriginOnPlayfield[1]]
    const targetCoordOnPlayfield = [oldCoordsOffOrigin[verticalIdx][0] + tetrimino.currentOriginOnPlayfield[0], oldCoordsOffOrigin[verticalIdx][1] + tetrimino.currentOriginOnPlayfield[1] - 1]
    return { oldCoordOnPlayfield, targetCoordOnPlayfield }
  }

  down(tetrimino, verticalIdx) {
    const oldCoordsOffOrigin = tetrimino.orientations[tetrimino.currentOrientation].coordsOffOrigin
    const oldCoordOnPlayfield = [oldCoordsOffOrigin[verticalIdx][0] + tetrimino.currentOriginOnPlayfield[0], oldCoordsOffOrigin[verticalIdx][1] + tetrimino.currentOriginOnPlayfield[1]]
    const targetCoordOnPlayfield = [oldCoordsOffOrigin[verticalIdx][0] + tetrimino.currentOriginOnPlayfield[0] + 1, oldCoordsOffOrigin[verticalIdx][1] + tetrimino.currentOriginOnPlayfield[1]]
    return { oldCoordOnPlayfield, targetCoordOnPlayfield }
  }

  moveOne(direction, playField, tetrimino) {

    const oldCoordsOnPlayfield = []
    const targetCoordsOnPlayfield = []

    const { currentOrientation } = tetrimino
    const oldCoordsOffOrigin = tetrimino.orientations[currentOrientation].coordsOffOrigin

    // Get old and new coordinates
    for (let i = 0; i < oldCoordsOffOrigin.length; i += 1) {
      const { oldCoordOnPlayfield, targetCoordOnPlayfield } = this[direction](tetrimino, i)
      oldCoordsOnPlayfield.push(oldCoordOnPlayfield)
      targetCoordsOnPlayfield.push(targetCoordOnPlayfield)
    }

    // Clear out the old coordinates to test new coordinates
    playField = this.clearTetriminoFromPlayField(oldCoordsOnPlayfield, playField)

    if (!gridCoordsAreClear(targetCoordsOnPlayfield, playField)) {
      // Revert to old coordinates if failed.
      playField = this.addTetriminoToPlayField(oldCoordsOnPlayfield, playField, tetrimino.minoGraphic)
      return {
        newPlayField: playField, 
        newTetrimino: tetrimino,
        successfulMove: false
      }
    }

    // Update tetrimino object 
    const newTetrimino = this.updateTetrimino(tetrimino, direction)
    
    // Update the playfield 
    playField = this.addTetriminoToPlayField(targetCoordsOnPlayfield, playField, tetrimino.minoGraphic)

    return {
      newPlayField: playField, 
      newTetrimino: newTetrimino,
      successfulMove: true
    }

  }

  // This is abstracted further from moveOne, as moveOne
  softDrop() {

  }

  hardDrop() {

  }

  // SHARED METHODS

  updateTetrimino(tetrimino, direction) {
    const [oldVertical, oldHorizontal] = tetrimino.currentOriginOnPlayfield
    if (direction === 'left') {
      tetrimino.currentOriginOnPlayfield = [oldVertical, oldHorizontal - 1]
    } else if (direction === 'right') {
      tetrimino.currentOriginOnPlayfield = [oldVertical, oldHorizontal + 1]
    } else if (direction === 'down') {
      const newOne = [oldVertical + 1, oldHorizontal]
      tetrimino.currentOriginOnPlayfield = newOne
    }

    return tetrimino
  }

  clearTetriminoFromPlayField(coords, playField) {
    coords.forEach(coord => {
      playField[coord[0]][coord[1]] = '[_]'
    })
    return playField
  }

  addTetriminoToPlayField(coords, playField, minoGraphic) {
    coords.forEach(coord => {
      playField[coord[0]][coord[1]] = minoGraphic
    })
    return playField
  }

}