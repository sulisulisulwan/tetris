import BasePhase from "./../phases/BasePhase.js";
import { makeCopy } from "../../utils/utils.js";

export default class Lock extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>>> LOCK PHASE')
    const newState = {}

    const tetriminoCurrentBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(this.localState.currentTetrimino)

    /**
     * TODO: Current code shouldn't be breaking.
     * tetriminoBaseRowIdx will be checked against  
     * if tetriminoCurrentBaseRowIdx is HIGHER than this.localState.lowestLockSurfaceRow
     * player can only use leftover time from previous lockTimeoutId
     * 
     * To implement this, we need to be able to grab the difference of time left in a
     * previous lockTimeout and pass it to the new setting of lockDownTimeout
     * 
     * This dynamic setTimeout duration value should be held in state and
     * must be updated at proper times to either the default lock duration 
     * or the difference duration depending on the situation
     * 
     * Set to default 0.5 seconds if:
     *   tetriminoCurrentBaseRowIdx < this.localState.lowestLockSurfaceRow
     *   OR this.localState.lowestLockSurfaceRow === null (this means its the first time the tetrimino has landed ever)
     *     update 
     *        lockTimeoutId -> new 0.5 second timeoutId
     *        lowestLockSurfaceRow -> tetriminoCurrentBaseRowIdx
     * 
     * Set to leftover seconds in all other cases
     */

    if (!this.localState.lockTimeoutId) {
      newState.lowestLockSurfaceRow = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(this.localState.currentTetrimino)
      newState.lockTimeoutId = setTimeout(this.lockDownTimeout.bind(this), 500)
      this.setAppState(newState)
      return
    }

    // Player has made a change so check if player has positioned tetrimino to escape lock phase
    const tetriminoCopy = this.localState.currentTetrimino
    const playFieldCopy = this.localState.playField

    const { oldCoordsOnPlayfield, targetCoordsOnPlayfield } = this.tetriminoMovementHandler.getOldAndTargetCoordsOnPlayField(tetriminoCopy, 'down')
    const playFieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino)

    if (targetCoordsClear) {
      clearTimeout(this.localState.lockTimeoutId)
      newState.currentGamePhase = 'falling'
      newState.lockTimeoutId = null
      this.setAppState(newState)
    }
    
  }

  lockDownTimeout() {

    clearTimeout(this.localState.lockTimeoutId)

    // Final check if tetrimino should be granted falling status before permanent lock
    const tetriminoCopy = makeCopy(this.localState.currentTetrimino)
    const playFieldCopy = makeCopy(this.localState.playField)
    const { oldCoordsOnPlayfield, targetCoordsOnPlayfield } = this.tetriminoMovementHandler.getOldAndTargetCoordsOnPlayField(tetriminoCopy, 'down')
    const playFieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playFieldNoTetrimino)
    
    const newState = {}

    if (targetCoordsClear) {
      const newPlayField = this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetriminoCopy.minoGraphic)
      
      newState.currentGamePhase = 'falling',
      newState.lockTimeoutId = null,
      newState.currentTetrimino = tetriminoCopy,
      newState.playField = newPlayField

      this.setAppState(newState)
      return
    }

    newState.playField = this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldNoTetrimino, tetriminoCopy.minoGraphic)
    tetriminoCopy.status = 'locked'
    newState.currentTetrimino = tetriminoCopy
    
    if (this.gameIsOver(tetriminoCopy)) {
      newState.currentGamePhase = 'gameOver'
      this.setAppState(newState)
      return
    }

    newState.currentGamePhase = 'pattern',
    newState.lowestLockSurfaceRow = null
    newState.lockTimeoutId = null,

    this.setAppState(newState)
  }

  gameIsOver(currentTetrimino) {
    // Lock out - A whole tetrimino locks down above skyline
    const lowestPlayfieldRowOfTetrimino = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(currentTetrimino)
    const gameIsOver = lowestPlayfieldRowOfTetrimino < 20 ? true : false
    return gameIsOver
  }

}


      