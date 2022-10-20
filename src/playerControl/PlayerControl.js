import { TetriminoMovementHandler } from "../components/tetriminos/TetriminoMovementHandler.js"
import { TetriminoFactory } from "../components/tetriminos/TetriminoFactory.js"
import { makeCopy } from '../utils/utils.js'
export class PlayerControl {

  constructor() {

    this.tetriminoMovementHandler = new TetriminoMovementHandler()
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

  keystrokeHandler(e, setState, state) {

    e.preventDefault()

    if (!['falling', 'lock'].includes(state.currentGamePhase)) {
      return 
    }
    
    const eventData = {
      key: e.key,
      strokeType: e.type
    }

    const action = this.keystrokeMap.get(eventData.key)

    if (!action) {
      return
    }
    const stateData = { 
      playerAction: state.playerAction,
      playField: makeCopy(state.playField),
      tetrimino: makeCopy(state.currentTetrimino)
    }

    if (stateData.tetrimino.status === 'locked') {
      return
    }


    eventData.action = action


    this[action](setState, stateData, eventData)

  }

  left(setState, stateData, eventData) {
    this.leftAndRight(setState, stateData, eventData)
  }

  right(setState, stateData, eventData) {
    this.leftAndRight(setState, stateData, eventData)
  }

  leftAndRight(setState, stateData, eventData) {
    
    const { playerAction, playField, tetrimino } = stateData
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

    
    // Validate and apply the override action
    if (override === 'left') {

      
      let { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('left', playField, tetrimino)
      
      setState(prevState => {
        return ({
          ...prevState,
          playerAction: {
            ...prevState.playerAction,
            autoRepeat: {
              left,
              right,
              override
            }
          },
          playField: newPlayField,
          currentTetrimino: newTetrimino
      })})

    } else if (override === 'right') {
      let { newPlayField, newTetrimino } = this.tetriminoMovementHandler.moveOne('right', playField, tetrimino)

      setState(prevState => {
        return ({
          ...prevState,
          playerAction: {
            ...prevState.playerAction,
            autoRepeat: {
              left,
              right,
              override
            }
          },
          playField: newPlayField,
          currentTetrimino: newTetrimino
      })})
    } else if (override === null) {
      setState(prevState => {
        return ({
          ...prevState,
          playerAction: {
            ...prevState.playerAction,
            autoRepeat: {
              left,
              right,
              override
            }
          },
      })})
    }
    return
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
    let { softdrop } = stateData.playerAction

    if (softdrop) {
      if (strokeType === 'keyUp')  {
        setState(prevState => ({
          playerAction: { 
            ...prevState.playerAction,
            softdrop: false 
          }
        }))
        return
      }
      return
    }

    setState(prevState => ({
      playerAction: { 
        ...prevState.playerAction,
        softdrop: true
      }
    }))
  }
  
  harddrop(setState, stateData, eventData) {

    const { strokeType } = eventData
    const { playerAction } = stateData

    if (strokeType === 'keydown' && stateData.playerAction[playerAction]) {
      return
    }

    setState(prevState => ({
      playerAction: { 
        ...prevState.playerAction,
        [playerAction]: strokeType === 'keyup' ? false : true
      }
    }))
  }

  flipClockwise(setState, stateData, eventData) {

    const { playerAction, playField, tetrimino } = stateData
    const { strokeType } = eventData

    if (strokeType === 'keydown' && stateData.playerAction[playerAction]) {
      return
    }

    if (strokeType === 'keyup') {
      setState(prevState => ({
        playerAction: { 
          ...prevState.playerAction,
          [playerAction]: false
        },
      }))
      return
    }

    const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.flipClockwise(playField, tetrimino)

    setState(prevState => ({
      playField: newPlayField,
      playerAction: { 
        ...prevState.playerAction,
        [playerAction]: true
      },
      currentTetrimino: newTetrimino
    }))

  }

  flipCounterClockwise(setState, stateData, eventData) {

    const { playerAction, playField, tetrimino } = stateData
    const { strokeType } = eventData

    if (strokeType === 'keydown' && stateData.playerAction[playerAction]) {
      return
    }

    if (strokeType === 'keyup') {
      setState(prevState => ({
        playerAction: { 
          ...prevState.playerAction,
          [playerAction]: false
        },
      }))
      return
    }

    const { newPlayField, newTetrimino } = this.tetriminoMovementHandler.flipCounterClockwise(playField, tetrimino)

    setState(prevState => ({
      playField: newPlayField,
      playerAction: { 
        ...prevState.playerAction,
        [playerAction]: true
      },
      currentTetrimino: newTetrimino
    }))
  }

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