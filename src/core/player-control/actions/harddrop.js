import { makeCopy } from '../../utils/utils.js'

export default function harddrop(eventData) {

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

  newState.scoringContextsForCompletion = this.localState.scoringContextsForCompletion
  newState.scoringContextsForCompletion.push({
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