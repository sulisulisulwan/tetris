import BasePhase from "./BasePhase.js";



export default class Pregame extends BasePhase {
  
  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute(appState, setAppState) {
    console.log('>>> PREGAME PHASE')
    this.syncToLocalState(appState)
  }

}