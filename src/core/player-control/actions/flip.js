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

  console.log(    performedTSpin,
    performedTSpinMini )
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
  this.setAppState(newState)

}

