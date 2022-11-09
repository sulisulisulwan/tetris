import { appStateIF, sharedHandlersIF } from "../../../interfaces";
import BasePhase from "./BasePhase";

export default class FallingExtended extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  execute() {
    console.log('>>>> FALLING EXTENDED PHASE')

    const newState = {} as appStateIF

    // Kickoff motion intervals
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

    if (this.localState.fallIntervalId === null) {
      newState.fallIntervalId = this.setContinuousFallEvent()
    }

    // If state hasn't changed, don't set state.
    if (Object.keys(newState).length === 0) {
      return
    }
    
    this.setAppState(newState)
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

  setContinuousFallEvent() {
    return setInterval(this.continuousFallEvent.bind(this), this.localState.fallSpeed)
  }

  continuousFallEvent() {
    
    const newState = {} as appStateIF

    const { playfield, currentTetrimino, fallIntervalId } = this.localState

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)

    // If the Tetrimino can move down one row, update state with its new position
    if (successfulMove)  {

      // Handle softdrop scoring
      if (this.localState.playerAction.softdrop) {
        const scoreItem = { 
          scoringMethodName: 'softdrop', 
          scoringData: {}
        }
        newState.scoringHistoryPerCycle = this.localState.scoringHistoryPerCycle
        
        if (!newState.scoringHistoryPerCycle.softdrop) {
          newState.scoringHistoryPerCycle.softdrop = []
        }
        newState.scoringHistoryPerCycle.softdrop.push(scoreItem.scoringData)

        const currentScore = this.localState.totalScore
        newState.totalScore = this.scoringHandler.updateScore(currentScore, scoreItem)
      }

      // If new tetrimino row is the newest low, update the newest low and reset the extended move count
      const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
      if (newTetriminoBaseRowIdx > this.localState.lowestLockSurfaceRow) {
        newState.lowestLockSurfaceRow = newTetriminoBaseRowIdx
        newState.extendedLockdownMovesRemaining = 15
      }

      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      newState.performedTSpin = false 
      newState.performedTSpinMini = false
      newState.postLockMode = false

      // If new Tetrimino location has reached a surface, trigger lock phase
      const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', newPlayfield, newTetrimino)
      const tetriminoWillHaveReachedSurface = !successfulMove

      if (tetriminoWillHaveReachedSurface) {
        clearInterval(fallIntervalId)
        newState.fallIntervalId = null
        newState.currentGamePhase = 'lock'
      }

      this.setAppState(newState)
      return
    }
    
    // This catches a case where the 15 move extension has depleted and the Tetrimino freezes in place during falling phase
    clearInterval(fallIntervalId)
    newState.fallIntervalId = null
    newState.currentGamePhase = 'lock'
    this.setAppState(newState)

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