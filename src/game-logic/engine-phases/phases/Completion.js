import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";



export default class Completion extends BasePhase {

  constructor() {
    super()
    this.localState = {}
  }

  syncToLocalState(appState) {
    this.localState = appState
  }

  execute(appState, setAppState) {
    // console.log('>>>> COMPLETION PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)

    setAppState({
      currentGamePhase: 'generation'
    })
  }

}

/**
 * this is where any updates to information fields on the tetris playfield are updated, 
 * such as the Score and time. the Level up condition is also checked to see if it is 
 * necessary to advance the game level.
 */