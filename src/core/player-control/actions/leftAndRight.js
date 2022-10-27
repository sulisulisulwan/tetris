import { makeCopy } from '../../utils/utils.js'

export default function leftAndRight(eventData) {
  const { playerAction, playfield, currentTetrimino } = this.localState
  const { autoRepeat } = playerAction
  let { right, left, override } = autoRepeat
  const { strokeType, action } = eventData

  // Determine what action will be taken.  Override always determines this.
  if (strokeType === 'keydown') {
    action === 'left' ? left = true : right = true
    action === 'left' ? override = 'left' : override = 'right'
  } else if (strokeType === 'keyup') {
    if (action === 'left') {
      left = false
      override = right ? 'right' : null
    } else if (action === 'right') {
      right = false
      override = left ? 'left' : null
    }
  }

  const newState = makeCopy(this.localState)
  // Validate and apply the override action
  if (override === 'left') {

    const { newPlayfield, newTetrimino } = this.tetriminoMovementHandler.moveOne('left', playfield, currentTetrimino)
    
    newState.playfield = newPlayfield
    newState.currentTetrimino = newTetrimino
    newState.playerAction.autoRepeat.override = override
    newState.playerAction.autoRepeat.left = left ? left : newState.playerAction.autoRepeat.left
    newState.playerAction.autoRepeat.right = right ? right : newState.playerAction.autoRepeat.right

    this.setAppState(newState)

  } else if (override === 'right') {
    const { newPlayfield, newTetrimino } = this.tetriminoMovementHandler.moveOne('right', playfield, currentTetrimino)
    newState.playfield = newPlayfield
    newState.currentTetrimino = newTetrimino
    newState.playerAction.autoRepeat.override = override
    newState.playerAction.autoRepeat.left = left ? left : newState.playerAction.autoRepeat.left
    newState.playerAction.autoRepeat.right = right ? right : newState.playerAction.autoRepeat.right

    this.setAppState(newState)

  } else if (override === null) {
    newState.playerAction.autoRepeat.override = override
    newState.playerAction.autoRepeat.left = left ? left : false
    newState.playerAction.autoRepeat.right = right ? right : false

    this.setAppState(newState)
  }

  return
}