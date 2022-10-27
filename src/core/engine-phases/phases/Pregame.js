import BasePhase from "./BasePhase.js";



export default class Pregame extends BasePhase {
  
  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  // TODO: This phase should load in all of the options. Take into account default options
  execute() {
    console.log('>>> PREGAME PHASE')
    if (this.localState.pregameIntervalId === null) {
      const newState = {}
      newState.pregameIntervalId = setInterval(this.pregameIntervalEvent.bind(this), 1000)
      this.setAppState(newState)
    }
      
  }

  pregameIntervalEvent() {
    const newState = {}
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