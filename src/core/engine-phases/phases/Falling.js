import BasePhase from "./BasePhase.js";

export default class Falling extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    console.log('>>>> FALLING PHASE')

    const newState = {}

    // Kickoff motion intervals
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

    console.log(this.localState.fallIntervalId  )
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
    this.setAppState({ autoRepeatDelayTimeoutId: null })
  }

  setContinuousLeftOrRight(direction) {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, direction)
  }

  setContinuousFallEvent() {
    return setInterval(this.continuousFallEvent.bind(this), this.localState.fallSpeed)
  }

  continuousFallEvent() {
    
    const newState = {}

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
        const scoreData = { currentScore: this.localState.totalScore }
        const scoreItem = { 
          scoringMethodName: 'softdrop', 
          scoreData 
        }
        newState.scoringHistoryPerCycle = this.localState.scoringHistoryPerCycle
        
        if (!newState.scoringHistoryPerCycle.softdrop) {
          newState.scoringHistoryPerCycle.softdrop = []
        }
        newState.scoringHistoryPerCycle.softdrop.push(scoreData)
        newState.totalScore = this.scoringHandler.updateScore(this.localState.totalScore, scoreItem)
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