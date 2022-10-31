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
     * 
     * TODO: EXTENDED PLACEMENT LOCKDOWN
     * 
     * Tetrimino touches surface.  0.5 seconds lockdown timer starts
     * Player gets 15 move/rotate counter 
        - same aportioned counter used when on or above the lowest surface where the counter was first aportioned
          - Each move within the counter will reset lockdown timer.
          - Once all 15 used up, 
            - Tetrimino touching no surface below can still be moved around
            - Tetrimino touching surface locks down immediately
        - Counter resets to 15 if the Tetrimino falls below the surface. 


     */

    // If at the beginning of the lockdown phase (lockTimeout hasn't been set), 
    // note the index of the surface the Tetrimino is on, and set the lockdown timer
    if (!this.localState.lockTimeoutId) {
      newState.lowestLockSurfaceRow = tetriminoCurrentBaseRowIdx
      newState.lockTimeoutId = setTimeout(this.lockDownTimeout.bind(this), 500)
      this.setAppState(newState)
      return
    }

    //Lockdown timer has been set
    // Player has made a change so check if player has positioned tetrimino to escape lock phase
    const tetriminoCopy = this.localState.currentTetrimino
    const playfieldCopy = this.localState.playfield

    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

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
    const playfieldCopy = makeCopy(this.localState.playfield)
    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    const newState = {}

    if (targetCoordsClear) {
      const newPlayfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldNoTetrimino, tetriminoCopy.minoGraphic)
      
      newState.currentGamePhase = 'falling',
      newState.lockTimeoutId = null,
      newState.currentTetrimino = tetriminoCopy,
      newState.playfield = newPlayfield

      this.setAppState(newState)
      return
    }

    
    newState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(oldCoordsOnPlayfield, playfieldNoTetrimino, tetriminoCopy.minoGraphic)
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


      