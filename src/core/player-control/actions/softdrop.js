import { makeCopy } from '../../utils/utils.js'

export default function softdrop(eventData) {
    
  const { strokeType } = eventData
  const { softdrop } = this.localState.playerAction
  const { playfield, currentTetrimino } = this.localState

  const newState = {}
  if (strokeType === 'keyup')  {
    
    // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
    clearInterval(this.localState.fallIntervalId)
    newState.fallIntervalId = null
    newState.fallSpeed = this.localState.fallSpeed / .02
    newState.playerAction = this.localState.playerAction
    newState.playerAction.softdrop = false
    this.setAppState(newState)
    return
  }


  if (strokeType === 'keydown')  {

    if (softdrop) {
      // Let softdrop continue in the engine
      return
    }

    const newState = makeCopy(this.localState)
    const { newPlayfield, newTetrimino } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
    
    // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
    clearInterval(this.localState.fallIntervalId)

    newState.fallIntervalId = null
    newState.fallSpeed = this.localState.fallSpeed * .02
    newState.playfield = newPlayfield
    newState.currentTetrimino = newTetrimino
    newState.playerAction.softdrop = true
    this.setAppState(newState)
    return
  }

}