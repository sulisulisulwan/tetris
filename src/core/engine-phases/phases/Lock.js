import BasePhase from "./../phases/BasePhase.js";
import { makeCopy } from "../../utils/utils.js";

export default class Lock extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute(appState, setAppState) {
    // console.log('>>>> LOCK PHASE')
    this.syncToLocalState(appState)

    // If Lock Phase has just been initiated, set lock timer
    if (!appState.lockIntervalId) {
      setAppState(prevState => {
        return {
          ...prevState,
          lockIntervalId: setTimeout(this.lockDownTimeout.bind(this), 500, setAppState)
        }
      })
      return
    }

    // Player has made a change so check if player has positioned tetrimino to escape lock phase
    const tetriminoCopy = this.localState.currentTetrimino
    const playFieldCopy = this.localState.playField

    const { oldCoordsOnPlayfield, targetCoordsOnPlayfield } = this.tetriminoMovementHandler.getOldAndTargetCoordsOnPlayField(tetriminoCopy, 'down')
    const playFieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino)

    if (targetCoordsClear) {
      /**
       * if (targetCoords lowest point is lower or at the same level as oldCoords {
       * TODO: this ^^ will requires 
       *    - a new field for tetrimino for each orientation that keeps track of lowest point of tetrimino in that orientation
       *    - a new field for state which keeps track of the lowest point before rotation
       */
        clearTimeout(appState.lockIntervalId)
        setAppState({
          currentGamePhase: 'falling',
          lockIntervalId: null,
          // potential new field for tracking lowest point before rotation
        })
    
    }
    
  }

  lockDownTimeout(setAppState) {

    clearTimeout(this.localState.lockIntervalId)

    // Final check if tetrimino should be granted falling status before permanent lock
    const tetriminoCopy = makeCopy(this.localState.currentTetrimino)
    const playFieldCopy = makeCopy(this.localState.playField)
    const { oldCoordsOnPlayfield, targetCoordsOnPlayfield } = this.tetriminoMovementHandler.getOldAndTargetCoordsOnPlayField(tetriminoCopy, 'down')
    const playFieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino)
    

    if (targetCoordsClear) {
      const newPlayField = this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetriminoCopy.minoGraphic)
      setAppState({
        currentGamePhase: 'falling',
        lockIntervalId: null,
        currentTetrimino: tetriminoCopy,
        playField: newPlayField
      })
      return
    }

    const newPlayField = this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetriminoCopy.minoGraphic)
    tetriminoCopy.status = 'locked'
    setAppState({
      currentGamePhase: 'pattern',
      lockIntervalId: null,
      currentTetrimino: tetriminoCopy,
      playField: newPlayField
    })
  }
}

/**
 * TODO:note: using the Super Rotation System, rotating a tetrimino often causes the y-coordinate of the tetrimino to increase, 
 * i.e., it “lifts up” off the Surface it landed on. the Lock down timer does not reset in this case, but it does stop 
 * counting down until the tetrimino lands again on a Surface that has the same (or higher) y-coordinate as it did before 
 * it was rotated. only if it lands on a Surface with a lower y-coordinate will the timer reset.
 */

      