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

    const targetCoordsOffOrigin = tetrimino.orientations[targetOrientation].coordsOffOrigin

    const oldRotationPoints = tetrimino.orientations[currentOrientation].rotationPoints
    const targetRotationPoints = tetrimino.orientations[targetOrientation].rotationPoints

    const oldCoordsOnPlayfield = this.getTetriminoCoordsOnPlayfield(tetrimino)

    
    let playFieldCopy = makeCopy(playField)
    let flipPoint = 1
    
    while (flipPoint <= 5) {
      const startPoint = oldRotationPoints[flipPoint]
      const endPoint = targetRotationPoints[flipPoint]
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