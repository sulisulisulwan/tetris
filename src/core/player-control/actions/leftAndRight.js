export default function leftAndRight(eventData) {
  const { playerAction, playfield, currentTetrimino } = this.localState
  const { autoRepeat } = playerAction
  let { override } = autoRepeat
  const { strokeType, action } = eventData
  
  const newState = {}

  newState.playerAction = this.localState.playerAction

  if (strokeType === 'keyup') {
    clearInterval(this.localState[`${action}IntervalId`])
    if (this.localState.autoRepeatDelayTimeoutId) {
      clearTimeout(this.localState.autoRepeatDelayTimeoutId)
    }

    newState.playerAction.autoRepeat.override = null
    newState[`${action}IntervalId`] = null
    newState.playerAction.autoRepeat[action] = false
    // this.setAppState(newState)
  }


  // Determine what action will be taken.  Override always determines this.
  if (strokeType === 'keydown') {

    if (this.localState.playerAction.autoRepeat[action] && override === action) {
      return
    }

    const oppositeAction = action === 'left' ? 'right' : 'left'

    // If there is a preexisting action in motion and override will switch to opposite action
    if (this.localState[`${oppositeAction}IntervalId`]) {
      clearInterval(this.localState[`${oppositeAction}IntervalId`])
      newState[`${oppositeAction}IntervalId`] = null
    }

    newState.playerAction.autoRepeat[action] = true
    newState.playerAction.autoRepeat.override = newState.playerAction.autoRepeat[oppositeAction] ? action : null
  } 

  // Execute the action if there is an action to be executed
  if (newState.playerAction.autoRepeat.override 
    || newState.playerAction.autoRepeat.left 
    || newState.playerAction.autoRepeat.right
  ) {

    const { override, left } = newState.playerAction.autoRepeat
    let direction = override ? override : (left ? 'left' : 'right')

    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(direction, playfield, currentTetrimino)
  
    if (successfulMove)  {
      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
      newState.extendedLockdownMovesRemaining = this.localState.extendedLockdownMovesRemaining - 1
    }
  
  }

  this.setAppState(newState)


}
