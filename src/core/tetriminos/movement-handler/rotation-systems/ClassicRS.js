import { makeCopy } from "../../../utils/utils.js"
import { TetriminoMovementHandler } from "../TetriminoMovementHandler.js"
export class ClassicRotationSystem extends TetriminoMovementHandler{

  constructor() {
    super()
    this.relativeOrientations = {
      north: { flipCounterClockwise: 'west', flipClockwise: 'east' },
      south: { flipCounterClockwise: 'east', flipClockwise: 'west' },
      east:  { flipCounterClockwise: 'north', flipClockwise: 'south' },
      west:  { flipCounterClockwise: 'south', flipClockwise: 'north' },
    }
  }

  flipClockwise(playField, tetrimino) {
    return this.flip(tetrimino, 'flipClockwise', playField)
  }
  
  flipCounterClockwise(playField, tetrimino) {
    return this.flip(tetrimino, 'flipCounterClockwise', playField)
  }

  flip(tetrimino, playerInput, playField) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)
    const oldCoordsOffOriginAndRotationPoints = tetrimino.orientations[currentOrientation]
    const targetCoordsOffOriginAndRotationPoints = tetrimino.orientations[targetOrientation]
    const targetCoordsOffOrigin = targetCoordsOffOriginAndRotationPoints.coordsOffOrigin

    const oldCoordsOnPlayfield = oldCoordsOffOriginAndRotationPoints.coordsOffOrigin.map(oldCoordsOffOrigin => {
      return [tetrimino.currentOriginOnPlayfield[0] + oldCoordsOffOrigin[0], tetrimino.currentOriginOnPlayfield[1] + oldCoordsOffOrigin[1]]
    })
    
    let playFieldCopy = makeCopy(playField)

    const flipPoint = 1
    const startPoint = oldCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
    const endPoint = targetCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
    const offset = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)
    const targetCoordsOnPlayfield = this.getTargetPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset)
      
    const playFieldNoTetrimino = this.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)

    if (!this.gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino)) {
      playFieldCopy = this.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldCopy, tetrimino.minoGraphic)
      return {
        newPlayField: playFieldCopy, 
        newTetrimino: tetrimino,
        successfulMove: false
      }
    }

    return {
      newPlayField: this.addTetriminoToPlayField(targetCoordsOnPlayfield, playFieldNoTetrimino, tetrimino.minoGraphic),
      newTetrimino: this.updateTetrimino(tetrimino, playerInput, offset, targetOrientation) ,
      successfulMove: true
    }
  
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