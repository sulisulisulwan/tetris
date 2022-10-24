import { makeCopy } from "../../../utils/utils.js"
import { TetriminoMovementHandler } from "../TetriminoMovementHandler.js"
import { ClassicRotationSystem } from "./ClassicRS.js"
export class SuperRotationSystem extends ClassicRotationSystem {

  constructor() {
    super()
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
    let flipPoint = 1
    
    while (flipPoint <= 5) {
      const startPoint = oldCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
      const endPoint = targetCoordsOffOriginAndRotationPoints.rotationPoints[flipPoint]
      const offset = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)
      const targetCoordsOnPlayfield = this.getTargetPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset)
       
      const playFieldNoTetrimino = this.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)

      if (!this.gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino)) {
        playFieldCopy = this.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldCopy, tetrimino.minoGraphic)
        flipPoint += 1
        continue
      }

      return {
        newPlayField: this.addTetriminoToPlayField(targetCoordsOnPlayfield, playFieldNoTetrimino, tetrimino.minoGraphic),
        newTetrimino: this.updateTetrimino(tetrimino, playerInput, offset, targetOrientation) ,
        successfulMove: true
      }
    }

    return {
      newPlayField: playFieldCopy, 
      newTetrimino: tetrimino,
      successfulMove: false
    }
  }

}