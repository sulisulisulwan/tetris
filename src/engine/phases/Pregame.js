import BasePhase from "./BasePhase.js";
export default class Pregame extends BasePhase {
  
  constructor(appStateSetter) {
    super()
    this.appStateSetter = appStateSetter
  }

  testAppStateSetter() {
    this.appStateSetter({
      doesthiswork: 'yay!!'
    })
  }

}