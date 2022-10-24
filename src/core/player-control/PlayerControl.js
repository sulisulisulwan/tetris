import { TetriminoFactory } from "../tetriminos/TetriminoFactory.js"
import { makeCopy } from "../utils/utils.js"
import { SharedScope } from "../SharedScope.js"

export class PlayerControl extends SharedScope {

  constructor(sharedHandlers) {
    super(sharedHandlers)
    this.tetriminoFactory = new TetriminoFactory()
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

    const stateCopy = makeCopy(this.localState)
    // Validate and apply the override action
    if (override === 'left') {

      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('left', playField, currentTetrimino)
      
      stateCopy.playField = newPlayField
      stateCopy.currentTetrimino = newTetrimino
      stateCopy.playerAction.autoRepeat.override = override
      stateCopy.playerAction.autoRepeat.left = left ? left : stateCopy.playerAction.autoRepeat.left
      stateCopy.playerAction.autoRepeat.right = right ? right : stateCopy.playerAction.autoRepeat.right

      this.setAppState(stateCopy)

    } else if (override === 'right') {
      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('right', playField, currentTetrimino)
      stateCopy.playField = newPlayField
      stateCopy.currentTetrimino = newTetrimino
      stateCopy.playerAction.autoRepeat.override = override
      stateCopy.playerAction.autoRepeat.left = left ? left : stateCopy.playerAction.autoRepeat.left
      stateCopy.playerAction.autoRepeat.right = right ? right : stateCopy.playerAction.autoRepeat.right

      this.setAppState(stateCopy)

    } else if (override === null) {
      stateCopy.playerAction.autoRepeat.override = override
      stateCopy.playerAction.autoRepeat.left = left ? left : false
      stateCopy.playerAction.autoRepeat.right = right ? right : false

      this.setAppState(stateCopy)
    }

    return
  }

  flip(eventData) {

    const { playField, currentTetrimino } = this.localState
    const { strokeType, action } = eventData

    if (strokeType === 'keydown' && this.localState.playerAction[action]) {
      return
    }

    const stateCopy = makeCopy(this.localState)

    if (strokeType === 'keyup') {
      stateCopy.playerAction[action] = false
      this.setAppState(stateCopy)
      return
    }
    
    const { newPlayField, newTetrimino } = this.tetriminoMovementHandler[action](playField, currentTetrimino)
    
    stateCopy.playerAction[action] = true
    stateCopy.currentTetrimino = newTetrimino
    stateCopy.playField = newPlayField
    this.setAppState(stateCopy)

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

      const stateCopy = makeCopy(this.localState)
      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('down', playField, currentTetrimino)
      
      // Clear interval as soon as possible so that engine can begin next fall interval immediately without rerendering?
      clearInterval(this.localState.fallIntervalId)
  
      stateCopy.fallIntervalId = null
      stateCopy.fallSpeed = this.localState.fallSpeed * .02
      stateCopy.playField = newPlayField
      stateCopy.currentTetrimino = newTetrimino
      stateCopy.playerAction.softdrop = true
      this.setAppState(stateCopy)
      return
    }

  }
  
  harddrop(eventData) {

    const { strokeType } = eventData

    if (strokeType === 'keydown' && this.localState.playerAction.harddrop) {
      return
    }
    const stateCopy = makeCopy(this.localState)

    if (strokeType === 'keyup') {
      stateCopy.playerAction.harddrop = false
      this.setAppState(stateCopy)
      return
    }

    let { playField, currentTetrimino } = stateCopy
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
    stateCopy.totalScore = this.scoringHandler.updateScore(this.localState, scoringItem)
    
    stateCopy.playerAction.harddrop = true
    stateCopy.currentGamePhase = 'pattern'
    stateCopy.playField = playField
    stateCopy.currentTetrimino = currentTetrimino
    this.setAppState(stateCopy)
  }

  // TODO: 
  hold(eventData) {

    const { strokeType } = eventData
    const { playerAction } = this.localState

    if (strokeType === 'keydown' && this.localState.playerAction.hold) {
      return
    }

    let { swapStatus } = this.localState.holdQueue
    if (swapStatus === 'swapAvailableNow') {

      let { heldTetrimino } = this.localState.holdQueue
      const { currentTetrimino } = this.localState

      const newHoldQueueTetrimino = this.tetriminoFactory.resetTetrimino(currentTetrimino)

      swapStatus = 'justSwapped'

      // In the case where hold is used for the first time in game,
      // the current held tetrimino will be null and swapped for the
      // current tetrimino, which should, in essence return the game state
      // to the first drop of the game, except with a filled hold queue
      this.setAppState(prevState => ({
        ...prevState,
        currentGamePhase: 'generation',
        playerAction: { 
          ...prevState.playerAction,
          hold: strokeType === 'keyup' ? false : true
        },
        holdQueue: {
          swapStatus,
          heldTetrimino: newHoldQueueTetrimino
        },
        currentTetrimino: heldTetrimino
      }))

      return
    }

    this.setAppState(prevState => ({
      ...prevState,
      playerAction: { 
        ...prevState.playerAction,
        hold: strokeType === 'keyup' ? false : true
      },
    }))
  }

  pausegame(eventData) {}
  
}