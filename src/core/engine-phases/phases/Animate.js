import BasePhase from "./BasePhase.js";

export default class Animate extends BasePhase {
  
  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute(appState, setAppState) {
    // console.log('>>>> ANIMATE PHASE')
    this.syncToLocalState(appState)

    setAppState({
      currentGamePhase: 'eliminate'
    })
  }
}

/**
 * Here, any animation scripts are executed within the Matrix. the tetris engine 
 * moves on to the eliminate Phase once all animation scripts have been run.
 */