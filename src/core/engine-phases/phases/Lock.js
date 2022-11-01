import BasePhase from "./../phases/BasePhase.js";
import { makeCopy } from "../../utils/utils.js";

export default class Lock extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    console.log('>>>> LOCK PHASE')
    const newState = {}

    // First check that extended moves have been used up, and call for lockdown immediately if it's the case
    if (this.localState.extendedLockdownMovesRemaining <= 0) {
      this.lockDownTimeout()
    }

    // If at the beginning of the lockdown phase (lockTimeout hasn't been set), set the lockdown timer
    if (!this.localState.lockTimeoutId) {

      newState.postLockMode = true
      newState.lockTimeoutId = setTimeout(this.lockDownTimeout.bind(this), 500)
      this.setAppState(newState)
      return
    }

    // Lockdown timer had already been set, extended moves still exist, and player has made a change, 
    // so check if player has positioned the tetrimino to escape lock phase
    const tetriminoCopy = makeCopy(this.localState.currentTetrimino)
    const playfieldCopy = makeCopy(this.localState.playfield)

    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    //If tetrimino can fall, cancel the lockdown timer and enter Fall phase
    if (targetCoordsClear) {
      clearTimeout(this.localState.lockTimeoutId)
      newState.currentGamePhase = 'falling'
      newState.lockTimeoutId = null
      this.setAppState(newState)
    }

    // Otherwise, the lockdown timer is still ticking... Handle player motions..
    const { override } = this.localState.playerAction.autoRepeat
    if (override) {
      if (this.localState[`${override}IntervalId`] === null) {
        newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout('right')
        newState[`${override}IntervalId`] = this.setContinuousLeftOrRight(override)
      }
    } else {

      if (this.localState.playerAction.autoRepeat.right) {
        if (this.localState.rightIntervalId === null) {
          newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout('right')
          newState.rightIntervalId = this.setContinuousLeftOrRight('right')
        }
      }
  
      if (this.localState.playerAction.autoRepeat.left) {
        if (this.localState.leftIntervalId === null) {
          newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout('right')
          newState.leftIntervalId = this.setContinuousLeftOrRight('left')
        }
      }
    }

    if (Object.keys(newState).length === 0) {
      return
    }
    
    this.setAppState(newState)

  }


  lockDownTimeout() {

    // Lockdown timer has run out, so we clear the timer..
    clearTimeout(this.localState.lockTimeoutId)

    // console.log(this.localState)
    const tetriminoCopy = makeCopy(this.localState.currentTetrimino)
    const playfieldCopy = makeCopy(this.localState.playfield)
    
    const newState = {}
    newState.currentTetrimino = tetriminoCopy
    newState.lockTimeoutId = null
    newState.playfield = this.localState.playfield

    // Final check if tetrimino should be granted falling status before permanent lock
    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)
    
    if (targetCoordsClear) {
      // Grant falling status if there is no surface below.
      newState.currentGamePhase = 'falling',
      this.setAppState(newState)
      return
    }

    newState.currentTetrimino.status = 'locked'
    
    if (this.gameIsOver(tetriminoCopy)) {
      newState.currentGamePhase = 'gameOver'
      this.setAppState(newState)
      return
    }

    console.log('here', this.localState.extendedLockdownMovesRemaining)

    newState.currentGamePhase = 'pattern',
    newState.postLockMode = false
    this.setAppState(newState)
  }

  gameIsOver(currentTetrimino) {
    // Lock out - A whole tetrimino locks down above skyline
    const lowestPlayfieldRowOfTetrimino = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(currentTetrimino)
    const gameIsOver = lowestPlayfieldRowOfTetrimino < 20 ? true : false
    return gameIsOver
  }

  setAutoRepeatDelayTimeout() {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300)
  }

  unsetAutoRepeatDelayTimeoutId() {
    this.setAppState({ autoRepeatDelayTimeoutId: null })
  }

  setContinuousLeftOrRight(direction) {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, direction)
  }

  continuousLeftOrRight(action) {

    if (this.localState.autoRepeatDelayTimeoutId) { 
      return 
    }

    const { playfield, currentTetrimino } = this.localState
    const newState = {}

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(action, playfield, currentTetrimino)
    
    if (successfulMove)  {
      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      this.setAppState(newState)
      return
    }

  }

}


      