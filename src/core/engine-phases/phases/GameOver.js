import BasePhase from "./BasePhase.js"

export default class GameOver extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }
  
  execute(appState, setAppState) {
    console.log('>>>> GAME OVER')
    this.syncToLocalState(appState)

    const newState = {}
    newState.currentGamePhase = 'off'
    setAppState(newState)

  }

}