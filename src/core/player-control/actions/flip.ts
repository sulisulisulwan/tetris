import { eventDataIF } from '../../../interfaces'
import { makeCopy } from '../../utils/utils'

export default function actionFlip(eventData: eventDataIF) {

  
  const { strokeType, action } = eventData

  if (strokeType === 'keydown' && this.localState.playerAction[action]) {
    return
  }

  const newState = makeCopy(this.localState)
  let { playfield, currentTetrimino } = newState

  if (strokeType === 'keyup') {
    newState.playerAction[action] = false
    this.setAppState(newState)
    return
  }
  
  // Remove the ghost tetrimino if that mode is on
  if (this.localState.ghostTetriminoOn) {
    playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(this.localState.ghostCoords, playfield)
  }

  const { 
    newPlayfield, 
    newTetrimino,
    performedTSpin,
    performedTSpinMini 
  } = this.tetriminoMovementHandler[action](playfield, currentTetrimino)

  newState.scoringItemsForCompletion = this.localState.scoringItemsForCompletion

  if (performedTSpin) {
    
    newState.scoringItemsForCompletion.push({
      scoringMethodName: 'tSpinNoLineClear', 
      scoringData: {
        currentScore: this.localState.totalScore,
        currentLevel: this.localState.currentLevel
      }
    })
  }

  if (performedTSpinMini) {
    newState.scoringItemsForCompletion.push({
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

  if (this.localState.ghostTetriminoOn) {
    const newGhostCoords = this.tetriminoMovementHandler.getGhostCoords(newTetrimino, newPlayfield)
    newState.ghostCoords = newGhostCoords
    newState.playfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(newGhostCoords, newPlayfield, '[g]')
  } else {
    newState.playfield = newPlayfield
  }

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


