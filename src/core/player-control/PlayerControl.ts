import { SharedScope } from "../SharedScope.js"
import { leftAndRight, flip, softdrop, harddrop, hold, pauseGame } from "./actions/index.js"
import { appStateIF, eventDataIF, playerActionHandlersIF, sharedHandlersIF } from "../../interfaces/index.js"

export class PlayerControl extends SharedScope {

  private keystrokeMap: Map<string, string>
  private actionLeftAndRight = leftAndRight.bind(this)
  private actionFlip = flip.bind(this)
  private actionSoftdrop = softdrop.bind(this)
  private actionHarddrop = harddrop.bind(this)
  private actionHold = hold.bind(this)
  private actionPauseGame = pauseGame.bind(this)

  private playerActions: playerActionHandlersIF
  constructor(sharedHandlers: sharedHandlersIF) {


    super(sharedHandlers)
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

    this.playerActions = {
      actionLeftAndRight: leftAndRight.bind(this),
      actionFlip: flip.bind(this),
      actionSoftdrop: softdrop.bind(this),
      actionHarddrop: harddrop.bind(this),
      actionHold: hold.bind(this),
      actionPauseGame: pauseGame.bind(this)
    }

  }

  keystrokeHandler(appState: appStateIF, e: KeyboardEvent) {

    this.syncToLocalState(appState)

    if (!['falling', 'lock'].includes(this.localState.currentGamePhase)) {
      return 
    }

    const eventData: eventDataIF = {
      key: e.key,
      strokeType: e.type,
      action: this.keystrokeMap.get(e.key)
    }

    

    if (eventData.action === 'left' 
      || eventData.action === 'right'
      || eventData.action === 'flipClockwise'
      || eventData.action === 'flipCounterClockwise'
    ) {

      // If there are no more extended moves left, and the Tetrimino has touched down on a surface, any keydown actions will be ignored forcing lockdown
      if (this.localState.extendedLockdownMovesRemaining <= 0 && eventData.strokeType === 'keydown') {
        const { playfield, currentTetrimino } = this.localState
        const { successfulMove } = this.tetriminoMovementHandler.moveOne('down', playfield, currentTetrimino)
        const tetriminoOnSurface = !successfulMove
        if (tetriminoOnSurface)
        return
      }
    }

    if (!eventData.action || this.localState.currentTetrimino.status === 'locked') {
      return
    }

    // Execute the player's action
    this.playerActions[eventData.action as keyof playerActionHandlersIF](eventData)
  }

  left(eventData: eventDataIF) {
    this.actionLeftAndRight(eventData)
  }

  right(eventData: eventDataIF) {
    this.actionLeftAndRight(eventData)
  }

  flipCounterClockwise(eventData: eventDataIF) {
    this.actionFlip(eventData)
  }
  
  flipClockwise(eventData: eventDataIF) {
    this.actionFlip(eventData)
  }

  softdrop(eventData: eventDataIF) {
    this.actionSoftdrop(eventData)
  }
  
  harddrop(eventData: eventDataIF) {
    this.actionHarddrop(eventData)
  }

  hold(eventData: eventDataIF) {
    this.actionHold(eventData)
  }

  pauseGame(eventData: eventDataIF) {
    this.actionPauseGame()
  }
  
}