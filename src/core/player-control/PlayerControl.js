import { TetriminoFactory } from "../tetriminos/TetriminoFactory.js"
import { makeCopy } from "../utils/utils.js"
import { SharedScope } from "../SharedScope.js"

export class PlayerControl extends SharedScope {

  constructor(sharedHandlers) {
    super(sharedHandlers)
    this.tetriminoFactory = TetriminoFactory
    this.keystrokeMap = new Map([
      ['ArrowLeft','left'],
      ['num4','left'],
      ['ArrowRight','right'],
      ['num6','right'],
      ['ArrowDown','softdrop'],
      [' ','harddrop'],
      ['num8','harddrop'],
      ['ArrowUp','flipClockwise'],
      ['x','flipClockwise'],
      ['num1','flipClockwise'],
      ['num5','flipClockwise'],
      ['num9','flipClockwise'],
      ['Control','flipCounterClockwise'],
      ['z','flipCounterClockwise'],
      ['num3','flipCounterClockwise'],
      ['num7','flipCounterClockwise'],
      ['Shift','hold'],
      ['c','hold'],
      ['num0','hold'],
      ['F1','pausegame'],
      ['Escape','pausegame'],
    ])
  }

  keystrokeHandler(appState, e) {

    this.syncToLocalState(appState)

    if (!['falling', 'lock'].includes(this.localState.currentGamePhase)) {
      return 
    }
    
    const eventData = {
      key: e.key,
      strokeType: e.type
    }

    const action = this.keystrokeMap.get(eventData.key)

    if (!action || this.localState.currentTetrimino.status === 'locked') {
      return
    }

    eventData.action = action
    this[action](eventData)
  }

  left(eventData) {
    this.leftAndRight(eventData)
  }

  right(eventData) {
    this.leftAndRight(eventData)
  }

  flipCounterClockwise(eventData) {
    this.flip(eventData)
  }
  
  flipClockwise(eventData) {
    this.flip(eventData)
  }

  leftAndRight(eventData) {
    const { playerAction, playField, currentTetrimino } = this.localState
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

      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('left', playField, currentTetrimino)
      
      newState.playField = newPlayField
      newState.currentTetrimino = newTetrimino
      newState.playerAction.autoRepeat.override = override
      newState.playerAction.autoRepeat.left = left ? left : newState.playerAction.autoRepeat.left
      newState.playerAction.autoRepeat.right = right ? right : newState.playerAction.autoRepeat.right

      this.setAppState(newState)

    } else if (override === 'right') {
      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('right', playField, currentTetrimino)
      newState.playField = newPlayField
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

  flip(eventData) {

    const { playField, currentTetrimino } = this.localState
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
    
    const { newPlayField, newTetrimino } = this.tetriminoMovementHandler[action](playField, currentTetrimino)
    
    newState.playerAction[action] = true
    newState.currentTetrimino = newTetrimino
    newState.playField = newPlayField
    this.setAppState(newState)

  }

  softdrop(eventData) {
    
    const { strokeType } = eventData
    const { softdrop } = this.localState.playerAction
    const { playField, currentTetrimino } = this.localState

    if (strokeType === 'keyup')  {
      const stateCopy = makeCopy(this.localState)
      
      // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
      clearInterval(this.localState.fallIntervalId)
      stateCopy.fallIntervalId = null
      stateCopy.fallSpeed = this.localState.fallSpeed / .02
      stateCopy.playerAction.softdrop = false
      this.setAppState(stateCopy)
      return
    }


    if (strokeType === 'keydown')  {

      if (softdrop) {
        // Let softdrop continue in the engine
        return
      }

      const newState = makeCopy(this.localState)
      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('down', playField, currentTetrimino)
      
      // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
      clearInterval(this.localState.fallIntervalId)
  
      newState.fallIntervalId = null
      newState.fallSpeed = this.localState.fallSpeed * .02
      newState.playField = newPlayField
      newState.currentTetrimino = newTetrimino
      newState.playerAction.softdrop = true
      this.setAppState(newState)
      return
    }

  }
  
  harddrop(eventData) {

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

    let { playField, currentTetrimino } = newState
    let keepDropping = true
    let linesDropped = 0

    while (keepDropping) {
      const {       
        newPlayField,
        newTetrimino,
        successfulMove
      } = this.tetriminoMovementHandler.moveOne('down', playField, currentTetrimino)

      playField = newPlayField
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

    const scoringItem = ['harddrop', scoringData]
    newState.totalScore = this.scoringHandler.updateScore(this.localState, scoringItem)
    
    newState.playerAction.harddrop = true
    newState.currentGamePhase = 'pattern'
    newState.playField = playField
    newState.currentTetrimino = currentTetrimino
    this.setAppState(newState)
  }

  // TODO: 
  hold(eventData) {

    const { strokeType } = eventData
    const { playerAction } = this.localState

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
      const { currentTetrimino } = this.localState

      // Remove the swapped out tetrimino from the playField
      this.tetriminoMovementHandler.

      // Generate a new tetrimino of the current one to put in the hold queue
      newState.currentGamePhase = 'generation'
      newState.playerAction.hold = strokeType === 'keyup' ? false : true
      newState.holdQueue = {
          swapStatus: 'justSwapped',
          heldTetrimino: this.tetriminoFactory.resetTetrimino(currentTetrimino)
        }
      newState.currentTetrimino = heldTetrimino ? heldTetrimino : null



      this.setAppState(newState)
      return
    }

    // For all other cases...
    newState.playerAction.hold = false
    this.setAppState(newState)
  }

  pausegame(eventData) {}
  
}