import { appStateIF } from "../../../interfaces/AppState.js";
import { sharedHandlersIF } from "../interfaces/SharedHandlers.js";
import BasePhase from "./BasePhase.js";

export default class Animate extends BasePhase {
  
  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>>> ANIMATE PHASE')

    const newState = {} as appStateIF
    newState.currentGamePhase = 'eliminate'
    this.setAppState(newState)
  }
}

/**
 * Here, any animation scripts are executed within the Matrix. the tetris engine 
 * moves on to the eliminate Phase once all animation scripts have been run.
 */