import { makeCopy } from '../utils/utils.js'
import { SuperRotationSystem } from '../tetriminos/rotation-systems/SuperRS.js'
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

  gridCoordsAreClear(tetrimino, playField, direction) {

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
    const playFieldNoTetrimino = this.clearTetriminoFromPlayField(oldCoordsOnPlayfield, playField)
  
    const targetCoordsClear = targetCoordsOnPlayfield.every(coord => {
      if (playFieldNoTetrimino[coord[0]]) { // This coordinate exists in the playable space
        if (playFieldNoTetrimino[coord[0]][coord[1]] !== undefined) { // This square exists in the playable space
          if (playFieldNoTetrimino[coord[0]][coord[1]] === '[_]') { // This square is not yet occupied
            return true
          }
        }
      } 
      return false
    }) 
  
    return {
      oldCoordsOnPlayfield,
      targetCoordsOnPlayfield,
      playFieldNoTetrimino,
      targetCoordsClear
    }
  }
  

  moveOne(direction, playField, tetrimino) {
    const playFieldCopy = makeCopy(playField)

    const {
      oldCoordsOnPlayfield,
      targetCoordsOnPlayfield,
      playFieldNoTetrimino,
      targetCoordsClear
    } = this.gridCoordsAreClear(tetrimino, playFieldCopy, direction)

    if (!targetCoordsClear) {
      // Revert to old coordinates if failed.
      const newPlayField = this.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetrimino.minoGraphic)
      return {
        newPlayField,
        newTetrimino: tetrimino,
        successfulMove: false
      }
    }

    // Update tetrimino object 
    const tetriminoCopy = makeCopy(tetrimino)
    const newTetrimino = this.updateTetrimino(tetriminoCopy, direction)
    
    // Update the playfield 
    const newPlayField = this.addTetriminoToPlayField(targetCoordsOnPlayfield, playFieldCopy, tetrimino.minoGraphic)

    return {
      newPlayField, 
      newTetrimino,
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