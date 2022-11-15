import BasePhase from "./BasePhase";
import { makeCopy } from "../../utils/utils";
import { appStateIF, sharedHandlersIF, tetriminoIF } from "../../../interfaces";

export default class LockClassic extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  execute() {
    const newState = {} as appStateIF

    // If at the beginning of the lockdown phase (lockTimeout hasn't been set), set the lockdown timer
    if (!this.localState.lockTimeoutId) {
      newState.lockTimeoutId = setTimeout(this.lockDownTimeout.bind(this), 500)
      this.setAppState(newState)
      return
    }

    // Lockdown timer had already been set, so check if player has positioned the tetrimino to escape lock phase
    const tetriminoCopy = makeCopy(this.localState.currentTetrimino)
    const playfieldCopy = makeCopy(this.localState.playfield)

    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
    const playfieldNoTetrimino = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(oldCoordsOnPlayfield, playfieldCopy)
    const targetCoordsClear = this.tetriminoMovementHandler.gridCoordsAreClear(targetCoordsOnPlayfield, playfieldNoTetrimino)

    //If tetrimino can fall, cancel the lockdown timer and enter Fall phase
    if (targetCoordsClear) {
      clearTimeout(this.localState.lockTimeoutId)
      newState.currentGamePhase = 'falling'
      newState.lockTimeoutId = null
      this.setAppState(newState)
      return
    }

    // Otherwise, the lockdown timer is still ticking... Handle autorepeat player motions..
    const { override } = this.localState.playerAction.autoRepeat
    if (override) {
      if (this.localState[`${override}IntervalId` as keyof appStateIF] === null) {
        newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout()
        const intervalId = this.setContinuousLeftOrRight(override)
        override === 'left' ? newState.leftIntervalId = intervalId : newState.rightIntervalId = intervalId
      }
    } else {

      if (this.localState.playerAction.autoRepeat.right) {
        if (this.localState.rightIntervalId === null) {
          newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout()
          newState.rightIntervalId = this.setContinuousLeftOrRight('right')
        }
      }
  
      if (this.localState.playerAction.autoRepeat.left) {
        if (this.localState.leftIntervalId === null) {
          newState.autoRepeatDelayTimeoutId = this.setAutoRepeatDelayTimeout()
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

    const tetriminoCopy = makeCopy(this.localState.currentTetrimino)
    const playfieldCopy = makeCopy(this.localState.playfield)
    
    const newState = {} as appStateIF
    newState.currentTetrimino = tetriminoCopy
    newState.lockTimeoutId = null
    newState.playfield = this.localState.playfield

    // Final check if tetrimino should be granted falling status before permanent lock
    const oldCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy)
    const targetCoordsOnPlayfield = this.tetriminoMovementHandler.getPlayfieldCoords(tetriminoCopy, 'down')
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
      clearTimeout(this.localState.lockTimeoutId)
      newState.lockTimeoutId = null
      newState.currentGamePhase = 'gameOver'
      this.setAppState(newState)
      return
    }

    newState.currentGamePhase = 'pattern',
    newState.postLockMode = false
    this.setAppState(newState)
  }

  gameIsOver(currentTetrimino: tetriminoIF) {
    // Lock out - A whole tetrimino locks down above skyline
    const lowestPlayfieldRowOfTetrimino = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(currentTetrimino)
    const gameIsOver = lowestPlayfieldRowOfTetrimino < 20 ? true : false
    return gameIsOver
  }

  setAutoRepeatDelayTimeout() {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300)
  }

  unsetAutoRepeatDelayTimeoutId() {
    const newState = {} as appStateIF
    newState.autoRepeatDelayTimeoutId = null 
    this.setAppState(newState)
  }

  setContinuousLeftOrRight(direction: string) {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, direction)
  }

  continuousLeftOrRight(playerAction: string) {

    if (this.localState.autoRepeatDelayTimeoutId) { 
      return 
    }

    const { playfield, currentTetrimino } = this.localState
    const newState = {} as appStateIF

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(playerAction, playfield, currentTetrimino)
    
    if (successfulMove)  {
      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      this.setAppState(newState)
      return
    }

  }

}


      