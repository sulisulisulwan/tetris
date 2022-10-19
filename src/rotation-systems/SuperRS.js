import { gridCoordsAreClear, makeCopy } from '../utils/utils.js'

export class SuperRotationSystem {

  constructor() {
    this.relativeOrientations = {
      north: { flipCounterClockwise: 'west', flipClockwise: 'east' },
      south: { flipCounterClockwise: 'east', flipClockwise: 'west' },
      east:  { flipCounterClockwise: 'north', flipClockwise: 'south' },
      west:  { flipCounterClockwise: 'south', flipClockwise: 'north' },
    }
  }

  flip(tetrimino, playerInput, currPlayField) {
    return this.tryFlipPoints(tetrimino, playerInput, currPlayField)
  }

  tryFlipPoints(tetrimino, playerInput, playField) {
    
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)
    

    const oldCoordsOffOriginAndRotationPoints = tetrimino.orientations[currentOrientation]
    const targetCoordsOffOriginAndRotationPoints = tetrimino.orientations[targetOrientation]

    const targetCoordsOffOrigin = targetCoordsOffOriginAndRotationPoints.coordsOffOrigin

    let flipPoint = 1

    // Get the actual coordinates of each mino on the current playfield
    const oldCoordsOnPlayfield = oldCoordsOffOriginAndRotationPoints.coordsOffOrigin.map(oldCoordsOffOrigin => {
      // Coordinate of tetrimino grid origin on playfield   +   Offset of each mino from that origin   
      return [tetrimino.currentOriginOnPlayfield[0] + oldCoordsOffOrigin[0], tetrimino.currentOriginOnPlayfield[1] + oldCoordsOffOrigin[1]]
    })


    while (flipPoint <= 5) {
      // Get old and new coordinates
      const startPoint = oldCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
      const endPoint = targetCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]

      const offset = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)

      // Take 
      const targetCoordsOnPlayfield = this.getTargetPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset)
       
      
      // Clear out old coordinates to test new coordinates
      oldCoordsOnPlayfield.forEach(coord => {
          playField[coord[0]][coord[1]] = '[_]'
      })



      if (!gridCoordsAreClear(targetCoordsOnPlayfield, playField)) {
        // Revert to old coordinates if failed
        oldCoordsOnPlayfield.forEach(coord => {
          playField[coord[0]][coord[1]] = tetrimino.minoGraphic
        })
        flipPoint += 1
        continue
      }
      
      // Update tetrimino object
      tetrimino = this.updateTetrimino(tetrimino, offset, targetOrientation) 

      // Update playfield
      targetCoordsOnPlayfield.forEach(coord => {
        playField[coord[0]][coord[1]] = tetrimino.minoGraphic
      })

      return {
        newPlayField: playField,
        newTetrimino: tetrimino,
        successfulMove: true
      }
    }

    return {
      newPlayField: playField, 
      newTetrimino: tetrimino,
      successfulMove: false
    }
  }

  updateTetrimino(tetrimino, offset, targetOrientation) {
    const [oldVertical, oldHorizontal] = tetrimino.currentOriginOnPlayfield
    tetrimino.currentOriginOnPlayfield = [oldVertical + offset[0], oldHorizontal + offset[1]]
    tetrimino.currentOrientation = targetOrientation
    return tetrimino
  }

  getTargetOrientation(currentOrientation, flipDirection) {
    return this.relativeOrientations[currentOrientation][flipDirection]
  }

  getTargetPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset) {
    
    const [verticalOrigin, horizontalOrigin] = currentOriginOnPlayfield
    const [verticalOffset, horizontalOffset] = offset
    return targetCoordsOffOrigin.map(pointCoords => [pointCoords[0] + verticalOrigin + verticalOffset, pointCoords[1] + horizontalOrigin + horizontalOffset])
  }

  calculateOffsetTowardsStartPoint(startPoint, endPoint) {
    const [ startX, startY ] = startPoint
    const [ endX, endY ] = endPoint
    return [ startX - endX, startY - endY]
  }

}