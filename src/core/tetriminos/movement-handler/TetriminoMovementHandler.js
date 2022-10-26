import { makeCopy } from '../../utils/utils.js'

export class TetriminoMovementHandler {

  constructor() {}

  right(localOrigin, playFieldOrigin) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playFieldOrigin[0], 
      localOrigin[1] + playFieldOrigin[1] + 1
    ]
    return targetCoordOnPlayfield
  }

  left(localOrigin, playFieldOrigin) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playFieldOrigin[0], 
      localOrigin[1] + playFieldOrigin[1] - 1
    ]
    return targetCoordOnPlayfield
  }
  
  down(localOrigin, playFieldOrigin) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playFieldOrigin[0] + 1, 
      localOrigin[1] + playFieldOrigin[1]
    ]
    return targetCoordOnPlayfield
  }

  /**
   * Passing in null for direction will return the current coords of the Tetrimino on the playfield
   */
  getTetriminoCoordsOnPlayfield(tetrimino, direction) {

    const coordsOnPlayfield = []
    const offLocalOriginCoords = tetrimino.orientations[tetrimino.currentOrientation].coordsOffOrigin
    const offPlayFieldOriginCoords = tetrimino.currentOriginOnPlayfield

    offLocalOriginCoords.forEach(localCoord => {
      let coord
      if (direction) {
        coord = this[direction](localCoord, offPlayFieldOriginCoords)
      } else {
        coord = [
          localCoord[0] + offPlayFieldOriginCoords[0], 
          localCoord[1] + offPlayFieldOriginCoords[1]
        ]
      }
      coordsOnPlayfield.push(coord)
    })
    
    return coordsOnPlayfield
  }

  moveOne(targetDirection, playField, tetrimino) {
    const oldCoordsOnPlayfield = this.getTetriminoCoordsOnPlayfield(tetrimino)
    const targetCoordsOnPlayfield = this.getTetriminoCoordsOnPlayfield(tetrimino, targetDirection)
    
    console.log(oldCoordsOnPlayfield)
    const playFieldCopy = makeCopy(playField)
    const playFieldNoTetrimino = this.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)
    const targetCoordsClear = this.gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino)

    if (!targetCoordsClear) {
      return {
        newPlayField: this.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetrimino.minoGraphic),
        newTetrimino: tetrimino,
        successfulMove: false
      }
    }
    return {
      newPlayField: this.addTetriminoToPlayField(targetCoordsOnPlayfield, playFieldCopy, tetrimino.minoGraphic),
      newTetrimino: this.updateTetrimino(makeCopy(tetrimino), targetDirection),
      successfulMove: true
    }

  }

  // SHARED METHODS

  gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino) {
    return targetCoordsOnPlayfield.every(coord => {
      if (playFieldNoTetrimino[coord[0]]) { // This coordinate exists in the playable space
        if (playFieldNoTetrimino[coord[0]][coord[1]] !== undefined) { // This square exists in the playable space
          if (playFieldNoTetrimino[coord[0]][coord[1]] === '[_]') { // This square is not yet occupied
            return true
          }
        }
      } 
      return false
    }) 
  }

  getLowestPlayfieldRowOfTetrimino(tetrimino) {
    const { currentOrientation } = tetrimino
    const { currentOriginOnPlayfield } = tetrimino
    const { lowestRowOffOrigin } = tetrimino.orientations[currentOrientation]

    return currentOriginOnPlayfield[0] + lowestRowOffOrigin
  }

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
      console.log(coord)
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