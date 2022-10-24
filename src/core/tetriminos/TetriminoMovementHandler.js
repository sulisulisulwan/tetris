import { makeCopy } from '../utils/utils.js'
// import { SuperRotationSystem } from '../tetriminos/rotation-systems/SuperRS.js'
// import { ClassicRotationSystem } from '../rotation-systems/SuperRS'

export class TetriminoMovementHandler {

  constructor() {}

  flipClockwise(playField, tetrimino) {
    return this.flip(tetrimino, 'flipClockwise', playField)
  }
  
  flipCounterClockwise(playField, tetrimino) {
    return this.flip(tetrimino, 'flipCounterClockwise', playField)
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
    const playFieldNoTetrimino = this.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playField)
  
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

    const tetriminoCopy = makeCopy(tetrimino)
    const newTetrimino = this.updateTetrimino(tetriminoCopy, direction)
    const newPlayField = this.addTetriminoToPlayField(targetCoordsOnPlayfield, playFieldCopy, tetrimino.minoGraphic)

    return {
      newPlayField, 
      newTetrimino,
      successfulMove: true
    }

  }

  // SHARED METHODS

  updateTetrimino(tetrimino, direction, offset, targetOrientation) {

    const [oldVertical, oldHorizontal] = tetrimino.currentOriginOnPlayfield
    const newTetrimino = makeCopy(tetrimino)
    if (direction === 'left') {
      newTetrimino.currentOriginOnPlayfield = [oldVertical, oldHorizontal - 1]
    } else if (direction === 'right') {
      newTetrimino.currentOriginOnPlayfield = [oldVertical, oldHorizontal + 1]
    } else if (direction === 'down') {
      const newOne = [oldVertical + 1, oldHorizontal]
      newTetrimino.currentOriginOnPlayfield = newOne 
    } else if ('flipClockwise' || 'flipCounterClockwise') {
      newTetrimino.currentOriginOnPlayfield = [oldVertical + offset[0], oldHorizontal + offset[1]]
      newTetrimino.currentOrientation = targetOrientation
    }
    return newTetrimino
  }

  removeTetriminoFromPlayField(coords, playField) {
    coords.forEach(coord => {
      playField[coord[0]][coord[1]] = '[_]'
    })
    return playField
  }

  addTetriminoToPlayField(tetriminoCoords, playField, minoGraphic) {
    tetriminoCoords.forEach(coord => {
      playField[coord[0]][coord[1]] = minoGraphic
    })
    return playField
  }

}