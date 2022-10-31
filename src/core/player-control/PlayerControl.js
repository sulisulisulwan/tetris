import { TetriminoFactory } from "../tetriminos/TetriminoFactory.js"
import { makeCopy } from "../utils/utils.js"
import { SharedScope } from "../SharedScope.js"
import { leftAndRight, flip, softdrop, harddrop, hold, pauseGame } from "./actions/index.js"
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
      ['F1','pauseGame'],
      ['Escape','pauseGame'],
    ])

    this.actionLeftAndRight = leftAndRight.bind(this)
    this.actionFlip = flip.bind(this)
    this.actionSoftdrop = softdrop.bind(this)
    this.actionHarddrop = harddrop.bind(this)
    this.actionHold = hold.bind(this)
    this.actionPauseGame = pauseGame.bind(this)
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

    if (action === 'left' 
      || action === 'right'
      || action === 'flipClockwise'
      || action === 'flipCounterClockwise'
    ) {
      if (this.localState.extendedLockdownMovesRemaining === 0) {
        return
      }
    }


    if (!action || this.localState.currentTetrimino.status === 'locked') {
      return
    }

    eventData.action = action
    this[action](eventData)
  }

  left(eventData) {
    this.actionLeftAndRight(eventData)
  }

  right(eventData) {
    this.actionLeftAndRight(eventData)
  }

  flipCounterClockwise(eventData) {
    this.actionFlip(eventData)
  }
  
  flipClockwise(eventData) {
    this.actionFlip(eventData)
  }

  softdrop(eventData) {
    this.actionSoftdrop(eventData)
  }
  
  harddrop(eventData) {
    this.actionHarddrop(eventData)
  }

  hold(eventData) {
    this.actionHold(eventData)
  }

  pauseGame(eventData) {
    this.actionPauseGame()
  }
  
}