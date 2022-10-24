import { makeCopy } from "../../../utils/utils.js"
import { TetriminoMovementHandler } from "../TetriminoMovementHandler.js"
export class SuperRotationSystem extends TetriminoMovementHandler{

  constructor() {
    super()
    this.relativeOrientations = {
      north: { flipCounterClockwise: 'west', flipClockwise: 'east' },
      south: { flipCounterClockwise: 'east', flipClockwise: 'west' },
      east:  { flipCounterClockwise: 'north', flipClockwise: 'south' },
      west:  { flipCounterClockwise: 'south', flipClockwise: 'north' },
    }
  }

  flip(tetrimino, playerInput, playField) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)
    const oldCoordsOffOriginAndRotationPoints = tetrimino.orientations[currentOrientation]
    const targetCoordsOffOriginAndRotationPoints = tetrimino.orientations[targetOrientation]
    const targetCoordsOffOrigin = targetCoordsOffOriginAndRotationPoints.coordsOffOrigin

    let flipPoint = 1

    const oldCoordsOnPlayfield = oldCoordsOffOriginAndRotationPoints.coordsOffOrigin.map(oldCoordsOffOrigin => {
      return [tetrimino.currentOriginOnPlayfield[0] + oldCoordsOffOrigin[0], tetrimino.currentOriginOnPlayfield[1] + oldCoordsOffOrigin[1]]
    })

    let playFieldCopy = makeCopy(playField)

    while (flipPoint <= 5) {
      const startPoint = oldCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
      const endPoint = targetCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
      const offset = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)
      const targetCoordsOnPlayfield = this.getTargetPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset)
       
      playFieldCopy = this.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)

      if (!this.gridCoordsAreClearFlip(targetCoordsOnPlayfield, playFieldCopy)) {
        playFieldCopy = this.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldCopy, tetrimino.minoGraphic)
        flipPoint += 1
        continue
      }
      
      playFieldCopy = this.addTetriminoToPlayField(targetCoordsOnPlayfield, playFieldCopy, tetrimino.minoGraphic)
      const newTetrimino = this.updateTetrimino(tetrimino, playerInput, offset, targetOrientation) 

      return {
        newPlayField: playFieldCopy,
        newTetrimino: newTetrimino,
        successfulMove: true
      }
    }

    return {
      newPlayField: playFieldCopy, 
      newTetrimino: tetrimino,
      successfulMove: false
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

  gridCoordsAreClearFlip(targetCoordsOnPlayfield, playFieldNoTetrimino) {
    
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

}