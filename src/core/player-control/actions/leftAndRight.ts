import { appStateIF, autoRepeatIF, eventDataIF } from "../../../interfaces"

export default function leftAndRight(eventData: eventDataIF) {
  const { playerAction, playfield, currentTetrimino } = this.localState
  const { autoRepeat } = playerAction
  let { override } = autoRepeat
  const { strokeType, action } = eventData
  
  const newState = {} as appStateIF

  newState.playerAction = this.localState.playerAction

  if (strokeType === 'keyup') {
    clearInterval(this.localState[`${action}IntervalId`])
    if (this.localState.autoRepeatDelayTimeoutId) {
      clearTimeout(this.localState.autoRepeatDelayTimeoutId)
    }

    newState.playerAction.autoRepeat.override = null

    action === 'left' ? newState.leftIntervalId = null : newState.rightIntervalId = null
    action === 'left' ? newState.playerAction.autoRepeat.left = false : newState.playerAction.autoRepeat.right = false  
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

    if (action === 'left') {
      newState.playerAction.autoRepeat.left = true  
    } else if (action === 'right') {
      newState.playerAction.autoRepeat.right = true
    }
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

      //TODO: This should account for movements that occur only after lockdown, not before.  This current logic will mistake pre lockdown scenarios as post lockdown
      // Think, at every point in time, the newTetriminoBaseRowIdx will === this.localState.lowestLockSurfaceRow
      const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)
      console.log(newTetriminoBaseRowIdx <= this.localState.lowestLockSurfaceRow, this.localState.postLockMode)
      if (
        newTetriminoBaseRowIdx <= this.localState.lowestLockSurfaceRow && 
        this.localState.postLockMode &&
        this.localState.extendedLockdownMovesRemaining > 0
      ) {
        clearTimeout(this.localState.lockTimeoutId)
        newState.lockTimeoutId = null
        newState.extendedLockdownMovesRemaining = this.localState.extendedLockdownMovesRemaining - 1
      }
    }
  
  }

  this.setAppState(newState)
}
