import BasePhase from "./BasePhase.js";
export default class Pregame extends BasePhase {
  
  constructor(handlerProps) {
    super()
    this.handlerProps = handlerProps
  }

  exec() {
    console.log('Pregame phase executed')
  }

}