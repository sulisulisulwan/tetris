export default function leftAndRight(eventData) {
  const { playerAction, playfield, currentTetrimino } = this.localState
  const { autoRepeat } = playerAction
  let { right, left, override } = autoRepeat
  const { strokeType, action } = eventData
  
  const newState = {}

  newState.playerAction = this.localState.playerAction

  if (strokeType === 'keyup') {
    clearInterval(this.localState[`${action}IntervalId`])

    // override = action === 'left' ? (right ? 'right' : null)
    //   : (left ? 'left' : null)
    newState.playerAction.autoRepeat.override = null
    newState[`${action}IntervalId`] = null
    newState.playerAction.autoRepeat[action] = false
    this.setAppState(newState)
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

    const { playfield, currentTetrimino } = this.localState
  
    const { 
      newPlayfield, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne(action, playfield, currentTetrimino)
  
    if (successfulMove)  {
      newState.currentTetrimino = newTetrimino
      newState.playfield = newPlayfield
    }

    newState.playerAction.autoRepeat[action] = true

    newState.playerAction.autoRepeat.override = this.localState.playerAction.autoRepeat[oppositeAction] ? action : null

    this.setAppState(newState)
  } 

}



// export default function leftAndRight(eventData) {
//   const { playerAction, playfield, currentTetrimino } = this.localState
//   const { autoRepeat } = playerAction
//   let { right, left, override } = autoRepeat
//   const { strokeType, action } = eventData

//   // Determine what action will be taken.  Override always determines this.
//   if (strokeType === 'keydown') {
//     action === 'left' ? left = true : right = true
//     action === 'left' ? override = 'left' : override = 'right'
//   } else if (strokeType === 'keyup') {
//     if (action === 'left') {
//       left = false
//       override = right ? 'right' : null
//     } else if (action === 'right') {
//       right = false
//       override = left ? 'left' : null
//     }
//   }

//   const newState = makeCopy(this.localState)
//   // Validate and apply the override action
//   if (override === 'left') {

//     if (newState.rightIntervalId) {
//       clearInterval(rightIntervalId)
//       newState.rightIntervalId = null
//     }

//     if (!this.localState.leftIntervalId) {
//       newState.leftIntervalId = setInterval(leftAction.bind(this), .4)
//     }

//   } else if (override === 'right') {
//     if (newState.leftIntervalId) {
//       clearInterval(leftIntervalId)
//       newState.leftIntervalId = null
//     }

//     if (!this.localState.rightIntervalId) {
//       newState.rightIntervalId = setInterval(rightAction.bind(this), .4)
//     }

//   } else if (override === null) {
//     if (newState.rightIntervalId) {
//       clearInterval(rightIntervalId)
//       newState.rightIntervalId = null
//     }
//     if (newState.leftIntervalId) {
//       clearInterval(leftIntervalId)
//       newState.leftIntervalId = null
//     }
//     newState.playerAction.autoRepeat.override = override
//     newState.playerAction.autoRepeat.left = left ? left : false
//     newState.playerAction.autoRepeat.right = right ? right : false
//     this.setAppState(newState)

    

//   }

//   return
// }
