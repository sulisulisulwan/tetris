import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";



export default class Off extends BasePhase {

  constructor() {
    super()
    this.localState = {}
  }

  syncToLocalState(appState) {
    this.localState = appState
  }

  execute(appState, setAppState) {
    console.log('>>>> OFF PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)

    clearInterval(stateData.fallIntervalId)
    clearTimeout(stateData.lockIntervalId)
  }

}

/**
 * In this phase, the engine looks for patterns made from Locked down Blocks in the Matrix. 
 * once a pattern has been matched, it can trigger any number of tetris variant-related effects.
 * the classic pattern is the Line Clear pattern. this pattern is matched when one or more rows 
 * of 10 horizontally aligned Matrix cells are occupied by Blocks. the matching Blocks are then 
 * marked for removal on a hit list. Blocks on the hit list are cleared from the Matrix at a later  
 * time in the eliminate Phase.
 */