import BasePhase from "./BasePhase.js";

export default class Iterate extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }
  
  execute(appState, setAppState) {
    // console.log('>>>> ITERATE PHASE')

    setAppState({
      currentGamePhase: 'animate'
    })
  }

}

/**
 * In this phase, the engine is given a chance to scan through all cells in 
 * the Matrix and evaluate or manipulate them according to an editor-defined 
 * iteration script. this phase consumes no apparent game time. note: this
 * phase is included in the engine to allow for more complicated variants in 
 * the future, and has thus far not been used.
 */