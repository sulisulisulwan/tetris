import { makeCopy } from '../../utils/utils.js'

export default function flip(eventData) {

  const { playfield, currentTetrimino } = this.localState
  const { strokeType, action } = eventData

  if (strokeType === 'keydown' && this.localState.playerAction[action]) {
    return
  }

  const newState = makeCopy(this.localState)

  if (strokeType === 'keyup') {
    newState.playerAction[action] = false
    this.setAppState(newState)
    return
  }
  
  const { 
    newPlayfield, 
    newTetrimino,
    performedTSpin,
    performedTSpinMini 
  } = this.tetriminoMovementHandler[action](playfield, currentTetrimino)

  newState.scoringContextsForCompletion = this.localState.scoringContextsForCompletion

  if (performedTSpin) {
    
    newState.scoringContextsForCompletion.push({
      scoringMethodName: 'tSpinNoLineClear', 
      scoringData: {
        currentScore: this.localState.totalScore,
        currentLevel: this.localState.currentLevel
      }
    })
  }

  if (performedTSpinMini) {
    newState.scoringContextsForCompletion.push({
      scoringMethodName: 'tSpinMiniNoLineClear', 
      scoringData: {
        currentScore: this.localState.totalScore,
        currentLevel: this.localState.currentLevel
      }
    })
  }
  newState.performedTSpinMini = performedTSpinMini
  newState.performedTSpin = performedTSpin
  newState.playerAction[action] = true
  newState.currentTetrimino = newTetrimino
  newState.playfield = newPlayfield
  

  //TODO: This should account for movements that occur only after lockdown, not before.  This current logic will mistake pre lockdown scenarios as post lockdown
  // Think, at every point in time, the newTetriminoBaseRowIdx will === this.localState.lowestLockSurfaceRow
  const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
  if (
    newTetriminoBaseRowIdx <= this.localState.lowestLockSurfaceRow && 
    this.localState.postLockMode &&
    this.localState.extendedLockdownMovesRemaining > 0
    ) {
    clearTimeout(this.localState.lockTimeoutId)
    newState.lockTimeoutId = null
    newState.extendedLockdownMovesRemaining = this.localState.extendedLockdownMovesRemaining - 1
  }
  this.setAppState(newState)

}


