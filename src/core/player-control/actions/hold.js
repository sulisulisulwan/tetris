export default function hold(eventData) {

  const { strokeType } = eventData

  // If player is holding down key after initial press, negate keydown event fires
  if (strokeType === 'keydown' && this.localState.playerAction.hold) {
    return
  }

  let { swapStatus } = this.localState.holdQueue
  if (swapStatus === 'swapAvailableNextTetrimino') {
    return
  }

  const newState = {}
  newState.playerAction = this.localState.playerAction

  if (strokeType === 'keyup') {
    newState.playerAction.hold = false
    this.setAppState(newState)
  }
  /**
   * Two swapStatus states exist:
   *   'swapAvailableNow' (default) - Hitting swap key will trigger swap
   *   'justSwapped' - Interim state between hold event and the Generation phase it triggers
   *   'swapAvailableNextTetrimino' - State during the falling phase of the generatec tetrimino after swap occured 
   */

  if (swapStatus === 'swapAvailableNow') {

    let { heldTetrimino } = this.localState.holdQueue
    const { currentTetrimino, playfield } = this.localState

    // Remove the swapped out tetrimino from the playfield
    const currentTetriminoCoordsOnPlayfield = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(currentTetrimino)
    newState.playfield = this.tetriminoMovementHandler.removeTetriminoFromPlayfield(currentTetriminoCoordsOnPlayfield, playfield)

    // Generate a new tetrimino of the current one to put in the hold queue
    newState.currentGamePhase = 'generation'
    newState.playerAction.hold = strokeType === 'keyup' ? false : true
    newState.holdQueue = {
      swapStatus: 'justSwapped',
      heldTetrimino: this.tetriminoFactory.resetTetrimino(currentTetrimino)
    }
    newState.currentTetrimino = heldTetrimino
    
    this.setAppState(newState)
    return
  }

  // For all other cases...
  newState.playerAction.hold = false
  this.setAppState(newState)
}
