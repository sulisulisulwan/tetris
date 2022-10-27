import { makeCopy } from "../../../utils/utils.js"
import { ClassicRotationSystem } from "./ClassicRS.js"
import { TSpinCalculator } from "./TSpinCalculator.js"
export class SuperRotationSystem extends ClassicRotationSystem {

  constructor() {
    super()
  }

  flip(tetrimino, playerInput, playfield) {
    const { currentOrientation, currentOriginOnPlayfield } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)

    const targetCoordsOffOrigin = tetrimino.orientations[targetOrientation].coordsOffOrigin

    const oldRotationPoints = tetrimino.orientations[currentOrientation].rotationPoints
    const targetRotationPoints = tetrimino.orientations[targetOrientation].rotationPoints

    const oldCoordsOnPlayfield = this.getTetriminoCoordsOnPlayfield(tetrimino)

    
    let playfieldCopy = makeCopy(playfield)
    let flipPoint = 1
    
    while (flipPoint <= 5) {
      const startPoint = oldRotationPoints[flipPoint]
      const endPoint = targetRotationPoints[flipPoint]
      const offset = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)
      const targetCoordsOnPlayfield = this.getTargetPlayfieldCoords(targetCoordsOffOrigin, currentOriginOnPlayfield, offset)
       
      const playfieldNoTetrimino = this.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)

      if (!this.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)) {
        playfieldCopy = this.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldCopy, tetrimino.minoGraphic)
        flipPoint += 1
        continue
      }

      // Determine if a t spin or mini t spin was performed
      let performedTSpin = null
      let performedMiniTSpin = null
      if (tetrimino.name === 'TTetrimino') {
        const tSpinTypes = TSpinCalculator.getTSpinType(targetOrientation, targetCoordsOnPlayfield, playfieldNoTetrimino)
        performedTSpin = tSpinTypes.performedTSpin
        performedMiniTSpin = tSpinTypes.performedMiniTSpin
      }

      return {
        newPlayfield: this.addTetriminoToPlayfield(targetCoordsOnPlayfield, playfieldNoTetrimino, tetrimino.minoGraphic),
        newTetrimino: this.updateTetrimino(tetrimino, playerInput, offset, targetOrientation) ,
        successfulMove: true,
        potentialTSpin: {
          performedTSpin,
          performedMiniTSpin
        }
      }
    }

    return {
      newPlayfield: playfieldCopy, 
      newTetrimino: tetrimino,
      successfulMove: false,
      potentialTSpin: null
    }
  }



}