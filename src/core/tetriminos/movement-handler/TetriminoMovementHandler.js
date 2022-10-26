import { makeCopy } from '../../utils/utils.js'

export class TetriminoMovementHandler {

  constructor() {}

  right(localOrigin, playfieldOrigin) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0], 
      localOrigin[1] + playfieldOrigin[1] + 1
    ]
    return targetCoordOnPlayfield
  }

  left(localOrigin, playfieldOrigin) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0], 
      localOrigin[1] + playfieldOrigin[1] - 1
    ]
    return targetCoordOnPlayfield
  }
  
  down(localOrigin, playfieldOrigin) {
    const targetCoordOnPlayfield = [
      localOrigin[0] + playfieldOrigin[0] + 1, 
      localOrigin[1] + playfieldOrigin[1]
    ]
    return targetCoordOnPlayfield
  }

  /**
   * Passing in null for direction will return the current coords of the Tetrimino on the playfield
   */
  getTetriminoCoordsOnPlayfield(tetrimino, direction) {

    const coordsOnPlayfield = []
    const offLocalOriginCoords = tetrimino.orientations[tetrimino.currentOrientation].coordsOffOrigin
    const offPlayfieldOriginCoords = tetrimino.currentOriginOnPlayfield

    offLocalOriginCoords.forEach(localCoord => {
      let coord
      if (direction) {
        coord = this[direction](localCoord, offPlayfieldOriginCoords)
      } else {
        coord = [
          localCoord[0] + offPlayfieldOriginCoords[0], 
          localCoord[1] + offPlayfieldOriginCoords[1]
        ]
      }
      coordsOnPlayfield.push(coord)
    })
    
    return coordsOnPlayfield
  }

  moveOne(targetDirection, playfield, tetrimino) {
    const oldCoordsOnPlayfield = this.getTetriminoCoordsOnPlayfield(tetrimino)
    const targetCoordsOnPlayfield = this.getTetriminoCoordsOnPlayfield(tetrimino, targetDirection)
    
    const playfieldCopy = makeCopy(playfield)
    const playfieldNoTetrimino = this.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    if (!targetCoordsClear) {
      return {
        newPlayfield: this.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldNoTetrimino, tetrimino.minoGraphic),
        newTetrimino: tetrimino,
        successfulMove: false
      }
    }
    return {
      newPlayfield: this.addTetriminoToPlayfield(targetCoordsOnPlayfield, playfieldCopy, tetrimino.minoGraphic),
      newTetrimino: this.updateTetrimino(makeCopy(tetrimino), targetDirection),
      successfulMove: true
    }

  }

  // SHARED METHODS

  gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino) {
    return targetCoordsOnPlayfield.every(coord => {
      if (playfieldNoTetrimino[coord[0]]) { // This coordinate exists in the playable space
        if (playfieldNoTetrimino[coord[0]][coord[1]] !== undefined) { // This square exists in the playable space
          if (playplayfieldNoTetriminoFieldNoTetrimino[coord[0]][coord[1]] === '[_]') { // This square is not yet occupied
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

  removeTetriminoFromPlayfield(coords, playfield) {
    coords.forEach(coord => {
      playfield[coord[0]][coord[1]] = '[_]'
    })
    return playfield
  }

  addTetriminoToPlayfield(tetriminoCoords, playfield, minoGraphic) {
    tetriminoCoords.forEach(coord => {
      playfield[coord[0]][coord[1]] = minoGraphic
    })
    return playfield
  }

}