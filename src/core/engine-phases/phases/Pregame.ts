import { appStateIF } from "../../../interfaces/AppState.js";
import { sharedHandlersIF } from "../interfaces/SharedHandlers.js";
import BasePhase from "./BasePhase.js";



export default class Pregame extends BasePhase {
  
  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  // TODO: This phase should load in all of the options. Take into account default options
  execute() {
    console.log('>>> PREGAME PHASE')
    if (this.localState.pregameIntervalId === null) {
      const newState = {} as appStateIF
      newState.pregameIntervalId = setInterval(this.pregameIntervalEvent.bind(this), 0)
      this.setAppState(newState)
    }
      
  }

  pregameIntervalEvent() {
    const newState = {} as appStateIF
    if (this.localState.pregameCounter === 1) {
      clearInterval(this.localState.pregameIntervalId)
      newState.pregameIntervalId = null
      newState.currentGamePhase = 'generation'
      this.setAppState(newState)
    }
    newState.pregameCounter = this.localState.pregameCounter - 1
    
    this.setAppState(newState)
  }

}