import { appStateIF, sharedHandlersIF } from "../../../interfaces/index";
import BasePhase from "./BasePhase";

export default class Completion extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  
  public execute() {
    // console.log('>>>> COMPLETION PHASE')
    let newState = {} as appStateIF

    newState.currentTetrimino = null
    newState.performedTSpin = false
    newState.performedTSpinMini = false
    newState.currentGamePhase = 'generation'
    this.setAppState(newState)
  }

}

/**
 * this is where any final updates to state are made for the next engine cycle
 */