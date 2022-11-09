import { eventDataIF } from '../../../interfaces'
import { makeCopy } from '../../utils/utils'

export default function harddrop(eventData: eventDataIF) {

  const { strokeType } = eventData

  if (strokeType === 'keydown' && this.localState.playerAction.harddrop) {
    return
  }
  const newState = makeCopy(this.localState)

  if (strokeType === 'keyup') {
    newState.playerAction.harddrop = false
    this.setAppState(newState)
    return
  }

  let { playfield, currentTetrimino } = newState
  let keepDropping = true
  let linesDropped = 0

  while (keepDropping) {
    const {       
      newPlayfield,
      newTetrimino,
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)

    playfield = newPlayfield
    currentTetrimino = newTetrimino

    if (!successfulMove) {
      keepDropping = false
    }

    linesDropped += 1
  }

  const scoringData = {
    currentScore: this.localState.totalScore,
    linesDropped
  }

  newState.scoringItemsForCompletion = this.localState.scoringItemsForCompletion
  newState.scoringItemsForCompletion.push({
    scoringMethodName: 'harddrop',
    scoringData
  })
  

  newState.scoringHistoryPerCycle = this.localState.scoringHistoryPerCycle
  newState.scoringHistoryPerCycle.harddrop = scoringData
  newState.playerAction.harddrop = true
  newState.currentGamePhase = 'pattern'
  newState.playfield = playfield
  newState.currentTetrimino = currentTetrimino

  this.setAppState(newState)
}