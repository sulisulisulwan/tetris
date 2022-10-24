import BasePhase from "./BasePhase.js";



export default class Pregame extends BasePhase {
  
  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    console.log('>>> PREGAME PHASE')
  }

}