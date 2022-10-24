import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";
import { SuperRotationSystem } from "../../tetriminos/rotation-systems/SuperRS.js";

export default class Falling extends BasePhase {

  constructor() {
    super()
    this.localState = {}
    this.tetriminoMovementHandlersMap = new Map([
      // ['classic', ClassicRotationSystem]
      ['super', SuperRotationSystem] 
    ])
    this.tetriminoMovementHandler = this.setTetriminoMovementHandler('super')
  }

  setTetriminoMovementHandler(mode) {
    const ctor = this.tetriminoMovementHandlersMap.get(mode)
    return new ctor()
  }

  syncToLocalState(appState) {
    this.localState = appState
  }

  execute(appState, setAppState) {
    // console.log('>>>> FALLING PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)
    /**
     * TODO: If phase has already been in motion and player soft drop is in motion,
     * if (stateData.playerAction.softDrop === true) {
     * // If softDrop has just been commanded, clear the intervallic falling event.
     *   if (stateData.fallIntervalId) {
     *     // clear interval and set fallIntervalId to null
     *     return
     *   }
     * } 
     */  
    if (appState.fallIntervalId === null) {
      setAppState({ fallIntervalId: this.setContinuousFallEvent(appState, setAppState) })
    }
    
  }

  setContinuousFallEvent(appState, setAppState) {
    return setInterval(this.continuousFallEvent.bind(this), appState.fallSpeed, setAppState)
  }

  continuousFallEvent(setAppState) {
    const { playField, currentTetrimino, fallIntervalId } = this.localState

    const { 
      newPlayField, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playField, currentTetrimino)

    if (successfulMove)  {
      setAppState(prevState => {
        return {
          ...prevState,
          currentTetrimino: newTetrimino,
          playField: newPlayField 
        } 
      })
      return
    }
    
    clearInterval(fallIntervalId)
    setAppState({
      fallIntervalId: null,
      currentGamePhase: 'lock',
    })
  }
  
}