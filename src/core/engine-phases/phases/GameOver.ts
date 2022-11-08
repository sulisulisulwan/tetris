import { appStateIF, sharedHandlersIF } from "../../../interfaces/index.js"
import BasePhase from "./BasePhase.js"

export default class GameOver extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  
  execute() {
    console.log('>>>> GAME OVER')

    const newState = {} as appStateIF
    newState.currentGamePhase = 'off'
    this.setAppState(newState)

  }

}