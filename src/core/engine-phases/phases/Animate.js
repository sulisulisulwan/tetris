import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";



export default class Animate extends BasePhase {
  
  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute(appState, setAppState) {
    // console.log('>>>> ANIMATE PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)

    setAppState({
      currentGamePhase: 'eliminate'
    })
  }
}

/**
 * Here, any animation scripts are executed within the Matrix. the tetris engine 
 * moves on to the eliminate Phase once all animation scripts have been run.
 */