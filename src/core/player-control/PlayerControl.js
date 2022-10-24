import { TetriminoFactory } from "../tetriminos/TetriminoFactory.js"
import { makeCopy } from "../utils/utils.js"
import { Scoring } from "../levels-and-scoring/Scoring.js"
import { SuperRotationSystem } from "../tetriminos/movement-handler/rotation-systems/SuperRS.js"


export class PlayerControl {

  constructor(gameMode) {
    
    this.tetriminoFactory = new TetriminoFactory()
    this.scoringSystem = new Scoring(gameMode)
    this.tetriminoMovementHandlersMap = new Map([
      // ['classic', ClassicRotationSystem]
      ['super', SuperRotationSystem] 
    ])
    this.tetriminoMovementHandler = this.setTetriminoMovementHandler('super')
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

  setTetriminoMovementHandler(mode) {
    const ctor = this.tetriminoMovementHandlersMap.get(mode)
    return new ctor()
  }

  keystrokeHandler(e, setState, state) {

    if (!['falling', 'lock'].includes(state.currentGamePhase)) {
      return 
    }
    
    const eventData = {
      key: e.key,
      strokeType: e.type
    }

    const action = this.keystrokeMap.get(eventData.key)

    if (!action || state.currentTetrimino.status === 'locked') {
      return
    }

    eventData.action = action
    this[action](setState, state, eventData)
  }

  left(setState, stateData, eventData) {
    this.leftAndRight(setState, stateData, eventData)
  }

  right(setState, stateData, eventData) {
    this.leftAndRight(setState, stateData, eventData)
  }

  flipCounterClockwise(setState, stateData, eventData) {
    this.flip(setState, stateData, eventData)
  }
  
  flipClockwise(setState, stateData, eventData) {
    this.flip(setState, stateData, eventData)
  }


  leftAndRight(setState, stateData, eventData) {
    const { playerAction, playField, currentTetrimino } = stateData
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

    const stateCopy = makeCopy(stateData)
    // Validate and apply the override action
    if (override === 'left') {

      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('left', playField, currentTetrimino)
      
      stateCopy.playField = newPlayField
      stateCopy.currentTetrimino = newTetrimino
      stateCopy.playerAction.autoRepeat.override = override
      stateCopy.playerAction.autoRepeat.left = left ? left : stateCopy.playerAction.autoRepeat.left
      stateCopy.playerAction.autoRepeat.right = right ? right : stateCopy.playerAction.autoRepeat.right

      setState(stateCopy)

    } else if (override === 'right') {
      const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('right', playField, currentTetrimino)
      stateCopy.playField = newPlayField
      stateCopy.currentTetrimino = newTetrimino
      stateCopy.playerAction.autoRepeat.override = override
      stateCopy.playerAction.autoRepeat.left = left ? left : stateCopy.playerAction.autoRepeat.left
      stateCopy.playerAction.autoRepeat.right = right ? right : stateCopy.playerAction.autoRepeat.right

      setState(stateCopy)

    } else if (override === null) {
      stateCopy.playerAction.autoRepeat.override = override
      stateCopy.playerAction.autoRepeat.left = left ? left : false
      stateCopy.playerAction.autoRepeat.right = right ? right : false

      setState(stateCopy)
    }

    return
  }

  flip(setState, stateData, eventData) {

    const { playField, currentTetrimino } = stateData
    const { strokeType, action } = eventData

    if (strokeType === 'keydown' && stateData.playerAction[action]) {
      return
    }

    const stateCopy = makeCopy(stateData)

    if (strokeType === 'keyup') {
      stateCopy.playerAction[action] = false
      setState(stateCopy)
      return
    }
    
    const { newPlayField, newTetrimino } = this.tetriminoMovementHandler[action](playField, currentTetrimino)
    
    stateCopy.playerAction[action] = true
    stateCopy.currentTetrimino = newTetrimino
    stateCopy.playField = newPlayField
    setState(stateCopy)

  }

  softdrop(setState, stateData, eventData) {
    /**
     * Instead of calling tetriminoMovementHandler here, we let the falling phase engine
     * handle it as it should be an immediate drop.
     */
    
    // ArrowDown = softdrop 
    // Soft drop is 20 times faster than current drop time
    // This is an immediate auto repeat.  Only ceases when keystroke lifted
    // Lockdown does not occur till lock timer completed
    // Softdrop action should continue even after termino is 
    //locked and new termino generates while key is kept pressed
    const { strokeType } = eventData
    const { softdrop } = stateData.playerAction
    const { playField, currentTetrimino } = stateData

    // if (softdrop && strokeType === 'keyup')  {
    if (strokeType === 'keyup')  {
      const stateCopy = makeCopy(stateData)
      stateCopy.playerAction.softdrop = false
      setState(stateCopy)
      return
    }


    if (softdrop && strokeType === 'keydown')  {
      const stateCopy = makeCopy(stateData)
      const { newPlayField, newTetrimino, successfulMove } = this.tetriminoMovementHandler.moveOne('down', playField, currentTetrimino)

      let totalScore

      if (successfulMove) {
        const scoreData = { currentScore: stateCopy.totalScore }
        const scoreItem = ['softdrop', scoreData]

        totalScore = this.scoringSystem.updateScore(stateCopy, scoreItem)
      }
      
      stateCopy.totalScore = totalScore || stateCopy.totalScore
      stateCopy.playField = newPlayField
      stateCopy.currentTetrimino = newTetrimino
      setState(stateCopy)
      return
    }
    
    const stateCopy = makeCopy(stateData)
    const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('down', playField, currentTetrimino)
    stateCopy.playField = newPlayField
    stateCopy.currentTetrimino = newTetrimino
    stateCopy.playerAction.softdrop = true
    setState(stateCopy)
  }
  
  harddrop(setState, stateData, eventData) {

    const { strokeType } = eventData

    if (strokeType === 'keydown' && stateData.playerAction.harddrop) {
      return
    }
    const stateCopy = makeCopy(stateData)

    if (strokeType === 'keyup') {
      stateCopy.playerAction.harddrop = false
      setState(stateCopy)
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
      currentScore: stateData.totalScore,
      linesDropped
    }

    const scoringItem = ['harddrop', scoringData]
    stateCopy.totalScore = this.scoringSystem.updateScore(stateData, scoringItem)
    
    stateCopy.playerAction.harddrop = true
    stateCopy.currentGamePhase = 'pattern'
    stateCopy.playField = playField
    stateCopy.currentTetrimino = currentTetrimino
    setState(stateCopy)
  }

  // TODO: 
  hold(setState, stateData, eventData) {

    const { strokeType } = eventData
    const { playerAction } = stateData

    if (strokeType === 'keydown' && stateData.playerAction.hold) {
      return
    }

    let { swapStatus } = stateData.holdQueue
    if (swapStatus === 'swapAvailableNow') {

      let { heldTetrimino } = stateData.holdQueue
      const { currentTetrimino } = stateData

      const newHoldQueueTetrimino = this.tetriminoFactory.resetTetrimino(currentTetrimino)

      swapStatus = 'justSwapped'

      // In the case where hold is used for the first time in game,
      // the current held tetrimino will be null and swapped for the
      // current tetrimino, which should, in essence return the game state
      // to the first drop of the game, except with a filled hold queue
      setState(prevState => ({
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

    setState(prevState => ({
      ...prevState,
      playerAction: { 
        ...prevState.playerAction,
        hold: strokeType === 'keyup' ? false : true
      },
    }))
  }

  pausegame(setState, stateData, eventData) {}
  
}