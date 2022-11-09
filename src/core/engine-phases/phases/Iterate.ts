import { appStateIF, sharedHandlersIF } from "../../../interfaces";
import BasePhase from "./BasePhase";

export default class Iterate extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  
  execute() {
    // console.log('>>>> ITERATE PHASE')
    const newState = {} as appStateIF
    newState.currentGamePhase = 'animate'

    this.setAppState(newState)
  }

}

/**
 * In this phase, the engine is given a chance to scan through all cells in 
 * the Matrix and evaluate or manipulate them according to an editor-defined 
 * iteration script. this phase consumes no apparent game time. note: this
 * phase is included in the engine to allow for more complicated variants in 
 * the future, and has thus far not been used.
 */