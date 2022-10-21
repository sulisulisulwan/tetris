import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";
import { TetriminoMovementHandler } from "../../components/tetriminos/TetriminoMovementHandler.js";


export default class Falling extends BasePhase {

  constructor() {
    super()
    this.localState = {}
    this.tetriminoMovementHandler = new TetriminoMovementHandler()
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
    if (stateData.fallIntervalId === null) {
      setAppState({ fallIntervalId: this.setContinuousFallEvent(stateData, setAppState) })
    }
    
  }

  setContinuousFallEvent(stateData, setAppState) {
    return setInterval(this.continuousFallEvent.bind(this), stateData.fallSpeed, setAppState)
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