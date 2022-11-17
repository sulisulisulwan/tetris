import { appStateIF, sharedHandlersIF } from "../../../interfaces";
import BasePhase from "./BasePhase";
import ScoreItemFactory from "./ScoreItemFactory";

export default class FallingClassic extends BasePhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory(sharedHandlers)
  }

  execute() {

    const newState = {} as appStateIF

    // Handle autorepeat player actions
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

    // If entering Falling phase, set intervallic fall event
    if (this.localState.fallIntervalId === null) {
      newState.fallIntervalId = this.setContinuousFallEvent()
    }

    // If state hasn't changed, don't set state.
    if (Object.keys(newState).length === 0) {
      return
    }

  }

  setAutoRepeatDelayTimeout(): NodeJS.Timer {
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300)
  }

  unsetAutoRepeatDelayTimeoutId(): void {
    const newState = { autoRepeatDelayTimeoutId: null } as appStateIF
    this.setAppState(newState)
  }

  setContinuousLeftOrRight(direction: string): NodeJS.Timer {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, direction)
  }

  setContinuousFallEvent(): NodeJS.Timer {
    return setInterval(this.continuousFallEvent.bind(this), this.localState.fallSpeed)
  }

  continuousFallEvent(): void {
    
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
        const scoreItem = this.scoreItemFactory.getItem('softdrop', null)
        newState.totalScore = this.scoringHandler.updateScore(this.localState.totalScore, scoreItem)
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
    
    clearInterval(fallIntervalId)
    newState.fallIntervalId = null
    newState.currentGamePhase = 'lock'
    this.setAppState(newState)

  }

  continuousLeftOrRight(playerAction: string): void {

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