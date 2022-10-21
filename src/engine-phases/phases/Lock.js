import BasePhase from "./BasePhase.js";
import { makeCopy, gridCoordsAreClear, offsetCoordsToLineBelow } from "../../utils/utils.js";
import { TetriminoMovementHandler } from "../../components/tetriminos/TetriminoMovementHandler.js";

export default class Lock extends BasePhase {

  constructor() {
    super()
    this.tetriminoMovementHandler = new TetriminoMovementHandler()
    this.acquiredState = null
  }

  execute(stateData, setState) {
    // console.log('>>>> LOCK PHASE')
    this.setAcquiredState(stateData)

    if (this.acquiredState.playerAction.autoRepeat.right) {

    }
    // If Lock Phase has just been initiated, set lock timer
    if (!stateData.lockIntervalId) {
      setState(prevState => {
        return {
          ...prevState,
          lockIntervalId: setTimeout(this.lockDownTimeout.bind(this), 500, setState)
        }
      })
      return
    }

    // Player has made a change so check if player has positioned tetrimino to escape lock phase
    const tetriminoCopy = makeCopy(this.acquiredState.currentTetrimino)
    const playFieldCopy = makeCopy(this.acquiredState.playField)
    const { targetCoordsClear } = this.tetriminoMovementHandler.gridCoordsAreClear(tetriminoCopy, playFieldCopy, 'down')

    if (targetCoordsClear) {
      // if (targetCoords lowest point is lower or at the same level as oldCoords {
        clearTimeout(stateData.lockIntervalId)
        setState({
          currentGamePhase: 'falling',
          lockIntervalId: null
        })
      // } 
    }
    
  }

  lockDownTimeout(setState) {

    clearTimeout(this.acquiredState.lockIntervalId)

    // Final check if tetrimino should be granted falling status before permanent lock
    const tetriminoCopy = makeCopy(this.acquiredState.currentTetrimino)
    const playFieldCopy = this.acquiredState.playField
    const { 
      oldCoordsOnPlayfield,
      targetCoordsClear,
      playFieldNoTetrimino
    } = this.tetriminoMovementHandler.gridCoordsAreClear(tetriminoCopy, playFieldCopy, 'down')

    if (targetCoordsClear) {
      const newPlayField = this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetriminoCopy.minoGraphic)
      setState({
        currentGamePhase: 'falling',
        lockIntervalId: null,
        currentTetrimino: tetriminoCopy,
        playField: newPlayField
      })
      return
    }

    const newPlayField = this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetriminoCopy.minoGraphic)
    tetriminoCopy.status = 'locked'

    setState({
      currentGamePhase: 'pattern',
      lockIntervalId: null,
      currentTetrimino: tetriminoCopy,
      playField: playFieldCopy
    })
  }

  setAcquiredState(stateData) {
    this.acquiredState = stateData
  }
}

      //TODO:note: using the Super Rotation System, rotating a tetrimino often causes the y-coordinate of the tetrimino to increase, 
      //i.e., it “lifts up” off the Surface it landed on. the Lock down timer does not reset in this case, but it does stop 
      //counting down until the tetrimino lands again on a Surface that has the same (or higher) y-coordinate as it did before 
      //it was rotated. only if it lands on a Surface with a lower y-coordinate will the timer reset.