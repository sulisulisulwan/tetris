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
    performedMiniTSpin 
  } = this.tetriminoMovementHandler[action](playfield, currentTetrimino)

  newState.scoringContextsForCompletion = this.localState.scoringContextsForCompletion
  if (performedTSpin) {
    newState.scoringContextsForCompletion.push([
      'tSpinNoLineClear', {
        currentScore: this.localState.totalScore,
        currentLevel: this.localState.currentLevel
      }
    ])
  }

  if (performedMiniTSpin) {
    newState.scoringContextsForCompletion.push([
      'tSpinMiniNoLineClear', {
        currentScore: this.localState.totalScore,
        currentLevel: this.localState.currentLevel
      }
    ])
  }
  newState.performedMiniTSpin = performedMiniTSpin
  newState.performedTSpin = performedTSpin
  newState.playerAction[action] = true
  newState.currentTetrimino = newTetrimino
  newState.playfield = newPlayfield
  this.setAppState(newState)

}


