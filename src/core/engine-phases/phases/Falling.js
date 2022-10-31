import BasePhase from "./BasePhase.js";

export default class Falling extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>>> FALLING PHASE')

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


    if (this.localState.fallIntervalId === null) {
      newState.fallIntervalId = this.setContinuousFallEvent()
    }

    if (Object.keys(newState).length === 0) {
      return
    }
    
    this.setAppState(newState)
  }

  setAutoRepeatDelayTimeout() {
    console.log('here')
    return setTimeout(this.unsetAutoRepeatDelayTimeoutId.bind(this), 300)
  }

  unsetAutoRepeatDelayTimeoutId() {
    this.setAppState({ autoRepeatDelayTimeoutId: null })
  }

  setContinuousFallEvent() {
    return setInterval(this.continuousFallEvent.bind(this), this.localState.fallSpeed)
  }

  setContinuousLeftOrRight(direction) {
    return setInterval(this.continuousLeftOrRight.bind(this), 50, direction)
  }

  continuousFallEvent() {
    
    const { playfield, currentTetrimino, fallIntervalId } = this.localState
    const newState = {}

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    
    if (successfulMove)  {

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

      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      newState.performedTSpin = false 
      newState.performedTSpinMini = false
      this.setAppState(newState)
      return
    }

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