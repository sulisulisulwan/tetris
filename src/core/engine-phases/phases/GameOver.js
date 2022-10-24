import BasePhase from "./BasePhase.js"

export default class GameOver extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }
  
  execute() {
    console.log('>>>> GAME OVER')

    const newState = {}
    newState.currentGamePhase = 'off'
    this.setAppState(newState)

  }

}